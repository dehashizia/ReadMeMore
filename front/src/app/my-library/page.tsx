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
  ArrowPathIcon,
} from "@heroicons/react/24/solid";
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
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  const statuses = [
    { key: "wishlist", label: "Wishlist", icon: StarIcon, color: "text-yellow-500" },
    { key: "lu", label: "Lu", icon: CheckCircleIcon, color: "text-green-500" },
    { key: "à lire", label: "À lire", icon: BookOpenIcon, color: "text-blue-500" },
    { key: "liked", label: "Favoris", icon: HeartIcon, color: "text-red-500" },
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

    if (!bookToDelete) {
      console.error("Aucun livre sélectionné pour la suppression");
      return;
    }

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

      const data = await response.json();

      if (response.ok) {
        alert("Livre supprimé de votre bibliothèque !");
        setMyLibrary((prevLibrary) => prevLibrary.filter((b) => b.book_id !== bookToDelete.book_id));
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du livre :", error);
    }
  };

  const handleUpdateStatus = async (bookId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Utilisateur non authentifié");
        return;
      }

      if (!csrfToken) {
        console.error("Token CSRF manquant");
        return;
      }

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

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error("Erreur lors de la mise à jour du statut:", errorMessage);
        return;
      }

      const data = await response.json();

      if (response.ok) {
        setMyLibrary((prevLibrary) =>
          prevLibrary.map((book) =>
            book.book_id === bookId ? { ...book, status: newStatus } : book
          )
        );
        alert("Statut mis à jour avec succès !");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut :", error);
    }
  };

  return (
    <main className="min-h-screen p-6">
      {/* Header */}
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

      {/* Title Section */}
      <div className="flex flex-col items-center justify-center space-y-4 mt-8 sm:mt-12">
        <img
          src="/mylibrary.jpg"
          alt="Icône bibliothèque"
          className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-[50%] border-4 border-gray-300 shadow-lg object-cover"
        />
        <h1 className="text-black text-3xl sm:text-5xl font-bold text-center">
          My Library
        </h1>
      </div>

      {/* Library Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {statuses.map(({ key, label, icon: Icon, color }) => {
          const booksByStatus = getBooksByStatus(key);

          return (
            <div key={key}>
              <div className="flex items-center mb-4">
                <Icon className={`w-6 h-6 mr-2 ${color}`} />
                <h2 className="text-xl font-semibold text-indigo-800">{label}</h2>
              </div>

              {booksByStatus.length > 0 ? (
                <div className="space-y-4">
                  {booksByStatus.map((book) => {
                    const bookStatus = statuses.find((status) => status.key === book.status);

                    return (
                      <div
                        key={book.book_id}
                        className="relative flex flex-col items-center p-3 bg-white rounded-md shadow-md hover:shadow-lg transition-shadow"
                      >
                        {book.thumbnail ? (
                          <img
                            src={book.thumbnail}
                            alt={`Couverture de ${book.title}`}
                            className="w-32 h-48 object-cover rounded-md mb-3"
                          />
                        ) : (
                          <div className="w-32 h-48 bg-gray-200 rounded-md flex items-center justify-center mb-3">
                            <span className="text-gray-500">Image manquante</span>
                          </div>
                        )}
                        <h3 className="text-center text-sm font-medium">{book.title}</h3>
                        <p className="text-xs text-gray-600 text-center">
                          {book.authors?.join(", ") || "Non spécifié"}
                        </p>
                        {bookStatus && (
                          <div className="flex items-center mt-2">
                            <bookStatus.icon className={`w-5 h-5 ${bookStatus.color}`} />
                            <span className="ml-2 text-sm font-semibold text-gray-600">{bookStatus.label}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-4 w-full space-x-2">
                          <button type="button"
                            onClick={() => handleDeleteBook(book.book_id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                          <button type="button"
                            onClick={() => handleUpdateStatus(book.book_id, "wishlist")}
                            className="text-yellow-500 hover:text-yellow-700"
                          >
                            Ajouter à la wishlist
                          </button>
                          <button type="button"
                            onClick={() => handleUpdateStatus(book.book_id, "lu")}
                            className="text-green-500 hover:text-green-700"
                          >
                            Marquer comme lu
                          </button>
                          <button type="button"
                            onClick={() => handleUpdateStatus(book.book_id, "liked")}
                            className="text-red-500 hover:text-red-700"
                          >
                            Ajouter aux favoris
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-gray-500">Aucun livre à afficher</p>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}