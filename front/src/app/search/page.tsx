"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserIcon, BookOpenIcon, InformationCircleIcon } from "@heroicons/react/24/solid";

interface Book {
  book_id: string;
  title: string;
  authors: string[];
  category_id?: string; // Nouvelle catégorie
 
  published_date?: string; // Date de publication
  page_count?: number; // Nombre de pages
  isbn?: string;
  thumbnail?: string;
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [results, setResults] = useState<Book[]>([]);
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

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
      const data: Book[] = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Erreur lors de la recherche de livres:", error);
    }
  };

  const handleCategoryFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryFilter(e.target.value);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="relative min-h-screen p-4 flex flex-col items-center">
      {/* Icônes en haut à droite */}
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

      <div className="flex flex-col items-center justify-center text-center w-full max-w-4xl">
        <h1 className="text-black text-2xl sm:text-4xl font-bold mb-4">Rechercher un livre</h1>

        <form onSubmit={handleSearch} className="flex w-full max-w-sm mb-4">
          <input
            type="text"
            placeholder="Rechercher un livre"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border rounded p-2 w-full mr-2 text-black"
          />
          <button
            type="submit"
            className="bg-[#964e25] text-white p-2 rounded-full hover:bg-[#884924] transition duration-300"
          >
            Search
          </button>
        </form>

        <section className="categories w-full max-w-lg mt-8 flex flex-col items-center">
          <div className="flex items-center mb-4">
            <h2 className="text-2xl font-bold text-black mr-4">Catégories</h2>
            <input
              type="text"
              placeholder="Filtrer les catégories"
              value={categoryFilter}
              onChange={handleCategoryFilter}
              className="border rounded p-2 text-black"
            />
          </div>
        </section>

        {/* Résultats de recherche */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-40 w-full mt-8">
          {results.length > 0 ? (
            results.map((book) => (
              <div
                key={book.book_id}
                className="flex border p-4 rounded shadow-md bg-white hover:shadow-lg transition-shadow"
              >
                {book.thumbnail && (
                  <img
                    src={book.thumbnail}
                    alt={book.title}
                    className="w-36 h-48 object-cover rounded mr-4"
                  />
                )}
                <div className="flex flex-col justify-between">
                  <h3 className="text-xl font-semibold text-gray-800">{book.title}</h3>
                  <p className="text-sm text-gray-600">Auteur(s): {book.authors.join(", ")}</p>
                  {book.category_id && (
                    <p className="text-sm text-gray-600">Catégorie: {book.category_id}</p>
                  )}
                  {book.published_date && (
                    <p className="text-sm text-gray-600">Publié le: {book.published_date}</p>
                  )}
                  {book.page_count && (
                    <p className="text-sm text-gray-600">Nombre de pages: {book.page_count}</p>
                  )}
                  {book.isbn && <p className="text-sm text-gray-600">ISBN: {book.isbn}</p>}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-700">Aucun résultat trouvé</p>
          )}
        </div>
      </div>
    </main>
  );
}