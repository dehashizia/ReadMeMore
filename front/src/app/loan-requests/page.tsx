"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface LoanRequest {
  loan_request_id: number;
  status: string;
  Book: {
    title: string;
  };
}

const LoanRequestsPage = () => {
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/csrf-token`, {
          withCredentials: true,
        });
        setCsrfToken(response.data.csrfToken);
      } catch (err) {
        console.error("Erreur lors de la récupération du CSRF token :", err);
      }
    };

    const fetchLoanRequests = async () => {
      try {
        const response = await axios.get<LoanRequest[]>(`${API_BASE_URL}/api/loans`, {
          headers: { "X-CSRF-Token": csrfToken || "" },
          withCredentials: true,
        });
        setLoanRequests(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des demandes de prêt :", error);
      }
    };

    fetchCsrfToken();
    fetchLoanRequests();
  }, [csrfToken, API_BASE_URL]);

  return (
    <div>
      <h1>Vos demandes de prêt</h1>
      <ul>
        {loanRequests.map((request) => (
          <li key={request.loan_request_id}>
            <h2>{request.Book.title}</h2>
            <p>Statut : {request.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LoanRequestsPage;