"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";


import Link from "next/link";
import { FaArrowAltCircleRight, FaQrcode } from "react-icons/fa";
import {
  UserIcon,
  BookOpenIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftIcon 
 
} from "@heroicons/react/24/solid";
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { FaBars, FaTimes } from "react-icons/fa";


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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://readmemore.onrender.com";

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

  const requestLoan = async (bookId: number, username: string)=> {
    if (!csrfToken || !token) {
      setError("Le token CSRF et le token d'authentification sont requis.");
      return;
    }
  
    try {
      await axios.post(
        `${API_BASE_URL}/api/loans/request`,
        { bookId, username }, 
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "X-CSRF-Token": csrfToken,
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
    <div className="min-h-screen  p-4 flex flex-col pb-16">
     
      {/* Hamburger Menu */}
    <div className="absolute top-4 left-4 md:hidden z-50">
      <button type="button"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="text-gray-700 p-2 rounded-full bg-white shadow-lg"
      >
        {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>
      {isMenuOpen && (
        <div className="absolute top-10 left-0 bg-white shadow-lg rounded-lg w-48 p-4">
          <ul className="space-y-4 text-gray-700">
            <li>
              <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                Profile
              </Link>
            </li>
            <li>
              <Link href="/search" onClick={() => setIsMenuOpen(false)}>
                Search
              </Link>
            </li>
            <li>
              <Link href="/my-library" onClick={() => setIsMenuOpen(false)}>
                My Library
              </Link>
            </li>
            <li>
              <Link href="/information" onClick={() => setIsMenuOpen(false)}>
                About
              </Link>
            </li>
            <li>
                <Link href="/loan-requests" onClick={() => setIsMenuOpen(false)}> {/* Lien vers la page des demandes de prêt */}
                  Loan Requests
                </Link>
              </li>
            <li>
              <Link href="/available-books" onClick={() => setIsMenuOpen(false)}>
                Available Books
              </Link>
            </li>
            <li>
              <Link href="/scan" onClick={() => setIsMenuOpen(false)}>
                Scan
              </Link>
            </li>
            <li>
              <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
                contact
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>

      
      {/* Header Icons */}
     
  <div className={`absolute top-0 right-0 p-4 ${isMenuOpen ? 'hidden' : ''} sm:flex`}>
        <Link href="/profile">
          <UserIcon className="w-8 h-8 text-gray-700 cursor-pointer hover:text-white transition duration-300" />
        </Link>
        <Link href="/search">
          <MagnifyingGlassIcon className="w-8 h-8 text-gray-700 cursor-pointer  hover:text-white transition duration-300" />
        </Link>
        <Link href="/my-library">
          <BookOpenIcon className="w-8 h-8 text-gray-700 cursor-pointer hover:text-white transition duration-300" />
        </Link>
        <Link href="/information">
          <InformationCircleIcon className="w-8 h-8 text-gray-700 cursor-pointer hover:text-white transition duration-300" />
        </Link>
        {/* Icône de prêt */}
        <Link href="/loan-requests">
  <div className="flex items-center space-x-2">
    <UserIcon className="w-6 h-6 text-gray-700 " />
    <BookOpenIcon className="w-6 h-6 text-gray-700  hover:text-white transition duration-300" />
    <UserIcon className="w-6 h-6 text-gray-700 " />
  </div>
</Link>

        <Link href="/available-books">
          <FaArrowAltCircleRight className="w-8 h-8 text-gray-700 cursor-pointer hover:text-white transition duration-300" />
        </Link>
        {/* Icône de scan */}
      <Link href="/scan">
        <FaQrcode className="w-8 h-8 text-gray-700 cursor-pointer hover:text-white transition duration-300" />
      </Link>
      <Link href="/contact">
  <ChatBubbleLeftIcon className="w-8 h-8 text-gray-700 cursor-pointer hover:text-white transition duration-300" />
</Link>
      </div>

      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
      Books available for loan
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
              Author(s): {book.authors.join(", ")}
              </p>
              <p className="text-sm text-gray-600 text-center">
              Provided by:{" "}
                <span className="font-bold text-blue-600">{book.user?.username || "Utilisateur inconnu"}</span>
              </p>
              <button
                type="button"
                onClick={() => requestLoan(book.book_id, book.user?.username || "Inconnu")}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition"
              >
                Make a loan request
              </button>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            
No books available at the moment
          </p>
        )}
      </div>

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
};

export default AvailableBooksPage;