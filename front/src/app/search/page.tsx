"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserIcon, BookOpenIcon, InformationCircleIcon } from "@heroicons/react/24/solid";

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
      const data = await response.json();

      if (Array.isArray(data)) {
        setResults(data);
        setFilteredResults(data); 
      } else {
        console.error("Données inattendues :", data);
        setResults([]);
        setFilteredResults([]); 
      }
    } catch (error) {
      console.error("Erreur lors de la recherche de livres :", error);
      setResults([]);
      setFilteredResults([]); 
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

      <div className="flex flex-col items-center justify-center text-center w-full max-w-4xl">
        <h1 className="text-black text-2xl sm:text-4xl font-bold mb-4">Rechercher un livre</h1>

        <form onSubmit={handleSearch} className="flex w-full max-w-sm mb-4">
          <input
            type="text"
            placeholder="Rechercher un livre"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border rounded p-3 w-full mr-2 text-black"
          />
          <button
            type="submit"
            className="bg-[#964e25] text-white p-3 rounded-full hover:bg-[#884924] transition duration-300"
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
              className="bg-[#964e25] text-white p-3 rounded-full hover:bg-[#884924] transition duration-300"
            >
              Filtrer
            </button>
          </form>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full mt-8">
          {filteredResults.length > 0 ? (
            filteredResults.map((book) => (
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
                  <p className="text-black text-sm mb-2">Auteur(s) : {book.authors.join(", ")}</p>
                  <p className="text-black text-sm mb-2">
                    Catégorie : {book.category?.category_name || "Non catégorisé"}
                  </p>
                  <p className="text-black text-sm">Publié le : {book.published_date}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-black">Aucun résultat trouvé.</p>
          )}
        </div>
      </div>
    </main>
  );
}