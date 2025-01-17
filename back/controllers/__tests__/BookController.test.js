const { Op } = require("sequelize");
const request = require("supertest");
const express = require("express");

// Mock des modèles
jest.mock("../../models/Book", () => {
  return {
    belongsTo: jest.fn(),
    findAll: jest.fn(),
  };
});
jest.mock("../../models/Category", () => {
  return {
    // Mock de Category si nécessaire
  };
});
jest.mock("../../models/LoanRequest", () => {
  return {
    belongsTo: jest.fn(),
    // Ajoutez d'autres mocks si nécessaire
  };
});

// Importer les modèles après les avoir mockés
const { Book, Category, sequelize } = require("../../models");

// Configuration de l'app Express pour les tests
const app = express();
app.use(express.json());

// Importer les routes
const bookRoutes = require("../../routes/bookRoutes");
app.use("/api", bookRoutes);

// Mock de console.log et console.error
let originalConsoleLog;
let originalConsoleError;

beforeAll(async () => {
  // Initialiser la connexion à la base de données avant les tests
  await sequelize.authenticate();

  // Mocker les logs
  originalConsoleLog = console.log;
  originalConsoleError = console.error;
  console.log = jest.fn();
  console.error = jest.fn();
});

afterAll(async () => {
  // Fermer la connexion après les tests
  await sequelize.close();

  // Restaurer les logs
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
});

describe("BookController - searchBooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 when no search query is provided", async () => {
    const response = await request(app).get("/api/search-books").query({});
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Veuillez fournir un terme de recherche.");
  });

  it("should return books from database when found", async () => {
    // Simuler la réponse de findAll
    Book.findAll.mockResolvedValue([
      {
        book_id: 1,
        title: "Harry Potter",
        authors: ["J.K. Rowling"],
        category: { category_name: "Fantasy" },
        toJSON: () => ({
          book_id: 1,
          title: "Harry Potter",
          authors: ["J.K. Rowling"],
          category: { category_name: "Fantasy" },
        }),
      },
    ]);

    const response = await request(app)
      .get("/api/search-books")
      .query({ query: "Harry Potter" });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0].title).toBe("Harry Potter");
    expect(Book.findAll).toHaveBeenCalledWith({
      where: { title: { [Op.iLike]: "%Harry Potter%" } },
      include: {
        model: Category,
        as: "category",
        attributes: ["category_name"],
      },
    });
  });

  it("should handle database errors gracefully", async () => {
    // Simuler une erreur de recherche
    Book.findAll.mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .get("/api/search-books")
      .query({ query: "test" });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe(
      "Une erreur s'est produite lors de la recherche de livres."
    );
  });

  it("should handle database connection errors gracefully", async () => {
    // Simuler l'échec de la connexion Sequelize
    const mockAuthenticate = jest
      .fn()
      .mockRejectedValue(new Error("Database connection error"));

    // Remplacer la fonction authenticate de sequelize avec la fonction mockée
    sequelize.authenticate = mockAuthenticate;

    const response = await request(app)
      .get("/api/search-books")
      .query({ query: "test" });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe(
      "Une erreur s'est produite lors de la recherche de livres."
    );
  });
});
