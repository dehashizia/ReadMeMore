"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import {
  UserIcon,
  StarIcon,
  BookOpenIcon,
  CheckCircleIcon,
  HeartIcon,
  TrashIcon,
  ChatBubbleLeftIcon,
  MagnifyingGlassIcon,
  InformationCircleIcon
} from "@heroicons/react/24/solid";
import { FaArrowAltCircleRight, FaQrcode, FaGithub, FaTwitter, FaLinkedin, FaBars, FaTimes } from "react-icons/fa";

interface Book {
  book_id: string;
  title: string;
  authors: string[];
  category?: { category_name: string };
  published_date?: string;
  page_count?: number;
  isbn?: string;
  thumbnail?: string;
  description?: string;
}

interface Comment {
  comment_id: number;
  user_id: number;
  book_id: number;
  user: { username: string };
  book: { title: string };
  text: string;
  date: string;
  rating: number | null;
}

export default function Details() {
  const [book, setBook] = useState<Book | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const { book_id } = useParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://readmemore.onrender.com";

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/csrf-token`, { withCredentials: true });
        setCsrfToken(response.data.csrfToken);
      } catch (err) {
        console.error("Failed to fetch CSRF token");
      }
    };
    fetchCsrfToken();
  }, [API_BASE_URL]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "/auth/login";
    else setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    if (!book_id) return;
    axios.get(`${API_BASE_URL}/api/books/${book_id}`).then(res => setBook(res.data)).catch(console.error);
  }, [book_id, API_BASE_URL]);

  useEffect(() => {
    if (!book_id) return;
    axios.get(`${API_BASE_URL}/api/books/${book_id}/comments`).then(res => setComments(res.data)).catch(console.error);
  }, [book_id, API_BASE_URL]);

  const handleAddToLibrary = async (book: Book, status: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/library/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-CSRF-Token": csrfToken || "",
        },
        body: JSON.stringify({ book_id: book.book_id, status }),
        credentials: "include",
      });
      const data = await response.json();
      setMessage({
        type: response.ok ? "success" : "error",
        text: response.ok ? `Ajouté avec le statut : ${status}` : data.message || "Erreur."
      });
    } catch {
      setMessage({ type: "error", text: "Erreur lors de l'ajout." });
    }
  };

  const handleDeleteComment = async (comment_id: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/comments/${comment_id}`, {
        headers: { Authorization: `Bearer ${token}`, "X-CSRF-Token": csrfToken || "" },
        withCredentials: true,
      });
      setComments(prev => prev.filter(c => c.comment_id !== comment_id));
      setMessage({ type: "success", text: "Commentaire supprimé" });
    } catch {
      setMessage({ type: "error", text: "Erreur lors de la suppression." });
    }
  };

  const handleSubmitComment = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/books/${book?.book_id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-CSRF-Token": csrfToken || "",
        },
        body: JSON.stringify({ text: comment, rating }),
        credentials: "include",
      });
      if (response.ok) {
        const newComment = await response.json();
        setComments(prev => [...prev, newComment]);
        setComment("");
        setRating(0);
        setMessage({ type: "success", text: "Commentaire ajouté." });
      } else {
        setMessage({ type: "error", text: "Erreur lors de l'envoi." });
      }
    } catch {
      setMessage({ type: "error", text: "Erreur lors de l'ajout." });
    }
  };

  if (!isAuthenticated || !book) return <div>Chargement...</div>;

  return (
    <main className="relative min-h-screen p-4 flex flex-col items-center bg-cover bg-center pt-16 pb-32">
      {message && <div className={`text-center text-${message.type === "success" ? "green" : "red"}-500`}>{message.text}</div>}

      {/* Hamburger Menu */}
      <div className="absolute top-4 left-4 md:hidden z-50">
        <button type="button" onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 p-2 rounded-full bg-white shadow-lg">
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
        {isMenuOpen && (
          <div className="absolute top-10 left-0 bg-white shadow-lg rounded-lg w-48 p-4">
            <ul className="space-y-4 text-gray-700">
              <li><Link href="/profile" onClick={() => setIsMenuOpen(false)}>Profile</Link></li>
              <li><Link href="/search" onClick={() => setIsMenuOpen(false)}>Search</Link></li>
              <li><Link href="/my-library" onClick={() => setIsMenuOpen(false)}>My Library</Link></li>
              <li><Link href="/information" onClick={() => setIsMenuOpen(false)}>About</Link></li>
              <li><Link href="/loan-requests" onClick={() => setIsMenuOpen(false)}>Loan Requests</Link></li>
              <li><Link href="/available-books" onClick={() => setIsMenuOpen(false)}>Available Books</Link></li>
              <li><Link href="/scan" onClick={() => setIsMenuOpen(false)}>Scan</Link></li>
              <li><Link href="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
            </ul>
          </div>
        )}
      </div>

      {/* Header icons desktop only */}
      <div className="hidden md:flex absolute top-0 right-0 p-4"> {/* masque en mobile */}
        <Link href="/profile"><UserIcon className="w-8 h-8 text-gray-700 hover:text-white" /></Link>
        <Link href="/search"><MagnifyingGlassIcon className="w-8 h-8 text-gray-700 hover:text-white" /></Link>
        <Link href="/my-library"><BookOpenIcon className="w-8 h-8 text-gray-700 hover:text-white" /></Link>
        <Link href="/information"><InformationCircleIcon className="w-8 h-8 text-gray-700 hover:text-white" /></Link>
        <Link href="/loan-requests"><BookOpenIcon className="w-6 h-6 text-gray-700 hover:text-white" /></Link>
        <Link href="/available-books"><FaArrowAltCircleRight className="w-8 h-8 text-gray-700 hover:text-white" /></Link>
        <Link href="/scan"><FaQrcode className="w-8 h-8 text-gray-700 hover:text-white" /></Link>
        <Link href="/contact"><ChatBubbleLeftIcon className="w-8 h-8 text-gray-700 hover:text-white" /></Link>
      </div>

      {/* Content */}
      {/* ... tu peux garder ton contenu actuel ici sans changement ... */}

      {/* Footer fix */}
      <footer className="bg-gradient-to-r from-indigo-950 via-orange-900 border-t-yellow-900 text-white py-4 mt-12 w-full fixed bottom-0 left-0 z-50">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-center px-4">
          <p className="text-sm">&copy; {new Date().getFullYear()} ReadMeMore. Tous droits réservés.</p>
          <ul className="flex space-x-4 mt-2 md:mt-0">
            <li><a href="/legal" className="hover:underline">Mentions légales</a></li>
            <li><a href="/privacy" className="hover:underline">Politique de confidentialité</a></li>
          </ul>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"><FaGithub className="w-6 h-6 text-white" /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter className="w-6 h-6 text-white" /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin className="w-6 h-6 text-white" /></a>
          </div>
        </div>
      </footer>
    </main>
  );
}
