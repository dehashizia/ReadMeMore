"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

export default function ResetPassword() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

  // Récupérer les paramètres d'URL seulement côté client
  useEffect(() => {
    setIsClient(true);

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setSearchParams(params);
    }
  }, []);

  const token = searchParams ? searchParams.get("token") : null;

  // Récupération du CSRF token à l'initialisation du composant
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/csrf-token`, {
          withCredentials: true,
        });
        setCsrfToken(response.data.csrfToken);
      } catch (err) {
        console.error("Échec de la récupération du token CSRF");
      }
    };
    fetchCsrfToken();
  }, [API_BASE_URL]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/reset-password`,
        { token, password },
        {
          headers: {
            "X-CSRF-Token": csrfToken || "", // Ajout du token CSRF dans les en-têtes
          },
          withCredentials: true, // Nécessaire pour inclure les cookies
        }
      );
      setMessage(response.data.message);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error || "Erreur lors de la réinitialisation."
        );
      } else {
        setError("Une erreur inconnue est survenue.");
      }
    }
  };

  // S'assurer que le composant ne s'affiche qu'après avoir récupéré les paramètres de l'URL côté client
  if (!isClient || !token) {
    return <div>Chargement...</div>;
  }

  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          Reset password
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
               New password :
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm password :
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-900 text-black font-semibold rounded-md shadow hover:bg-indigo-800"
            >
              Reset
            </button>
          </form>
          {message && (
            <p className="mt-4 text-sm text-green-600 text-center">{message}</p>
          )}
          {error && (
            <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
          )}
        </div>
      </div>
    </Suspense>
  );
}