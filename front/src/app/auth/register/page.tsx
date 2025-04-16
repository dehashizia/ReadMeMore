"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
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
    setIsRegistered(false);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/register`,
        { username, email, password, confirmPassword  },
        {
          headers: {
            "X-CSRF-Token": csrfToken || "",
          },
          withCredentials: true,
        }
      );

      const token = response.data.token;
      localStorage.setItem("token", token);
      setIsRegistered(true);

      setTimeout(() => router.push("/auth/login"), 2000); // Redirection après 2 secondes
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || "Failed to register");
      } else {
        setError("Failed to register");
      }
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: 'url("/book1.webp")' }}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50" />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white p-8 rounded-lg shadow-lg max-w-lg w-full"
      >
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
          Create an Account
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {isRegistered && (
          <p className="text-green-500 text-center mb-4">
            Registration successful! Redirecting to login...
          </p>
        )}
        <div className="mb-4">
          <label className="block text-lg mb-2" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-3 border rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your username"
          />
        </div>
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
          Register
        </button>
        <p className="mt-6 text-center text-gray-700">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-blue-500 hover:text-blue-600">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}