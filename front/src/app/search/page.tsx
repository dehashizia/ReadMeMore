"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { FaArrowAltCircleRight, FaQrcode, FaGithub, FaTwitter, FaLinkedin, FaBars, FaTimes } from "react-icons/fa";
import {
  UserIcon,
  BookOpenIcon,
  InformationCircleIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/solid";

interface Book {
  book_id: string;
  title: string;
  authors: string[];
  category?: { category_name: string };
  published_date?: string;
  page_count?: number;
  isbn?: string;
  thumbnail?: string;
  source?: string;
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [results, setResults] = useState<Book[]>([]);
  const [filteredResults, setFilteredResults] = useState<Book[]>([]);
  const [myLibrary, setMyLibrary] = useState<Book[]>([]);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://readmemore.onrender.com";

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
      router.push("/auth/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/search-books?query=${query}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setResults(data);
        setFilteredResults(data);
      } else {
        setResults([]);
        setFilteredResults([]);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche de livres :", error);
    }
  };

  const handleAddToLibrary = async (book: Book) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/library/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-CSRF-Token": csrfToken || "",
        },
        body: JSON.stringify({ book_id: book.book_id }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        alert("Livre ajouté à votre bibliothèque !");
        setMyLibrary((prevLibrary) => [...prevLibrary, book]);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du livre :", error);
    }
  };

  const handleCategoryFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryFilter(e.target.value);
  };

  const applyCategoryFilter = () => {
    const newFilteredResults = results.filter((book) =>
      categoryFilter
        ? book.category?.category_name
            .toLowerCase()
            .includes(categoryFilter.toLowerCase())
        : true
    );
    setFilteredResults(newFilteredResults);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main
      className="relative min-h-screen p-4 flex flex-col items-center bg-cover bg-center pt-32 pb-16"
      style={{ backgroundImage: "url('/LL.webp')" }}
    >
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

      {/* Header Desktop Only */}
      <div className="hidden md:flex absolute top-0 right-0 p-4">
        <Link href="/profile"><UserIcon className="w-8 h-8 text-gray-700 hover:text-white" /></Link>
        <Link href="/my-library"><BookOpenIcon className="w-8 h-8 text-gray-700 hover:text-white" /></Link>
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

      <div className="flex items-center mt-4 mb-8">
        <h2 className="text-black text-4xl sm:text-6xl font-extrabold shadow-lg shadow-orange-500/50">Read</h2>
        <img
          src="/logo M.webp"
          alt="Logo"
          className="mx-2 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-contain rounded-full shadow-xl shadow-orange-500/50"
        />
        <h2 className="text-black text-4xl sm:text-6xl font-extrabold shadow-lg shadow-orange-500/50">eMore</h2>
      </div>

      <form onSubmit={handleSearch} className="flex w-full max-w-md mb-6">
        <input
          type="text"
          placeholder="Search for a book"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border rounded p-3 w-full mr-2 text-black"
        />
        <button
          type="submit"
          className="bg-indigo-950 text-white p-3 rounded-full hover:bg-indigo-800 transition duration-300"
        >
          Search
        </button>
      </form>

      <form className="flex items-center w-full max-w-md mb-6">
        <input
          type="text"
          placeholder="Filter categories"
          value={categoryFilter}
          onChange={handleCategoryFilter}
          className="border rounded p-3 w-full mr-2 text-black"
        />
        <button
          type="button"
          onClick={applyCategoryFilter}
          className="bg-indigo-950 text-white p-3 rounded-full hover:bg-indigo-800 transition duration-300"
        >
          Filter
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-8">
        {filteredResults.map((book) => (
          <div
            key={`book-${book.book_id ?? Math.random()}`}
            className="flex flex-col items-center bg-white bg-opacity-80 backdrop-blur-lg border p-4 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
          >
            {book.thumbnail && (
              <img
                src={book.thumbnail}
                alt={`Couverture de ${book.title}`}
                className="w-32 h-48 object-cover rounded-lg mb-4"
              />
            )}
            <h2 className="text-lg font-bold text-gray-800 mb-2">{book.title}</h2>
            <p className="text-sm text-gray-600 mb-2">{book.authors.join(", ")}</p>
            <p className="text-xs text-gray-500">{book.category?.category_name || "Non catégorisé"}</p>
            <p className="text-black text-sm mb-2">
              Source : {book.source === "database" ? "Base de données" : book.source === "google_books" ? "API Google Books" : "Source inconnue"}
            </p>
            <Link href={`/details/${book.book_id}`}>
              <button
                type="button"
                className="bg-blue-800 text-white px-4 py-2 rounded mt-4"
              >
                View details
              </button>
            </Link>
          </div>
        ))}
      </div>

      <footer className="bg-gradient-to-r from-indigo-950 via-orange-900 border-t-yellow-900 text-white py-4 mt-12 w-full fixed bottom-0 left-0">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} ReadMeMore. Tous droits réservés.</p>
          <ul className="flex space-x-6">
            <li><a href="/legal" className="hover:underline">Mentions légales</a></li>
            <li><a href="/privacy" className="hover:underline">Politique de confidentialité</a></li>
          </ul>
          <div className="flex space-x-6">
            <a href="https://github.com" target="_blank" rel="noreferrer"><FaGithub className="w-6 h-6 text-white" /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter className="w-6 h-6 text-white" /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer"><FaLinkedin className="w-6 h-6 text-white" /></a>
          </div>
        </div>
      </footer>
    </main>
  );
}