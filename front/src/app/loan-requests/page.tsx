"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const LoanRequestsPage = () => {
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
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
        });

        setLoanRequests(response.data);
      } catch (err) {
        console.error("Erreur :", err);
        setError("Erreur lors de la récupération des demandes de prêt.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoanRequests();
  }, [API_BASE_URL]);

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Mes Demandes de Prêt</h1>
      {isLoading && <p>Chargement des données...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {loanRequests.map((request) => (
  <div key={request.request_id}>
    <h3>{request.Book?.title || "Informations sur le livre indisponibles"}</h3>
    <p>Auteur(s) : {request.Book?.authors?.join(", ") || "Non renseigné"}</p>
    <img src={request.Book?.thumbnail} alt={request.Book?.title || "Couverture indisponible"} />
    <p>Propriétaire : {request.Book?.user?.username || "Inconnu"}</p>
    <p>Statut : {request.status}</p>
    <p>Date de demande : {new Date(request.request_date).toLocaleDateString()}</p>
  </div>
))}
      </div>
    </div>
  );
};

export default LoanRequestsPage;