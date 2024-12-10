"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const LoanRequestsPage = () => {
  const [sentRequests, setSentRequests] = useState<LoanRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<LoanRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

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
      };
    };
    RequestingUser?: {
      username: string;
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
    <div className="min-h-screen p-4 flex flex-col">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Mes Demandes de Prêt
      </h1>

      {isLoading && <p className="text-center text-blue-500">Chargement des données...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Section pour les demandes envoyées */}
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Demandes envoyées</h2>
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
                Auteur(s) : {request.Book?.authors?.join(", ") || "Non renseigné"}
              </p>
              <p className="text-sm text-gray-600 text-center mb-2">
                Propriétaire :{" "}
                <span className="font-bold text-blue-600">
                  {request.Book?.user?.username || "Inconnu"}
                </span>
              </p>
              <p className="text-sm text-gray-600 text-center mb-2">
                Statut :{" "}
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
                Date de demande : {new Date(request.request_date).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            Aucune demande envoyée pour le moment.
          </p>
        )}
      </div>

      {/* Section pour les demandes reçues */}
      <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">Demandes reçues</h2>
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
                Auteur(s) : {request.Book?.authors?.join(", ") || "Non renseigné"}
              </p>
              <p className="text-sm text-gray-600 text-center mb-2">
                Propriétaire :{" "}
                <span className="font-bold text-blue-600">
                  {request.Book?.user?.username || "Inconnu"}
                </span>
              </p>
              <p className="text-sm text-gray-600 text-center mb-2">
                Demandeur :{" "}
                <span className="font-bold text-blue-600">
                  {request.RequestingUser?.username || "Inconnu"}
                </span>
              </p>
              <p className="text-sm text-gray-600 text-center">
                Statut :{" "}
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
                Date de demande : {new Date(request.request_date).toLocaleDateString()}
              </p>
              <button
                type="button"
                onClick={() => handleRequestStatusChange(request.request_id, "accepted")}
                className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg shadow hover:bg-green-600 transition"
              >
                Accepter
              </button>
              <button
                type="button"
                onClick={() => handleRequestStatusChange(request.request_id, "declined")}
                className="mt-2 bg-red-500 text-white py-2 px-4 rounded-lg shadow hover:bg-red-600 transition"
              >
                Refuser
              </button>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            Aucune demande reçue pour le moment.
          </p>
        )}
      </div>
    </div>
  );
};

export default LoanRequestsPage;