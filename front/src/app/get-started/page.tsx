"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthPage() {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsRegistered(false);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/register`,
        { username: "username", email: "email", password: "password" },
        {
          headers: {
            "X-CSRF-Token": csrfToken || "",
          },
          withCredentials: true,
        }
      );

      setIsRegistered(true);
      alert("Registration successful!");
      router.push("/auth/login");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || "Failed to register");
      } else {
        setError("Failed to register");
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed" style={{
      backgroundImage: 'url("/Read Me.webp")',
   }}>
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50" />
      <div className="relative z-10 text-center text-white">
        <h2 className="text-4xl font-semibold mb-8">Create an Account</h2>
        <form onSubmit={handleRegister} className="bg-white p-8 rounded-lg shadow-xl w-96 mx-auto">
          {error && <p className="text-red-500">{error}</p>}
          {isRegistered && (
            <p className="text-green-500 mb-4">
              Registration successful! Please check your email to confirm your account.
            </p>
          )}
          {/* Button to navigate to the /auth/register page */}
          <Link href="/auth/register">
            <button
              type="button"
              className="w-full bg-[#964e25] text-white py-3 rounded hover:bg-[#884924] text-2xl font-bold"
            >
              Register
            </button>
          </Link>
        </form>
        <p className="mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-blue-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}