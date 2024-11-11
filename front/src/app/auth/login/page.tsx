"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';


  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/csrf-token`, {
          withCredentials: true,
        });
        setCsrfToken(response.data.csrfToken);
      } catch (err) {
        console.error('Failed to fetch CSRF token');
      }
    };
    fetchCsrfToken();
  }, [API_BASE_URL]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
     
      const response = await axios.post(
        `${API_BASE_URL}/api/login`,
        {
          email,
          password,
        },
        {
          headers: {
            'X-CSRF-Token': csrfToken || '', 
          },
          withCredentials: true, 
        }
      );

      const token = response.data.token;
      localStorage.setItem('token', token); 

      alert('Login successful!');
      router.push('/search'); 
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || 'Failed to login');
      } else {
        setError('Failed to login');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl mb-4">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <div className="mb-4">
          <label className="block mb-1" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border rounded w-full p-2 bg-white text-black placeholder-gray-500"
            placeholder="Enter your email"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border rounded w-full p-2 bg-white text-black placeholder-gray-500"
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" className="w-full bg-[#964e25] text-white p-2 rounded hover:bg-[#884924]">Login</button>
        <p className="mt-4">Don't have an account? <Link href="/auth/register" className="text-blue-500">Register</Link></p>
      </form>
    </div>
  );
}