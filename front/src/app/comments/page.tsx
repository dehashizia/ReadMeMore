"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

import { UserIcon, StarIcon, BookOpenIcon, ChatBubbleLeftIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { FaArrowAltCircleRight, FaQrcode } from "react-icons/fa";
import {

  InformationCircleIcon,
 
} from "@heroicons/react/24/solid";
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { FaBars, FaTimes } from "react-icons/fa";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <main className="min-h-screen p-6 flex flex-col items-center justify-start pb-16">
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
     
  <div className={`absolute top-0 right-0 p-4 ${isMenuOpen ? 'hidden' : ''} sm:flex`}>
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
     

      {/* Section des commentaires */}
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-2xl font-semibold mb-6 text-black">Actus</h2>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.comment_id} className="mb-8 flex items-start space-x-6 p-6 bg-gray-100 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              {/* Affichage de l'image de couverture */}
              {comment.book.thumbnail && (
                <img
                  src={comment.book.thumbnail}
                  alt={`Couverture de ${comment.book.title}`}
                  className="w-24 h-32 object-cover rounded-lg shadow-md"
                />
              )}
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-black">{comment.user.username} parle de ce livre :</span>
                  <p className="mt-2 text-lg text-black">{comment.book.title}</p>
                
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`w-5 h-5 ${comment.rating && comment.rating >= star ? "text-yellow-400" : "text-gray-400"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-4 text-lg text-black">{comment.text}</p>
                <span className="text-sm text-gray-500">{new Date(comment.date).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">Aucun commentaire</p>
        )}
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