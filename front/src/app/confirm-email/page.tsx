"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation"; 

export default function ConfirmEmail() {
  const [message, setMessage] = useState("Vérification en cours...");
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); 

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"; 

  useEffect(() => {
    if (token) {

      const confirmEmail = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/confirm-email?token=${token}`);
          setMessage("Email confirmé avec succès !");
        } catch (err) {
          if (axios.isAxiosError(err)) {
            setError(err.response?.data?.error || "Erreur lors de la confirmation de l'email.");
          } else {
            setError("Une erreur inconnue est survenue.");
          }
        }
      };
      confirmEmail();
    } else {
      setMessage("Token manquant !");
    }
  }, [token, API_BASE_URL]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          Confirmation de l'email
        </h2>
        <div className="text-center">
          {message && <p className="text-sm text-green-600">{message}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}