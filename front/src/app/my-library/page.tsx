"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  UserIcon,
  MagnifyingGlassIcon,
  InformationCircleIcon,
  StarIcon,
  BookOpenIcon,
  CheckCircleIcon,
  HeartIcon,
  TrashIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/solid";
import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaQrcode,
  FaArrowAltCircleRight,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import axios from "axios";

interface Book {
  book_id: string;
  title: string;
  authors: string[];
  thumbnail?: string;
  description?: string;
  published_date?: string;
  status: string;
}

export default function MyLibrary() {
  const [book, setBook] = useState<Book | null>(null);
  const [myLibrary, setMyLibrary] = useState<Book[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const { book_id } = useParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://readmemore.onrender.com";

  const statuses = [
    { key: "wishlist", label: "Wishlist", icon: StarIcon, color: "text-yellow-500" },
    { key: "read", label: "Read", icon: CheckCircleIcon, color: "text-green-500" },
    { key: "to read", label: "To read", icon: BookOpenIcon, color: "text-blue-500" },
    { key: "liked", label: "Favorite", icon: HeartIcon, color: "text-red-500" },
  ];

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/csrf-token`, {
          withCredentials: true,
        });
        setCsrfToken(response.data.csrfToken);
      } catch (err) {
        console.error("Failed to fetch CSRF token");
      }
    };
    fetchCsrfToken();
  }, [API_BASE_URL]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/auth/login";
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchLibrary = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${API_BASE_URL}/api/library`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setMyLibrary(data.books || []);
      } catch (error) {
        console.error("Erreur lors de la récupération de la bibliothèque :", error);
      }
    };
    fetchLibrary();
  }, [isAuthenticated, API_BASE_URL]);

  const getBooksByStatus = (status: string) =>
    myLibrary.filter((book) => book.status === status);

  const handleDeleteBook = async (bookId: string) => {
    const bookToDelete = myLibrary.find((book) => book.book_id === bookId);
    if (!bookToDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/library/remove`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-CSRF-Token": csrfToken || "",
        },
        body: JSON.stringify({ book_id: bookToDelete.book_id }),
        credentials: "include",
      });

      if (response.ok) {
        alert("Livre supprimé !");
        setMyLibrary((prev) => prev.filter((b) => b.book_id !== bookId));
      }
    } catch (error) {
      console.error("Erreur suppression :", error);
    }
  };

  const handleUpdateStatus = async (bookId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !csrfToken) return;

      const response = await fetch(`${API_BASE_URL}/api/library/update-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ book_id: bookId, status: newStatus }),
        credentials: "include",
      });

      if (response.ok) {
        setMyLibrary((prev) =>
          prev.map((book) =>
            book.book_id === bookId ? { ...book, status: newStatus } : book
          )
        );
      }
    } catch (error) {
      console.error("Erreur mise à jour statut :", error);
    }
  };

  return (
    <main
      className="relative min-h-screen p-4 flex flex-col items-center bg-cover bg-center pt-16 pb-32"
      style={{ backgroundImage: "url('/b.webp')" }}
    >
      {/* Menu hamburger mobile */}
      <div className="absolute top-4 left-4 md:hidden z-50">
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-700 p-2 rounded-full bg-white shadow-lg"
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
        {isMenuOpen && (
          <div className="absolute top-10 left-0 bg-white shadow-lg rounded-lg w-48 p-4">
            <ul className="space-y-4 text-gray-700">
              <li><Link href="/profile" onClick={() => setIsMenuOpen(false)}>Profile</Link></li>
              <li><Link href="/search" onClick={() => setIsMenuOpen(false)}>Search</Link></li>
              <li><Link href="/information" onClick={() => setIsMenuOpen(false)}>About</Link></li>
              <li><Link href="/loan-requests" onClick={() => setIsMenuOpen(false)}>Loan Requests</Link></li>
              <li><Link href="/available-books" onClick={() => setIsMenuOpen(false)}>Available Books</Link></li>
              <li><Link href="/scan" onClick={() => setIsMenuOpen(false)}>Scan</Link></li>
              <li><Link href="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
            </ul>
          </div>
        )}
      </div>

      {/* Menu icônes desktop only */}
      <div className="hidden md:flex absolute top-0 right-0 p-4">
        <Link href="/profile"><UserIcon className="w-8 h-8 text-gray-700 hover:text-white" /></Link>
        <Link href="/search"><MagnifyingGlassIcon className="w-8 h-8 text-gray-700 hover:text-white" /></Link>
        <Link href="/information"><InformationCircleIcon className="w-8 h-8 text-gray-700 hover:text-white" /></Link>
        <Link href="/loan-requests">
          <div className="flex items-center space-x-2">
            <UserIcon className="w-6 h-6 text-gray-700" />
            <BookOpenIcon className="w-6 h-6 text-gray-700 hover:text-white" />
            <UserIcon className="w-6 h-6 text-gray-700" />
          </div>
        </Link>
        <Link href="/available-books"><FaArrowAltCircleRight className="w-8 h-8 text-gray-700 hover:text-white" /></Link>
        <Link href="/scan"><FaQrcode className="w-8 h-8 text-gray-700 hover:text-white" /></Link>
        <Link href="/contact"><ChatBubbleLeftIcon className="w-8 h-8 text-gray-700 hover:text-white" /></Link>
      </div>

      <h1 className="text-black text-3xl sm:text-5xl font-bold text-center mt-8">My Library</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {statuses.map(({ key, label, icon: Icon, color }) => {
          const books = getBooksByStatus(key);
          return (
            <div key={key}>
              <div className="flex items-center mb-4">
                <Icon className={`w-6 h-6 mr-2 ${color}`} />
                <h2 className="text-xl font-semibold text-indigo-800">{label}</h2>
              </div>
              {books.length > 0 ? (
                <div className="space-y-4">
                  {books.map((book) => (
                    <div key={book.book_id} className="flex flex-col items-center p-3 bg-white rounded-md shadow-md hover:shadow-lg transition-shadow">
                      {book.thumbnail ? (
                        <img src={book.thumbnail} alt={book.title} className="w-32 h-48 object-cover rounded-md mb-3" />
                      ) : (
                        <div className="w-32 h-48 bg-gray-200 rounded-md flex items-center justify-center mb-3">
                          <span className="text-gray-500">Image manquante</span>
                        </div>
                      )}
                      <h3 className="text-center text-sm font-medium">{book.title}</h3>
                      <p className="text-xs text-gray-600 text-center">{book.authors?.join(", ")}</p>
                      <div className="flex items-center mt-2">
                        <Icon className={`w-5 h-5 ${color}`} />
                        <span className="ml-2 text-sm font-semibold text-gray-600">{label}</span>
                      </div>
                      <div className="flex flex-wrap items-center justify-center mt-4 w-full gap-2 text-xs text-center">
                        <button type="button" onClick={() => handleDeleteBook(book.book_id)} className="text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5" /></button>
                        <button type="button" onClick={() => handleUpdateStatus(book.book_id, "wishlist")} className="text-yellow-500 hover:text-yellow-700">Add to wishlist</button>
                        <button type="button" onClick={() => handleUpdateStatus(book.book_id, "read")} className="text-green-500 hover:text-green-700">Mark as read</button>
                        <button type="button" onClick={() => handleUpdateStatus(book.book_id, "to read")} className="text-blue-500 hover:text-blue-700">Add to read list</button>
                        <button type="button" onClick={() => handleUpdateStatus(book.book_id, "liked")} className="text-red-500 hover:text-red-700">Add to favorites</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">No books to display</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-indigo-950 via-orange-900 border-t-yellow-900 text-white py-4 mt-12 w-full fixed bottom-0 left-0">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} ReadMeMore. Tous droits réservés.</p>
          <ul className="flex space-x-6">
            <li><a href="/legal" className="hover:underline">Mentions légales</a></li>
            <li><a href="/privacy" className="hover:underline">Politique de confidentialité</a></li>
          </ul>
          <div className="flex space-x-6">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"><FaGithub className="w-6 h-6 text-white" /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter className="w-6 h-6 text-white" /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin className="w-6 h-6 text-white" /></a>
          </div>
        </div>
      </footer>
    </main>
  );
}
