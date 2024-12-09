"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const LoanRequestsPage = () => {
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

  interface User {
    username: string;
  }
  
  interface Book {
    book_id: number;
    title: string;
    authors: string[];
    thumbnail: string;
    user?: User; 
  }

  // Modèle ajusté de LoanRequest
  type LoanRequest = {
    request_id: number;
    book_id: number;  
    user_id: number | null; 
    status: string;
    request_date: Date;
  };

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/csrf-token`, {
          withCredentials: true,
        });
        setCsrfToken(response.data.csrfToken);
      } catch (err) {
        console.error("Erreur lors de la récupération du CSRF token :", err);
        setError("Impossible de récupérer le CSRF token.");
      }
    };

    fetchCsrfToken();
  }, [API_BASE_URL]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const fetchLoanRequests = async () => {
      if (!csrfToken || !token) return;

      setIsLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/loans/requests`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-CSRF-Token": csrfToken,
          },
          withCredentials: true,
        });
        setLoanRequests(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des demandes de prêt :", error);
        setError("Erreur lors de la récupération des demandes de prêt.");
        setIsLoading(false);
      }
    };

    if (csrfToken && token) {
      fetchLoanRequests();
    }
  }, [csrfToken, token, API_BASE_URL]);

  return (
    <div className="min-h-screen p-4 flex flex-col">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Mes demandes de prêt
      </h1>
      {isLoading && <p className="text-center text-blue-500">Chargement des demandes...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loanRequests.length > 0 ? (
          loanRequests.map((loanRequest) => (
            <div key={loanRequest.request_id} className="bg-white shadow-md rounded-lg p-4">
              
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Livre ID: {loanRequest.book_id}
               
                {/* Affiche l'ID du livre */}
              </h2>
              {/* Exemple de récupération du nom de l'utilisateur par ID (idéalement via une autre API ou des données locales) */}
              <p className="text-sm text-gray-600">
                Demandeur: <span className="font-bold">{loanRequest.user_id || "Inconnu"}</span>
             
              </p>
              <p className="text-sm text-gray-600">Statut: {loanRequest.status}</p>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">Aucune demande de prêt.</p>
        )}
      </div>
    </div>
  );
};

export default LoanRequestsPage;