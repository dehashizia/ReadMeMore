"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { TrashIcon, LockClosedIcon } from "@heroicons/react/24/solid";

export default function Settings() {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    newPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

 
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found, redirecting to login");
          router.push("/auth/login");
          return;
        }

        const [profileResponse, csrfResponse] = await Promise.all([  
          axios.get(`${API_BASE_URL}/api/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/api/csrf-token`, { withCredentials: true }),
        ]);

        console.log("User data fetched:", profileResponse.data);
        setUserData({
          username: profileResponse.data.username || "",
          email: profileResponse.data.email || "",
          newPassword: "",
        });
        setCsrfToken(csrfResponse.data.csrfToken);
      } catch (error) {
        console.error("Failed to load profile data or CSRF token:", error);
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [API_BASE_URL, router]);

 
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
  
      const response = await axios.put(`${API_BASE_URL}/api/profile`, {
        username: userData.username,
        email: userData.email,
        newPassword: userData.newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-CSRF-Token": csrfToken || "", 
        },
        withCredentials: true,
      });
  
      const { message, passwordChanged } = response.data;
      console.log("Profile updated successfully:", message);
  
      if (passwordChanged) {
      
        alert("Mot de passe mis à jour. Veuillez vous reconnecter.");
        localStorage.removeItem("token");
        router.push("/auth/login");
      } else {
        alert("Profil mis à jour avec succès !");
        router.push("/profile");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      setError("Failed to update profile.");
    }
  };

 
  const handleDeleteAccount = async () => {
    console.log("Delete account submitted");

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.delete(`${API_BASE_URL}/api/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-CSRF-Token": csrfToken || "",
        },
        withCredentials: true,
      });

      console.log("Account deleted successfully:", response.data);
      alert("Account deleted.");
      localStorage.removeItem("token");
      router.push("/auth/login");
    } catch (error) {
      console.error("Failed to delete account:", error);
      setError("Failed to delete account.");
    }
  };


  const handlePasswordChangeClick = () => {

    setUserData({
      ...userData,
      newPassword: "Nouveau mot de passe", 
    });
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6 text-black">Paramètres du profil</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleUpdateProfile} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <label htmlFor="username" className="block text-xl mb-2 text-amber-800">Nom d'utilisateur</label>
        <input
          id="username"
          type="text"
          value={userData.username || ""}
          onChange={(e) => setUserData({ ...userData, username: e.target.value })}
          className="border p-2 w-full mb-4 text-black"
        />

        <label htmlFor="email" className="block text-xl mb-2 text-amber-800">Email</label>
        <input
          id="email"
          type="email"
          value={userData.email || ""}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          className="border p-2 w-full mb-4 text-black"
        />

        <div className="flex items-center space-x-2">
          <label htmlFor="newPassword" className="block text-xl mb-2 text-amber-800">Nouveau mot de passe</label>
          <button 
            type="button"
            onClick={handlePasswordChangeClick}
            className="text-[#1e1e49]"
          >
            <LockClosedIcon className="w-6 h-6" />
          </button>
        </div>
        <input
          id="newPassword"
          type="password"
          value={userData.newPassword || ""}
          onChange={(e) => setUserData({ ...userData, newPassword: e.target.value })}
          className="border p-2 w-full mb-4 text-black"
        />

        <button
          type="submit"
          className="mb-4 px-8 py-3 bg-[#1e1e49] text-white font-bold rounded-full"
        >
          Appliquer
        </button>
      </form>

      <div className="flex space-x-4 mt-4">
        <button type="button"
          onClick={handleDeleteAccount}
          className="text-[#793f18] flex items-center space-x-2"
        >
          <TrashIcon className="w-6 h-6" />
          <span>Supprimer mon compte</span>
        </button>
      </div>
    </div>
  );
}