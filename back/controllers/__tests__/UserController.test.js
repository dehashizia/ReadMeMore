const request = require("supertest");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  sendConfirmationEmail,
  sendResetPasswordEmail,
} = require("../../mailer");

// Mocks
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../../mailer");
jest.mock("../../models/User", () => {
  return {
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  };
});

// Setup Express avec les routes exactes de l'application
const app = express();
app.use(express.json());

// Import controller
const UserController = require("../UserController");

// Setup routes selon votre userRoutes.js
app.post("/register", UserController.register);
app.post("/login", UserController.login);
app.get("/profile", UserController.getProfile);
app.put("/profile", UserController.updateProfile);
app.delete("/profile", UserController.deleteAccount);
app.get("/confirm-email", UserController.confirmEmail);
app.post("/forgot-password", UserController.forgotPassword);
app.post("/reset-password", UserController.resetPassword);

// Mock console methods
beforeAll(() => {
  console.log = jest.fn();
  console.error = jest.fn();
});

describe("UserController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    const validUser = {
      username: "testuser",
      email: "test@example.com",
      password: "Password123!",
      confirmPassword: "Password123!",
    };

    it("should successfully register a new user", async () => {
      const hashedPassword = "hashedPassword123";
      const token = "mockToken123";
      const emailToken = "emailToken123";

      bcrypt.hash.mockResolvedValue(hashedPassword);
      jwt.sign.mockReturnValue(token);
      const User = require("../../models/User");
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        user_id: 1,
        ...validUser,
        password: hashedPassword,
      });
      sendConfirmationEmail.mockResolvedValue();

      const response = await request(app).post("/register").send(validUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("token");
      expect(response.body.message).toBe("Utilisateur enregistré avec succès");
    });

    it("should return 400 if email already exists", async () => {
      const User = require("../../models/User");
      User.findOne.mockResolvedValue({ email: validUser.email });

      const response = await request(app).post("/register").send(validUser);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("L'adresse e-mail est déjà utilisée.");
    });

    it("should return 400 if password validation fails", async () => {
      const invalidUser = {
        ...validUser,
        password: "weak",
        confirmPassword: "weak",
      };

      const response = await request(app).post("/register").send(invalidUser);

      expect(response.status).toBe(400);
    });
  });

  describe("login", () => {
    const loginCredentials = {
      email: "test@example.com",
      password: "Password123!",
    };

    it("should successfully login a user", async () => {
      const User = require("../../models/User");
      User.findOne.mockResolvedValue({
        user_id: 1,
        email: loginCredentials.email,
        password: "hashedPassword",
      });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("mockToken");

      const response = await request(app).post("/login").send(loginCredentials);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body.message).toBe("Utilisateur connecté avec succès");
    });

    it("should return 401 for invalid credentials", async () => {
      const User = require("../../models/User");
      User.findOne.mockResolvedValue({
        email: loginCredentials.email,
        password: "hashedPassword",
      });
      bcrypt.compare.mockResolvedValue(false);

      const response = await request(app).post("/login").send(loginCredentials);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Email ou mot de passe incorrect.");
    });
  });

  describe("getProfile", () => {
    it("should return user profile when valid token is provided", async () => {
      const mockUser = {
        user_id: 1,
        username: "testuser",
        email: "test@example.com",
        role_id: 1,
        profile_photo: "photo.jpg",
      };

      jwt.verify.mockReturnValue({ userId: 1 });
      const User = require("../../models/User");
      User.findOne.mockResolvedValue(mockUser);

      const response = await request(app)
        .get("/profile")
        .set("Authorization", "Bearer validToken");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("username", mockUser.username);
      expect(response.body).toHaveProperty("email", mockUser.email);
    });

    it("should return 401 when no token is provided", async () => {
      const response = await request(app).get("/profile");

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Token manquant");
    });
  });

  describe("updateProfile", () => {
    it("should successfully update user profile", async () => {
      const updateData = {
        username: "newUsername",
        email: "newemail@example.com",
      };

      jwt.verify.mockReturnValue({ userId: 1 });
      const User = require("../../models/User");
      User.update.mockResolvedValue([1]);

      const response = await request(app)
        .put("/profile")
        .set("Authorization", "Bearer validToken")
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Profil mis à jour avec succès");
    });
  });

  describe("deleteAccount", () => {
    it("should successfully delete user account", async () => {
      jwt.verify.mockReturnValue({ userId: 1 });
      const User = require("../../models/User");
      User.destroy.mockResolvedValue(1);

      const response = await request(app)
        .delete("/profile")
        .set("Authorization", "Bearer validToken");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Compte supprimé avec succès");
    });
  });

  describe("confirmEmail", () => {
    it("should successfully confirm email", async () => {
      jwt.verify.mockReturnValue({ userId: 1 });
      const User = require("../../models/User");
      User.findOne.mockResolvedValue({
        user_id: 1,
        emailConfirmed: false,
        save: jest.fn().mockResolvedValue(true),
      });

      const response = await request(app)
        .get("/confirm-email")
        .query({ token: "validToken" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        "Votre adresse email a été confirmée avec succès."
      );
    });
  });

  describe("forgotPassword", () => {
    it("should successfully initiate password reset", async () => {
      const User = require("../../models/User");
      User.findOne.mockResolvedValue({ user_id: 1, email: "test@example.com" });
      jwt.sign.mockReturnValue("resetToken");
      sendResetPasswordEmail.mockResolvedValue();

      const response = await request(app)
        .post("/forgot-password")
        .send({ email: "test@example.com" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        "Un email de réinitialisation a été envoyé."
      );
    });
  });

  describe("resetPassword", () => {
    it("should successfully reset password", async () => {
      const resetData = {
        token: "validResetToken",
        password: "newPassword123!",
      };

      jwt.verify.mockReturnValue({ userId: 1 });
      const User = require("../../models/User");
      User.findOne.mockResolvedValue({
        user_id: 1,
        save: jest.fn().mockResolvedValue(true),
      });
      bcrypt.hash.mockResolvedValue("hashedNewPassword");

      const response = await request(app)
        .post("/reset-password")
        .send(resetData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        "Mot de passe réinitialisé avec succès."
      );
    });
  });
});
