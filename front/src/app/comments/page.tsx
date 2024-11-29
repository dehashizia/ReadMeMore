"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { StarIcon, UserIcon } from "@heroicons/react/24/solid";

interface Comment {
  comment_id: number;
  book: { title: string }; // Relation avec le livre
  user: { username: string }; // Relation avec l'utilisateur
  text: string;
  date: string; // Date du commentaire
}
export default function Comments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    // Vérifier si l'utilisateur est authentifié
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/auth/login";
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/csrf-token`, {
          withCredentials: true,
        });
        setCsrfToken(response.data.csrfToken);
      } catch (error) {
        console.error("Erreur lors de la récupération du token CSRF :", error);
      }
    };

    const fetchAllComments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/comments`);
        setComments(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des commentaires :", error);
      }
    };

    fetchCsrfToken();
    fetchAllComments();
  }, [API_BASE_URL]);

  if (!isAuthenticated) {
    return <div>Chargement...</div>;
  }

  return (
    <main className="min-h-screen flex flex-col items-center p-6">
      <div className="w-full max-w-4xl bg-white shadow-xl p-8 rounded-lg">
        <h1 className="text-2xl font-semibold mb-4">Tous les commentaires</h1>
        <div className="flex space-x-4 mb-6">
          <Link href="/profile">
            <UserIcon className="w-8 h-8 text-gray-700 cursor-pointer" />
          </Link>
          <Link href="/search">
            <button type="button" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
              Retour à la recherche
            </button>
          </Link>
        </div>
        {comments.length > 0 ? (
          <ul className="space-y-6">
            {comments.map((comment) => (
              <li key={comment.comment_id} className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                <div className="flex items-center space-x-2 mb-2">
                  <UserIcon className="w-6 h-6 text-gray-500" />
                  <span className="text-sm text-gray-600">{comment.user.username}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700 mb-2">{comment.book.title}</p>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className={`w-5 h-5 ${star <= comment.rating ? "text-yellow-500" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <Link href={`/books/${comment.book_id}`}>
                  <button type="button" className="mt-2 text-blue-500 hover:underline">Voir le livre</button>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Aucun commentaire pour le moment.</p>
        )}
      </div>
    </main>
  );
}