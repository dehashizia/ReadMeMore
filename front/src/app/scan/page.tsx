"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
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
import Link from "next/link";

export default function ScanPage() {
  const [token, setToken] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
   
      <div className="relative min-h-screen p-4 flex flex-col items-center bg-cover bg-center pt-16 pb-16">
    
      
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
                Scan
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>

      
      {/* Header Icons */}
     
      <div className="hidden sm:flex absolute top-0 right-0 p-4">
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
      

      <h1 className="text-2xl text-black font-bold mb-4">Search for a book by ISBN</h1>
      <input
        type="text"
        value={isbn}
        onChange={(e) => setIsbn(e.target.value)}
        placeholder="Enter an ISBN"
        className="w-full max-w-md px-4 py-2 border text-black border-gray-300 rounded shadow-sm focus:ring focus:ring-blue-300"
      />
      <button
        type="button"
        onClick={fetchBook}
        className="mt-4 px-6 py-2 bg-indigo-950 text-white font-bold rounded-xl hover:bg-indigo-900"
      >
        Search
      </button>
      {book ? (
        <div className="mt-8 text-center">
          <h2 className="text-xl text-black font-bold">{book.title}</h2>
          <img src={book.thumbnail} alt={book.title} className="w-32 h-48 mx-auto text-black" />
          <p className="text-xl text-black font-bold">Author(s): {book.authors.join(", ")}</p>
          <p className="text-xl text-black font-bold">Category  : {book.category_name}</p>
          <p className="text-xl text-black font-bold">Published : {book.published_date}</p>
          <p className="text-sm text-gray-500">Source : {book.source === "database" ? "Base de données" : "API Google Books"}</p>
          <button
            type="button"
            onClick={() => makeBookAvailable(book.book_id)}
            className="mt-4 px-6 py-2 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-500"
          >
            Available for loan
          </button>
        </div>
      ) : (
        <p className="mt-8 text-indigo-950">No books found for this ISBN</p>
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