"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {  InformationCircleIcon } from "@heroicons/react/24/solid";
import { FaArrowAltCircleRight, FaQrcode } from "react-icons/fa";
import { FaBars, FaTimes } from "react-icons/fa";
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

import { UserIcon } from "@heroicons/react/24/solid";
import { BookOpenIcon, MagnifyingGlassIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/solid";

const LoanRequestsPage = () => {
  const router = useRouter();
  const [sentRequests, setSentRequests] = useState<LoanRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<LoanRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://readmemore.onrender.com";

  interface Book {
    book_id: number;
    title: string;
    authors: string[];
    thumbnail: string;
    user?: {
      username: string;
      email: string;
      profile_photo?: string;
    };
  }

  interface LoanRequest {
    request_id: number;
    status: string;
    request_date: string;
    Book?: {
      title: string;
      authors: string[];
      thumbnail: string;
      user?: {
        username: string;
        user_id: number;
      };
    };
    RequestingUser?: {
      username: string;
      user_id: number; 
    };
  }

  // Fonction pour récupérer le CSRF token
  const fetchCsrfToken = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/csrf-token`, {
        withCredentials: true, // Nécessaire pour inclure les cookies
      });
      return response.data.csrfToken;
    } catch (err) {
      console.error("Erreur lors de la récupération du CSRF token :", err);
      throw new Error("Impossible de récupérer le CSRF token.");
    }
  };

  useEffect(() => {
    const fetchLoanRequests = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Utilisateur non authentifié.");
        }

        const response = await axios.get(`${API_BASE_URL}/api/loans/requests`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true, // Inclut les cookies (CSRF)
        });

        setSentRequests(response.data.sentRequests);
        setReceivedRequests(response.data.receivedRequests);
      } catch (err) {
        console.error("Erreur :", err);
        setError("Erreur lors de la récupération des demandes de prêt.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoanRequests();
  }, [API_BASE_URL]);

  const handleRequestStatusChange = async (requestId: number, status: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Utilisateur non authentifié.");
      }

      const csrfToken = await fetchCsrfToken();

      await axios.put(
        `${API_BASE_URL}/api/loans/requests/${requestId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-CSRF-Token": csrfToken, // Ajout du CSRF token
          },
          withCredentials: true,
        }
      );

      // Mettre à jour l'état local après modification du statut
      setReceivedRequests((prev) =>
        prev.map((request) =>
          request.request_id === requestId ? { ...request, status } : request
        )
      );
    } catch (err) {
      console.error("Erreur :", err);
      setError("Erreur lors de la mise à jour du statut.");
    }
  };

  return (
    <div className="min-h-screen p-4 flex flex-col  pb-16">
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
        <Link href="/scan">
          <FaQrcode className="w-8 h-8 text-gray-700 cursor-pointer hover:text-white transition duration-300" />
        </Link>
        <Link href="/contact">
  <ChatBubbleLeftIcon className="w-8 h-8 text-gray-700 cursor-pointer hover:text-white transition duration-300" />
</Link>
      </div>

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
                Search
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
                  Scan
                </Link>
              </li>

            </ul>
          </div>
        )}
      </div>
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
      My Loan Requests
      </h1>

      {isLoading && <p className="text-center text-blue-500">Chargement des données...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Section pour les demandes envoyées */}
      <h2 className="text-2xl font-semibold text-blue-800 mb-4">Requests sent</h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sentRequests.length > 0 ? (
          sentRequests.map((request) => (
            <div
              key={request.request_id}
              className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center transition-transform hover:scale-105"
            >
              <img
                src={request.Book?.thumbnail || ""}
                alt={request.Book?.title || "Image"}
                className="w-32 h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
                {request.Book?.title || "Titre inconnu"}
              </h3>
              <p className="text-sm text-gray-600 text-center mb-2">
              Author(s) : {request.Book?.authors?.join(", ") || "Non renseigné"}
              </p>
              <p className="text-sm text-gray-600 text-center mb-2">
              Owner:{" "}
                <span className="font-bold text-blue-600">
                  {request.Book?.user?.username || "Inconnu"}
                </span>
              </p>
              <p className="text-sm text-gray-600 text-center mb-2">
                Status :{" "}
                <span
                  className={`font-bold ${
                    request.status === "accepted"
                      ? "text-green-600"
                      : request.status === "pending"
                      ? "text-orange-600"
                      : "text-red-600"
                  }`}
                >
                  {request.status}
                </span>
              </p>
              <p className="text-sm text-gray-600 text-center">
              Request date : {new Date(request.request_date).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No requests sent at the moment
          </p>
        )}
      </div>

      {/* Section pour les demandes reçues */}
      <h2 className="text-2xl font-semibold text-orange-700 mt-8 mb-4">Requests received</h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {receivedRequests.length > 0 ? (
          receivedRequests.map((request) => (
            <div
              key={request.request_id}
              className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center transition-transform hover:scale-105"
            >
              <img
                src={request.Book?.thumbnail || ""}
                alt={request.Book?.title || "Image"}
                className="w-32 h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
                {request.Book?.title || "Titre inconnu"}
              </h3>
              <p className="text-sm text-gray-600 text-center mb-2">
              Author(s) : {request.Book?.authors?.join(", ") || "Non renseigné"}
              </p>
              <p className="text-sm text-gray-600 text-center mb-2">
              Owner :{" "}
                <span className="font-bold text-blue-600">
                  {request.Book?.user?.username || "Inconnu"}
                </span>
              </p>
              <p className="text-sm text-gray-600 text-center mb-2">
              Requester :{" "}
                <span className="font-bold text-blue-600">
                  {request.RequestingUser?.username || "Inconnu"}
                </span>
              </p>
              <p className="text-sm text-gray-600 text-center">
                Status :{" "}
                <span
                  className={`font-bold ${
                    request.status === "accepted"
                      ? "text-orange-600"
                      : request.status === "pending"
                      ? "text-orange-600"
                      : "text-indigo-700"
                  }`}
                >
                  {request.status}
                </span>
              </p>
              <p className="text-sm text-gray-600 text-center">
              Request date : {new Date(request.request_date).toLocaleDateString()}
              </p>
              <button
                type="button"
                onClick={() => handleRequestStatusChange(request.request_id, "accepted")}
                className="mt-4 bg-orange-800 text-white py-2 px-4 rounded-lg shadow hover:bg-orange-600 transition"
              >
                Accept
              </button>
              <button
                type="button"
                onClick={() => handleRequestStatusChange(request.request_id, "declined")}
                className="mt-2 bg-indigo-950 text-white py-2 px-4 rounded-lg shadow hover:bg-indigo-800 transition"
              >
                Reject
              </button>
              {/* Bouton Contacter */}
              <button
  type="button"
  onClick={() =>
    router.push(`/messages/${request.request_id}/${request.RequestingUser?.username}`)
  }
  className="mt-2 bg-green-600 text-white py-2 px-4 rounded-lg shadow hover:bg-green-500 transition"
>
  Contacter
</button>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
           No requests received at the moment
          </p>
        )}
      </div>
       {/* Footer */}
      <footer className="bg-gradient-to-r from-indigo-950 via-orange-900 border-t-yellow-900 text-white py-4 mt-12 w-full fixed bottom-0 left-0">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} ReadMeMore. Tous droits réservés.</p>
          <ul className="flex space-x-6">
            <li><a href="/legal" className="hover:underline">Mentions légales</a></li>
            <li><a href="/privacy" className="hover:underline">Politique de confidentialité</a></li>
          </ul>
          <div className="flex space-x-6">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"><FaGithub className="w-6 h-6 text-white" /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter className="w-6 h-6 text-white" /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin className="w-6 h-6 text-white" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoanRequestsPage;