"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { UserIcon, StarIcon, BookOpenIcon, CheckCircleIcon, HeartIcon } from "@heroicons/react/24/solid";

interface Book {
  book_id: string;
  title: string;
  authors: string[];
  category?: { category_name: string };
  published_date?: string;
  page_count?: number;
  isbn?: string;
  thumbnail?: string;
  description?: string;
}

interface Comment {
  comment_id: number;
  user_id: number;
  book_id: number;
  user: { username: string };
  book: { title: string };
  text: string;
  date: string;
  rating: number | null;
}

export default function Details() {
  const [book, setBook] = useState<Book | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [comment, setComment] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const { book_id } = useParams();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

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
    if (!book_id) return;
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/books/${book_id}`);
        setBook(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des détails du livre :", error);
      }
    };
    fetchBookDetails();
  }, [book_id, API_BASE_URL]);

  useEffect(() => {
    if (!book_id) return;
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/books/${book_id}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des commentaires :", error);
      }
    };
    fetchComments();
  }, [book_id, API_BASE_URL]);

  const handleAddToLibrary = async (book: Book, status: string) => {
    console.log("Status envoyé au backend :", status);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/library/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-CSRF-Token": csrfToken || "",
        },
        body: JSON.stringify({ book_id: book.book_id, status }),
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        alert(`Livre ajouté à votre bibliothèque avec le statut : ${status}`);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du livre :", error);
    }
  };

  const handleSubmitComment = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/books/${book?.book_id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-CSRF-Token": csrfToken || "",
        },
        body: JSON.stringify({ text: comment, rating }),
        credentials: "include",
      });

      if (response.ok) {
        alert("Commentaire ajouté !");
        setComment("");
        setRating(0);
        const newComment = await response.json();
        setComments((prevComments) => [...prevComments, newComment]);
      } else {
        console.error("Erreur lors de l'ajout du commentaire :", response.statusText);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire :", error);
    }
  };
  
  if (!isAuthenticated || !book) {
    return <div>Chargement...</div>;
  }

  return (
    <main className="relative min-h-screen p-6 flex flex-col items-center justify-between">
      <div className="absolute top-0 right-0 p-4 flex space-x-4">
        <Link href="/profile">
          <UserIcon className="w-8 h-8 text-gray-700 cursor-pointer" />
        </Link>
        <Link href="/my-library">
          <BookOpenIcon className="w-8 h-8 text-gray-700 cursor-pointer" />
        </Link>
      </div>

      <div className="flex flex-col items-center justify-start text-center w-full max-w-4xl bg-white shadow-xl p-8 rounded-lg mt-10">
        <h1 className="text-3xl font-semibold mb-4">{book.title}</h1>
        {book.thumbnail && (
          <img
            src={book.thumbnail}
            alt={`Couverture de ${book.title}`}
            className="w-48 h-72 object-cover rounded-lg shadow-md mb-6"
          />
        )}
        <p className="text-LG text-gray-700 mb-2">Title : {book.title}</p>
        <p className="text-lg text-gray-700 mb-2">Author(s) : {book.authors.join(", ")}</p>
        <p className="text-sm text-gray-600 mb-2">Category : {book.category?.category_name || "Non catégorisé"}</p>
        <p className="text-sm text-gray-600 mb-2">Published : {book.published_date}</p>
        <p className="text-sm text-gray-600 mb-2">Page_count : {book.page_count}</p>
        <p className="text-sm text-gray-600 mb-4">ISBN : {book.isbn}</p>
        <p className="text-sm text-gray-700 mb-6">{book.description}</p>

        <div className="flex space-x-6 mb-4">
          <button
            type="button"
            className="flex items-center space-x-2 text-yellow-500"
            onClick={() => handleAddToLibrary(book, "wishlist")}
          >
            <StarIcon className="w-6 h-6" />
            <span>Wishlist</span>
          </button>
          <button
            type="button"
            className="flex items-center space-x-2 text-green-500"
            onClick={() => handleAddToLibrary(book, "lu")}
          >
            <CheckCircleIcon className="w-6 h-6" />
            <span>Lu</span>
          </button>
          <button
            type="button"
            className="flex items-center space-x-2 text-blue-500"
            onClick={() => handleAddToLibrary(book, "à lire")}
          >
            <BookOpenIcon className="w-6 h-6" />
            <span>À lire</span>
          </button>
          <HeartIcon
            onClick={() => handleAddToLibrary(book, "liked")}
            className="w-6 h-6 text-red-500 cursor-pointer hover:scale-110 transition-transform"
          />
        </div>

        {/* Formulaire d'ajout de commentaire */}
        <div className="w-full max-w-xl bg-gray-100 p-6 rounded-lg shadow-md text-black">
          <h2 className="text-xl font-medium mb-4">Ajouter un commentaire</h2>
          <textarea
            className="w-full h-32 p-4 mb-4 border border-gray-300 rounded-md text-black"
            placeholder="Écrivez un commentaire..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex space-x-4 mb-4">
            <span>Note: </span>
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className={`w-6 h-6 cursor-pointer ${rating >= star ? "text-yellow-400" : "text-gray-400"}`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <button type="button" onClick={handleSubmitComment} className="bg-blue-800 text-black px-6 py-2 rounded-lg">
            Ajouter le commentaire
          </button>
        </div>

        {/* Affichage des commentaires */}
        <div className="mt-10 w-full max-w-xl bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-medium mb-4 text-black">Commentaires</h2>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.comment_id} className="mb-6">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-black">{comment.user.username}</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`w-4 h-4 ${comment.rating && comment.rating >= star ? "text-yellow-400" : "text-gray-400"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-sm text-black">{comment.text}</p>
                <span className="text-xs text-black">{new Date(comment.date).toLocaleDateString()}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-600">Aucun commentaire pour ce livre.</p>
          )}
        </div>
      </div>
    </main>
  );
}