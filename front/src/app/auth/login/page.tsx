"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Nouveau champ pour confirmation
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://readmemore.onrender.com";

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/csrf-token`, {
          withCredentials: true,
        });
        setCsrfToken(response.data.csrfToken);
      } catch (err) {
        console.error("Failed to fetch CSRF token");
      }
    };
    fetchCsrfToken();
  }, [API_BASE_URL]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Vérification si les mots de passe correspondent
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/login`,
        {
          email,
          password,
        },
        {
          headers: {
            "X-CSRF-Token": csrfToken || "",
          },
          withCredentials: true,
        }
      );

      const token = response.data.token;
      localStorage.setItem("token", token);

      setSuccessMessage("Login successful! Redirecting to Actus page...");
      setTimeout(() => {
        router.push("/comments");
      }, 2000);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || "Failed to login");
      } else {
        setError("Failed to login");
      }
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: 'url("/read2.avif")' }}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50" />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white p-8 rounded-lg shadow-lg max-w-lg w-full"
      >
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
          Login to Your Account
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
        <div className="mb-4">
          <label className="block text-lg mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your email"
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your password"
          />
        </div>
        <div className="mb-6">
          <label className="block text-lg mb-2" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-3 border rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Confirm your password"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-indigo-900 text-white text-xl font-bold rounded-lg hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-800"
        >
          Login
        </button>
        <p className="mt-6 text-center text-gray-700">
          Don't have an account?{" "}
          <Link href="/auth/register" className="text-blue-500 hover:text-blue-600">
            Register
          </Link>
        </p>
        <p className="mt-4 text-center text-gray-700">
          Forgot password?{" "}
          <Link href="/forgot-password" className="text-blue-500 hover:text-blue-600">
            Click here
          </Link>
        </p>
      </form>
    </div>
  );
}