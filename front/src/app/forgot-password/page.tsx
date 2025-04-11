"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

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

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/forgot-password`,
        { email },
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
        setError(err.response?.data?.error || "Erreur lors de la demande.");
      } else {
        setError("Une erreur inconnue est survenue.");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center ">
       <div className="absolute top-0 right-0 h-full w-1/3">
        <div
          className="absolute top-0 right-0 w-full h-1/2 rounded-bl-full"
          style={{
            background: 'linear-gradient(to bottom, #6048b2, #18122f)',
            clipPath: 'ellipse(70% 100% at 100% 0%)',
          }}
        />
        <div
          className="absolute top-1/2 right-0 w-full h-1/2"
          style={{
            background: 'linear-gradient(to top, #a57f60, #6e5b54)',
            clipPath: 'ellipse(70% 100% at 100% 100%)',
          }}
        />
      </div>
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
        Reset Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email :
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-900 text-black font-semibold rounded-md shadow hover:bg-indigo-800 "
          >
           Send
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
  );
}