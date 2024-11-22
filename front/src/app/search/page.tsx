"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import {
  UserIcon,
  BookOpenIcon,
  InformationCircleIcon,
  HeartIcon,
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
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [results, setResults] = useState<Book[]>([]);
  const [filteredResults, setFilteredResults] = useState<Book[]>([]);
  const [myLibrary, setMyLibrary] = useState<Book[]>([]);
  const [csrfToken, setCsrfToken] = useState<string | null>(null); 
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
  
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/csrf-token`, {
          withCredentials: true,
        });
        setCsrfToken(response.data.csrfToken);
      } catch (err) {
        console.error('Failed to fetch CSRF token');
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
    <main className="relative min-h-screen p-4 flex flex-col items-center">
      <div className="absolute top-0 right-0 p-4 flex space-x-4">
        <Link href="/profile">
          <UserIcon className="w-8 h-8 text-gray-700 cursor-pointer" />
        </Link>
        <Link href="/my-library">
          <BookOpenIcon className="w-8 h-8 text-gray-700 cursor-pointer" />
        </Link>
        <Link href="/about">
          <InformationCircleIcon className="w-8 h-8 text-gray-700 cursor-pointer" />
        </Link>
      </div>

      <div className="flex items-center mt-4 mb-8">
        <h2 className="text-black text-3xl sm:text-5xl font-bold shadow-lg shadow-orange-500/50">
          Read
        </h2>
        <img
          src="/logo.jpg"
          alt="Logo"
          className="mx-2 w-12 h-12 sm:w-16 sm:h-16"
        />
        <h2 className="text-black text-3xl sm:text-5xl font-bold shadow-lg shadow-orange-500/50">
          eMore
        </h2>
      </div>

      <div className="flex flex-col items-center justify-center text-center w-full max-w-4xl">
        

        <form onSubmit={handleSearch} className="flex w-full max-w-md mb-6">
          <input
            type="text"
            placeholder="Rechercher un livre"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border rounded p-3 w-full mr-2 text-black"
          />
          <button
            type="submit"
            className="bg-indigo-950 text-white p-3 rounded-full hover:bg-blue-900 transition duration-300"
          >
            Search
          </button>
        </form>

        <section className="categories w-full max-w-lg mt-8 flex flex-col items-center">
          <form className="flex items-center">
            <input
              type="text"
              placeholder="Filtrer les catégories"
              value={categoryFilter}
              onChange={handleCategoryFilter}
              className="border rounded p-3 text-black mr-2"
            />
            <button
              type="button"
              onClick={applyCategoryFilter}
              className="bg-indigo-950 text-white p-3 rounded-full hover:bg-blue-900 transition duration-300"
            >
              Filtrer
            </button>
          </form>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full mt-8">
          {filteredResults.map((book) => (
            <div
              key={book.book_id}
              className="flex flex-col items-center border p-6 rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow transform hover:scale-105"
            >
              {book.thumbnail && (
                <img
                  src={book.thumbnail}
                  alt={`Couverture de ${book.title}`}
                  className="w-32 h-48 object-cover rounded-lg shadow-lg mb-4"
                />
              )}
              <div className="text-center">
                <h2 className="text-black font-semibold text-xl mb-2">{book.title}</h2>
                <p className="text-black text-sm mb-2">{book.authors.join(", ")}</p>
                <p className="text-black text-sm mb-2">
                  {book.category?.category_name || "Non catégorisé"}
                </p>
                <p className="text-black text-sm">{book.published_date}</p>
              </div>
              <Link href={`/details/${book.book_id}`}>
                <button type="button" className="bg-blue-900 text-white px-4 py-2 rounded">
                  Voir les détails
                </button>
              </Link>
              <HeartIcon
                onClick={() => handleAddToLibrary(book)}
                className="w-6 h-6 text-red-500 cursor-pointer mt-2 hover:scale-110 transition-transform"
              />
            </div>
          ))}
        </div>
      </div>
      <img
  src="/d.png"
  alt="Logo livre"
  className="absolute left-0 bottom-0 m-4 w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-48 lg:h-48 rounded-[50%] border-4 border-gray-300 shadow-lg object-cover"
/>
    </main>
  );
}