const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");

// Mock des modèles
jest.mock("../../models/Library", () => {
  return {
    create: jest.fn(),
    findOne: jest.fn(),
  };
});

jest.mock("../../models/Book", () => {
  return {
    findByPk: jest.fn(),
  };
});

jest.mock("../../models/User", () => {
  return {
    findByPk: jest.fn(),
  };
});

// Mock du module JWT
jest.mock("jsonwebtoken", () => ({
  verify: jest.fn((token, secret) => {
    if (!token) throw new Error("Token invalide.");
    return { userId: 1 }; // retourne un user mock par défaut
  }),
}));

// Initialisation de l'application Express pour les tests
const app = express();
app.use(express.json());

// Importer le contrôleur
const { addToLibrary } = require("../LibraryController");
app.post("/api/library/add", addToLibrary);

// Mock de console.log et console.error
let originalConsoleLog;
let originalConsoleError;

beforeAll(() => {
  originalConsoleLog = console.log;
  originalConsoleError = console.error;
  console.log = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
});

describe("LibraryController - addToLibrary", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 500 when no token is provided", async () => {
    const response = await request(app)
      .post("/api/library/add")
      .send({ book_id: 1, status: "read" });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Authentification requise.");
  });

  it("should return 400 when no book_id or status is provided", async () => {
    // Simuler un token valide
    jwt.verify.mockReturnValue({ userId: 1 });

    const response = await request(app)
      .post("/api/library/add")
      .set("Authorization", "Bearer validtoken")
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("ID du livre et statut requis.");
  });

  it("should return 400 if the book already exists in the user's library", async () => {
    const mockLibraryEntry = { book_id: 1, user_id: 1 };
    jwt.verify.mockReturnValue({ userId: 1 });
    require("../../models/Library").findOne.mockResolvedValue(mockLibraryEntry);

    const response = await request(app)
      .post("/api/library/add")
      .set("Authorization", "Bearer validtoken")
      .send({ book_id: 1, status: "read" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Ce livre est déjà dans votre bibliothèque."
    );
  });

  it("should successfully add a book to the library", async () => {
    const newLibraryEntry = { user_id: 1, book_id: 1, status: "read" };
    jwt.verify.mockReturnValue({ userId: 1 });
    require("../../models/Library").findOne.mockResolvedValue(null);
    require("../../models/Library").create.mockResolvedValue(newLibraryEntry);

    const response = await request(app)
      .post("/api/library/add")
      .set("Authorization", "Bearer validtoken")
      .send({ book_id: 1, status: "read" });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Livre ajouté à votre bibliothèque.");
    expect(response.body.libraryEntry).toEqual(newLibraryEntry);
  });

  it("should return 500 if there is an error in adding the book", async () => {
    jwt.verify.mockReturnValue({ userId: 1 });
    require("../../models/Library").findOne.mockResolvedValue(null);
    require("../../models/Library").create.mockRejectedValue(
      new Error("Database error")
    );

    const response = await request(app)
      .post("/api/library/add")
      .set("Authorization", "Bearer validtoken")
      .send({ book_id: 1, status: "read" });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Database error");
  });

  it("should return 500 if token is invalid", async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("Token invalide.");
    });

    const response = await request(app)
      .post("/api/library/add")
      .set("Authorization", "Bearer invalidtoken")
      .send({ book_id: 1, status: "read" });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Token invalide.");
  });
});
