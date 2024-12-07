"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaArrowAltCircleRight, FaQrcode } from "react-icons/fa";
import { UserIcon, BookOpenIcon, MagnifyingGlassIcon, InformationCircleIcon } from "@heroicons/react/24/solid";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import Link from "next/link";

export default function ScanPage() {
  const [token, setToken] = useState<string | null>(null);
  const [isbn, setIsbn] = useState<string>("");
  const [book, setBook] = useState<{
    book_id: number;
    title: string;
    thumbnail: string;
    authors: string[];
    category_name: string;
    published_date: string;
    source?: string;
  } | null>(null);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

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
      }
    };
    fetchCsrfToken();
  }, [API_BASE_URL]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      console.log("Token récupéré :", storedToken); 
      setToken(storedToken);
    }
  }, []);

  const fetchBook = useCallback(async () => {
    if (!isbn.trim()) return;

    if (!token) {
      console.error("Token manquant, l'utilisateur n'est pas authentifié.");
      return;
    }

    try {
      const dbResponse = await axios.get(`${API_BASE_URL}/api/books/isbn/${isbn.trim()}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "X-CSRF-Token": csrfToken || "",
        },
        withCredentials: true,
      });

      if (dbResponse.status === 200 && dbResponse.data) {
        setBook({ ...dbResponse.data, source: "database" });
        return;
      }
    } catch (error) {
      console.info("Livre non trouvé dans la base de données, tentative via Google Books...");
    }

    try {
      const googleResponse = await axios.get(`${API_BASE_URL}/api/google-books/isbn/${isbn.trim()}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "X-CSRF-Token": csrfToken || "",
        },
        withCredentials: true,
      });

      if (googleResponse.status === 200 && googleResponse.data) {
        setBook({ ...googleResponse.data, source: "google-books" });
      } else {
        throw new Error("Livre non trouvé.");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du livre :", error);
      setBook(null);
    }
  }, [isbn, csrfToken, token, API_BASE_URL]);

  const makeBookAvailable = async (bookId: number) => {
    if (!token) {
      console.error("Token manquant, l'utilisateur n'est pas authentifié.");
      return;
    }
    try {
      await axios.patch(
        `${API_BASE_URL}/api/${bookId}/make-available`,
        {},
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "X-CSRF-Token": csrfToken || "",
          },
          withCredentials: true,
        }
      );
      alert("Le livre est maintenant disponible pour prêt.");
    } catch (error) {
      console.error("Erreur lors de la mise à disposition du livre :", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      
      {/* Header Icons */}
      <div className="absolute top-0 right-0 p-4 flex space-x-4">
        <Link href="/profile">
          <UserIcon className="w-8 h-8 text-gray-700 cursor-pointer hover:text-white transition duration-300" />
        </Link>
        <Link href="/search">
          <MagnifyingGlassIcon className="w-8 h-8 text-gray-700 cursor-pointer hover:text-white transition duration-300" />
        </Link>
        <Link href="/my-library">
          <BookOpenIcon className="w-8 h-8 text-gray-700 cursor-pointer hover:text-white transition duration-300" />
        </Link>
        <Link href="/about">
          <InformationCircleIcon className="w-8 h-8 text-gray-700 cursor-pointer hover:text-white transition duration-300" />
        </Link>
        <Link href="/available-books">
          <FaArrowAltCircleRight className="w-8 h-8 text-gray-700 cursor-pointer hover:text-white transition duration-300" />
        </Link>
        <Link href="/scan">
          <FaQrcode className="w-8 h-8 text-gray-700 cursor-pointer hover:text-white transition duration-300" />
        </Link>
      </div>

      <h1 className="text-2xl text-black font-bold mb-4">Rechercher un livre par ISBN</h1>
      <input
        type="text"
        value={isbn}
        onChange={(e) => setIsbn(e.target.value)}
        placeholder="Saisir un ISBN"
        className="w-full max-w-md px-4 py-2 border text-black border-gray-300 rounded shadow-sm focus:ring focus:ring-blue-300"
      />
      <button
        type="button"
        onClick={fetchBook}
        className="mt-4 px-6 py-2 bg-indigo-950 text-white font-bold rounded-xl hover:bg-indigo-900"
      >
        Rechercher
      </button>
      {book ? (
        <div className="mt-8 text-center">
          <h2 className="text-xl text-black font-bold">{book.title}</h2>
          <img src={book.thumbnail} alt={book.title} className="w-32 h-48 mx-auto text-black" />
          <p className="text-xl text-black font-bold">Auteurs : {book.authors.join(", ")}</p>
          <p className="text-xl text-black font-bold">Catégorie : {book.category_name}</p>
          <p className="text-xl text-black font-bold">Date de publication : {book.published_date}</p>
          <p className="text-sm text-gray-500">Source : {book.source === "database" ? "Base de données" : "API Google Books"}</p>
          <button
            type="button"
            onClick={() => makeBookAvailable(book.book_id)}
            className="mt-4 px-6 py-2 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700"
          >
            Rendre disponible pour prêt
          </button>
        </div>
      ) : (
        <p className="mt-8 text-red-500">Aucun livre trouvé pour cet ISBN.</p>
      )}
{/* Footer */}
<footer className="bg-gradient-to-r from-indigo-950 via-orange-900 border-t-yellow-900 text-white py-4 mt-12 w-full fixed bottom-0 left-0">
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
}