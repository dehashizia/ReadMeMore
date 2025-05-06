"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { UserIcon, StarIcon, BookOpenIcon, CheckCircleIcon, HeartIcon, TrashIcon, ChatBubbleLeftIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { FaArrowAltCircleRight, FaQrcode } from "react-icons/fa";
import {

  InformationCircleIcon,
 
} from "@heroicons/react/24/solid";
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { FaBars, FaTimes } from "react-icons/fa";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://readmemore.onrender.com";

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
        setMessage({ type: "success", text: `Livre ajouté à votre bibliothèque avec le statut : ${status}` });
      } else {
        setMessage({ type: "error", text: data.message || "Une erreur est survenue." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erreur lors de l'ajout du livre." });
    }
  };
  const handleDeleteComment = async (comment_id: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${API_BASE_URL}/api/comments/${comment_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-CSRF-Token": csrfToken || "",
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        setComments((prevComments) => prevComments.filter((comment) => comment.comment_id !== comment_id));
        setMessage({ type: "success", text: "Commentaire supprimé avec succès !" });
      } else {
        setMessage({ type: "error", text: response.statusText || "Une erreur est survenue." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erreur lors de la suppression du commentaire." });
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
        setMessage({ type: "success", text: "Commentaire ajouté avec succès !" });
        setComment("");
        setRating(0);
        const newComment = await response.json();
        setComments((prevComments) => [...prevComments, newComment]);
      } else {
        setMessage({ type: "error", text: response.statusText || "Une erreur est survenue." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erreur lors de l'ajout du commentaire." });
    }
  };
  if (!isAuthenticated || !book) {
    return <div>Chargement...</div>;
  }

  return (
    <main className="relative min-h-screen p-4 flex flex-col items-center bg-cover bg-center pt-16 pb-16">
      {/* Messages */}
      {message && (
        <div className={`message ${message.type === "success" ? "text-green-500" : "text-red-500"}`}>
          {message.text}
        </div>
      )}
     {/* Hamburger Menu */}
    <div className="absolute top-4 left-4 md:hidden z-50">
      <button type="button"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="text-gray-700 p-2 rounded-full bg-white shadow-lg"
      >
        {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>
      {isMenuOpen && (
        <div className="absolute top-10 left-0 bg-white shadow-lg rounded-lg w-48 p-4">
          <ul className="space-y-4 text-gray-700">
            <li>
              <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                Profile
              </Link>
            </li>
            <li>
              <Link href="/search" onClick={() => setIsMenuOpen(false)}>
                search
              </Link>
            </li>
            <li>
              <Link href="/my-library" onClick={() => setIsMenuOpen(false)}>
                My Library
              </Link>
            </li>
            <li>
              <Link href="/information" onClick={() => setIsMenuOpen(false)}>
                About
              </Link>
            </li>
            <li>
                <Link href="/loan-requests" onClick={() => setIsMenuOpen(false)}> {/* Lien vers la page des demandes de prêt */}
                  Loan Requests
                </Link>
              </li>
            <li>
              <Link href="/available-books" onClick={() => setIsMenuOpen(false)}>
                Available Books
              </Link>
            </li>
            <li>
              <Link href="/scan" onClick={() => setIsMenuOpen(false)}>
                Scan
              </Link>
            </li>
            <li>
              <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
                contact
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>

      
      {/* Header Icons */}
     
      <div className="hidden sm:flex absolute top-0 right-0 p-4">
        <Link href="/profile">
          <UserIcon className="w-8 h-8 text-gray-700 cursor-pointer hover:text-white transition duration-300" />
        </Link>
        <Link href="/search">
          <MagnifyingGlassIcon className="w-8 h-8 text-gray-700 cursor-pointer  hover:text-white transition duration-300" />
        </Link>
        <Link href="/my-library">
          <BookOpenIcon className="w-8 h-8 text-gray-700 cursor-pointer hover:text-white transition duration-300" />
        </Link>
        <Link href="/information">
          <InformationCircleIcon className="w-8 h-8 text-gray-700 cursor-pointer hover:text-white transition duration-300" />
        </Link>
     
      
{/* Icône de prêt */}
<Link href="/loan-requests">
      <div className="flex items-center space-x-2">
         <UserIcon className="w-6 h-6 text-gray-700 " />
         <BookOpenIcon className="w-6 h-6 text-gray-700  hover:text-white transition duration-300" />
         <UserIcon className="w-6 h-6 text-gray-700 " />
      </div>
        </Link>
        <Link href="/available-books">
          <FaArrowAltCircleRight className="w-8 h-8 text-gray-700 cursor-pointer hover:text-white transition duration-300" />
        </Link>
        {/* Icône de scan */}
      <Link href="/scan">
        <FaQrcode className="w-8 h-8 text-gray-700 cursor-pointer hover:text-white transition duration-300" />
      </Link>
      <Link href="/contact">
  <ChatBubbleLeftIcon className="w-8 h-8 text-gray-700 cursor-pointer hover:text-white transition duration-300" />
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
            onClick={() => handleAddToLibrary(book, "read")}
          >
            <CheckCircleIcon className="w-6 h-6" />
            <span>Lu</span>
          </button>
          <button
            type="button"
            className="flex items-center space-x-2 text-blue-500"
            onClick={() => handleAddToLibrary(book, "to read")}
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
          <h2 className="text-xl font-medium mb-4">Add comment</h2>
          <textarea
            className="w-full h-32 p-4 mb-4 border border-gray-300 rounded-md text-black"
            placeholder="write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex space-x-4 mb-4">
            <span>Rating: </span>
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className={`w-6 h-6 cursor-pointer ${rating >= star ? "text-yellow-400" : "text-gray-400"}`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <button type="button" onClick={handleSubmitComment} className="bg-blue-800 text-black px-6 py-2 rounded-lg">
          Add the comment
          </button>
        </div>

        {/* Affichage des commentaires */}
        <div className="mt-10 w-full max-w-xl bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-medium mb-4 text-black">Comment</h2>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.comment_id} className="mb-6">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-black">{comment.user.username}</span>
                  <TrashIcon
                    className="w-5 h-5 text-red-500 cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => handleDeleteComment(comment.comment_id)}
                  />
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
            <p className="text-gray-400">No comments for this book.</p>
          )}
        </div>
      </div>
      {/* Footer */}
<footer className="bg-gradient-to-r from-indigo-950 via-orange-900 border-t-yellow-900 text-white py-4 mt-12 w-full fixed bottom-0 left-0">
  <div className="max-w-screen-xl mx-auto flex justify-between items-center">
    <p className="text-sm">&copy; {new Date().getFullYear()} ReadMeMore. Tous droits réservés.</p>
    <ul className="flex space-x-6">
      <li>
        <a href="/legal" className="hover:underline">
          Mentions légales
        </a>
      </li>
      <li>
        <a href="/privacy" className="hover:underline">
          Politique de confidentialité
        </a>
      </li>
    </ul>
    <div className="flex space-x-6">
      <a href="https://github.com" target="_blank" rel="noopener noreferrer">
        <FaGithub className="w-6 h-6 text-white" />
      </a>
      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
        <FaTwitter className="w-6 h-6 text-white" />
      </a>
      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
        <FaLinkedin className="w-6 h-6 text-white" />
      </a>
    </div>
  </div>
</footer>
    </main>
  );
}