"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { CogIcon } from '@heroicons/react/24/outline'; 
import Link from "next/link";

export default function Profile() {
  const [userData, setUserData] = useState<{
    username: string;
    email: string;
    role_name: string;  
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); 
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found, please login.");
          setLoading(false);
          return;
        }
        
        const response = await axios.get(`${API_BASE_URL}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,  
          },
        });

        setUserData(response.data); 
      } catch (error) {
        console.error("Failed to fetch user data", error);
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [API_BASE_URL]);
    // Fonction de déconnexion
    const handleLogout = () => {
      localStorage.removeItem("token");  
      router.push("/auth/login");  
    };

 
  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-6 text-black">Profil</h1>
      {userData ? (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
          <p className="text-xl mb-4 text-black">Nom d'utilisateur : {userData.username}</p>
          <p className="text-xl mb-4 text-black">Email : {userData.email}</p>
             {/* Icône de paramètres pour modifier le profil */}
             <Link href="/settings">
            <div className="flex items-center space-x-2 mt-4 cursor-pointer">
              <CogIcon className="w-6 h-6 text-gray-700" />
              <span className="text-lg text-gray-700">Modifier mon profil</span>
            </div>
          </Link>
          {/* Bouton de déconnexion */}
          <button  type="button"
            onClick={handleLogout}
            className="mb-4 px-8 py-3 bg-[#964e25] text-black font-bold rounded-full hover:bg-[#884924] transition duration-300"
          >
            Déconnexion
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}