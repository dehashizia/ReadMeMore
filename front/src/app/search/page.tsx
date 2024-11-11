"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserIcon, BookOpenIcon, InformationCircleIcon } from '@heroicons/react/24/solid'; 

export default function Search() {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

 
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login"); 
    } else {
      setIsAuthenticated(true); 
    }
  }, [router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", query);
  };

  const handleCategoryFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryFilter(e.target.value);
  };

  if (!isAuthenticated) {
    return null; 
  }

  return (
    <main className="relative min-h-screen  p-4 flex flex-col items-center justify-between">
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

      <div className="flex flex-col items-center justify-center flex-grow text-center w-full max-w-lg">
        <h1 className="text-black text-2xl sm:text-4xl font-bold mb-4">
          Rechercher un livre
        </h1>

        <form onSubmit={handleSearch} className="flex w-full max-w-sm mb-4">
          <input
            type="text"
            placeholder="Rechercher un livre"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border rounded p-2 w-full mr-2"
          />
          <button
            type="submit"
            className="bg-[#964e25] text-white p-2 rounded-full hover:bg-[#884924] transition duration-300"
          >
            Search
          </button>
        </form>

        {/* Section catégories avec filtre */}
        <section className="categories w-full max-w-lg mt-8 flex flex-col items-center">
          <div className="flex items-center mb-4">
            <h2 className="text-2xl font-bold text-black mr-4">Catégories</h2>
            <input
              type="text"
              placeholder="Filtrer les catégories"
              value={categoryFilter}
              onChange={handleCategoryFilter}
              className="border rounded p-2"
            />
          </div>
          {/* Liste de catégories filtrées */}
          {/* Ajouter ici la logique pour filtrer les catégories selon `categoryFilter` */}
        </section>
      </div>
    </main>
  );
}