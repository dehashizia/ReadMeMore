"use client";

import { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";

export default function ConfirmEmail() {
  const [message, setMessage] = useState("Vérification en cours...");
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Ici on initialise searchParams avec un type explicitement définis comme URLSearchParams | null
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null);

  const token = searchParams ? searchParams.get("token") : null;

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

  useEffect(() => {
    setIsClient(true);

    // Utilisation de window.location.search pour obtenir les paramètres d'URL
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setSearchParams(params);
    }
  }, []);

  // Lorsqu'on a `isClient` et que `searchParams` est disponible, on peut utiliser le token
  useEffect(() => {
    if (isClient && token) {
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
  }, [token, API_BASE_URL, isClient]);

  // Retourner la page avec Suspense
  return (
    <Suspense fallback={<div>Chargement...</div>}>
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
    </Suspense>
  );
}