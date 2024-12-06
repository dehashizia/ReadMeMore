"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
  username: string;
}

interface Book {
  book_id: number;
  title: string;
  authors: string[];
  user?: User; // Ajout de la relation avec l'utilisateur
}

const AvailableBooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/csrf-token`, {
          withCredentials: true,
        });
        setCsrfToken(response.data.csrfToken);
      } catch (err) {
        console.error("Erreur lors de la récupération du CSRF token :", err);
        setError("Impossible de récupérer le CSRF token.");
      }
    };

    fetchCsrfToken();
  }, [API_BASE_URL]);

  useEffect(() => {
    const fetchAvailableBooks = async () => {
      if (!csrfToken) return; // Attente du csrfToken avant de faire la requête

      setIsLoading(true);
      try {
        const response = await axios.get<Book[]>(`${API_BASE_URL}/api/books/available`, {
          headers: { "X-CSRF-Token": csrfToken },
          withCredentials: true,
        });
        setBooks(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des livres disponibles :", error);
        setError("Erreur lors de la récupération des livres disponibles.");
        setIsLoading(false);
      }
    };

    if (csrfToken) {
      fetchAvailableBooks();
    }
  }, [csrfToken, API_BASE_URL]);

  const requestLoan = async (bookId: number) => {
    if (!csrfToken) {
      setError("Le token CSRF est requis.");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/api/loans/request`,
        { bookId },
        {
          headers: { "X-CSRF-Token": csrfToken },
          withCredentials: true,
        }
      );
      alert("Demande de prêt envoyée !");
    } catch (error) {
      console.error("Erreur lors de la demande de prêt :", error);
      setError("Erreur lors de la demande de prêt.");
    }
  };

  return (
    <div>
      <h1>Livres disponibles pour prêt</h1>
      
      {/* Affichage de l'état de chargement ou d'erreur */}
      {isLoading && <p>Chargement des livres...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
  {books.length > 0 ? (
    books.map((book) => (
      <li key={book.book_id}>
        <h2>{book.title}</h2>
        <p>Auteur(s): {book.authors.join(", ")}</p>
        <p>
          Mis à disposition par: {book.user ? book.user.username : "Utilisateur inconnu"}
        </p>
        <button type="button" onClick={() => requestLoan(book.book_id)}>
          Faire une demande de prêt
        </button>
      </li>
    ))
  ) : (
    <p>Aucun livre disponible pour le moment.</p>
  )}
</ul>
    </div>
  );
};

export default AvailableBooksPage;