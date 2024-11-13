"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Book {
  book_id: string;
  title: string;
  authors: string[];
  category_name: string;
  published_date: string;
  description: string;
  isbn: string;
  thumbnail: string;
  status: string; 
}

export default function MyLibrary() {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found, please login.");
          return;
        }
        const response = await axios.get(`${API_BASE_URL}/api/user/library`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setBooks(response.data.books); 
      } catch (error) {
        console.error("Failed to fetch books", error);
        setError("Failed to load books.");
      }
    };

    fetchBooks();
  }, [API_BASE_URL]);

  return (
    <div className="min-h-screen flex flex-col items-center  p-4">
      <h1 className="text-2xl font-bold mb-6">My Library</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="w-full max-w-md">
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book.book_id} className="bg-white p-4 mb-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold">{book.title}</h2>
              <p className="text-sm text-gray-600">Authors: {book.authors.join(", ")}</p>
              <p className="text-sm text-gray-600">Category: {book.category_name}</p>
              <p className="text-sm text-gray-600">Published on: {book.published_date}</p>
              <p className="text-sm text-gray-600">Status: {book.status}</p>
              {book.thumbnail ? (
                <img src={book.thumbnail} alt={book.title} className="w-32 h-48 mt-4" />
              ) : (
                <p className="text-sm text-gray-500 mt-4">No cover available</p>
              )}
              <p className="mt-4 text-sm text-gray-800">{book.description}</p>
            </div>
          ))
        ) : (
          <p>No books found in your library.</p>
        )}
      </div>
    </div>
  );
}