"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UserIcon,
  MagnifyingGlassIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";

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
  const [myLibrary, setMyLibrary] = useState<Book[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
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

  useEffect(() => {
    const fetchLibrary = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${API_BASE_URL}/api/library`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setMyLibrary(data.books || []);
        } else {
          console.error(data.error || "Erreur lors de la récupération de la bibliothèque.");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de la bibliothèque :", error);
      }
    };

    if (isAuthenticated) {
      fetchLibrary();
    }
  }, [isAuthenticated, API_BASE_URL]);

  const statuses = ["wishlist", "lu", "à lire", "liked"];

  const getBooksByStatus = (status: string) => {
    return myLibrary.filter((book) => book.status === status);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="relative min-h-screen p-4 flex flex-col items-center bg-gray-100">
      <div className="absolute top-0 right-0 p-4 flex space-x-4">
        <Link href="/profile">
          <UserIcon className="w-8 h-8 text-gray-700 cursor-pointer" />
        </Link>
        <Link href="/search">
          <MagnifyingGlassIcon className="w-8 h-8 text-gray-700 cursor-pointer" />
        </Link>
        <Link href="/about">
          <InformationCircleIcon className="w-8 h-8 text-gray-700 cursor-pointer" />
        </Link>
      </div>

      <h1 className="text-black text-2xl sm:text-4xl font-bold mb-6">Ma Bibliothèque</h1>

      {statuses.map((status) => {
        const booksByStatus = getBooksByStatus(status);

        return (
          <div key={status} className="mb-8 w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </h2>
            {booksByStatus.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {booksByStatus.map((book) => (
                  <div
                    key={book.book_id}
                    className="flex flex-col items-center border p-6 rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow transform hover:scale-105"
                  >
                    {book.thumbnail ? (
                      <img
                        src={book.thumbnail}
                        alt={`Couverture de ${book.title}`}
                        className="w-40 h-60 object-cover rounded-lg shadow-md mb-4"
                      />
                    ) : (
                      <div className="w-40 h-60 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                        <span className="text-gray-500">Aucune image disponible</span>
                      </div>
                    )}
                    <h3 className="text-lg font-semibold text-center">{book.title}</h3>
                    <p className="text-sm text-gray-600 text-center">
                      Auteur(s) : {book.authors ? book.authors.join(", ") : "Aucun auteur disponible"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">Aucun livre dans cette catégorie.</p>
            )}
          </div>
        );
      })}
    </main>
  );
}