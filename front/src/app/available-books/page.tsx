"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowAltCircleRight, FaQrcode } from "react-icons/fa";
import { UserIcon, BookOpenIcon, MagnifyingGlassIcon, InformationCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa"; // Assurez-vous d'importer les icônes

interface User {
  username: string;
}

interface Book {
  book_id: number;
  title: string;
  authors: string[];
  thumbnail: string;
  user?: User; // Ajout de la relation avec l'utilisateur
}

const AvailableBooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
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
    // Récupération du token d'authentification dans le localStorage
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const fetchAvailableBooks = async () => {
      if (!csrfToken || !token) return; // Attente du csrfToken et token d'authentification

      setIsLoading(true);
      try {
        const response = await axios.get<Book[]>(`${API_BASE_URL}/api/books/available`, {
          headers: {
            "Authorization": `Bearer ${token}`, // Ajout du token dans l'en-tête Authorization
            "X-CSRF-Token": csrfToken, // En-tête CSRF token
          },
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

    if (csrfToken && token) {
      fetchAvailableBooks();
    }
  }, [csrfToken, token, API_BASE_URL]);

  const requestLoan = async (bookId: number) => {
    if (!csrfToken || !token) {
      setError("Le token CSRF et le token d'authentification sont requis.");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/api/loans/request`,
        { bookId },
        {
          headers: {
            "Authorization": `Bearer ${token}`, // Ajout du token dans l'en-tête Authorization
            "X-CSRF-Token": csrfToken, // En-tête CSRF token
          },
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
    <div className="min-h-screen  p-4 flex flex-col">
     
      {/* Header Icons */}
      <div className="absolute top-0 right-0 p-4 flex space-x-4">
        <Link href="/profile">
          <UserIcon className="w-8 h-8 text-gray-700 cursor-pointer hover:text-white transition duration-300" />
        </Link>
        <Link href="/search">
          <MagnifyingGlassIcon className="w-8 h-8 text-gray-700 cursor-pointer  hover:text-white transition duration-300" />
        </Link>
        <Link href="/my-library">
          <BookOpenIcon className="w-8 h-8 text-gray-700 cursor-pointer hover:text-white transition duration-300" />
        </Link>
        <Link href="/about">
          <InformationCircleIcon className="w-8 h-8 text-gray-700 cursor-pointer hover:text-white transition duration-300" />
        </Link>

        {/* Icône de prêt */}
        <Link href="/available-books">
          <FaArrowAltCircleRight className="w-8 h-8 text-gray-700 cursor-pointer hover:text-white transition duration-300" />
        </Link>
        {/* Icône de scan */}
        <Link href="/scan">
          <FaQrcode className="w-8 h-8 text-gray-700 cursor-pointer hover:text-white transition duration-300" />
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Livres disponibles pour prêt
      </h1>

      {/* Affichage de l'état de chargement ou d'erreur */}
      {isLoading && <p className="text-center text-blue-500">Chargement des livres...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {books.length > 0 ? (
          books.map((book) => (
            <div
              key={book.book_id}
              className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center transition-transform hover:scale-105"
            >
              <img
                src={book.thumbnail}
                alt={book.title}
                className="w-32 h-48 object-cover rounded-md mb-4"
              />
              <h2 className="text-lg font-semibold text-gray-800 mb-2 text-center">
                {book.title}
              </h2>
              <p className="text-sm text-gray-600 text-center mb-2">
                Auteur(s): {book.authors.join(", ")}
              </p>
              <p className="text-sm text-gray-600 text-center">
                Mis à disposition par:{" "}
                <span className="font-bold text-blue-600">{book.user?.username || "Utilisateur inconnu"}</span>
              </p>
              <button
                type="button"
                onClick={() => requestLoan(book.book_id)}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition"
              >
                Faire une demande de prêt
              </button>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            Aucun livre disponible pour le moment.
          </p>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-indigo-950 via-orange-900 border-t-yellow-900 text-white py-8 mt-auto">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} ReadMeMore. Tous droits réservés.</p>
          <ul className="flex space-x-6">
            <li>
              <a href="/legal" className="hover:underline">
                Mentions légales
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:underline">
                Politique de confidentialité
              </a>
            </li>
          </ul>
          <div className="flex space-x-6">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <FaGithub className="w-6 h-6 text-white" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="w-6 h-6 text-white" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="w-6 h-6 text-white" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AvailableBooksPage;