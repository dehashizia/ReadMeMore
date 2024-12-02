"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { StarIcon, UserIcon } from "@heroicons/react/24/solid";

interface Comment {
  comment_id: number;
  book: { 
    book_id: string; 
    title: string;
    thumbnail?: string; // Ajout de la propriété 'thumbnail' pour l'image
  };
  user: { username: string };
  text: string;
  date: string;
  rating: number;
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
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/comments`);
        setComments(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des commentaires :", error);
      }
    };
    fetchComments();
  }, [API_BASE_URL]);

  return (
    <main className="min-h-screen p-6 flex flex-col items-center justify-between">
      <div className="w-full max-w-xl bg-gray-100 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-medium mb-4 text-black">Actus</h2>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.comment_id} className="mb-6 flex items-center space-x-4">
              {/* Affichage de l'image de couverture */}
              {comment.book.thumbnail && (
                <img
                  src={comment.book.thumbnail}
                  alt={`Couverture de ${comment.book.title}`}
                  className="w-16 h-24 object-cover rounded-lg"
                />
              )}
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-black">{comment.user.username} parle de ce livre : </span>
                  <p className="mt-2 text-sm text-black">  {comment.book.title}</p>
                
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

             
            </div>
          ))
        ) : (
          <p className="text-gray-400">Aucun commentaire pour ce livre.</p>
        )}
      </div>
    </main>
  );
}