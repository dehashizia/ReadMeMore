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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="relative min-h-screen p-4 flex flex-col items-center">
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

      <h1 className="text-black text-2xl sm:text-4xl font-bold mb-4">Ma Bibliothèque</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full mt-8">
        {myLibrary.length > 0 ? (
          myLibrary.map((book) => (
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
                <p className="text-black text-sm">{book.published_date}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-black text-center">Votre bibliothèque est vide.</p>
        )}
      </div>
    </main>
  );
}