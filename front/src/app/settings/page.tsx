"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { TrashIcon, LockClosedIcon } from "@heroicons/react/24/solid";

import {
  UserIcon,
  MagnifyingGlassIcon,
  InformationCircleIcon,
  StarIcon,
  BookOpenIcon,
  CheckCircleIcon,
  HeartIcon,
  ArrowPathIcon, 
} from "@heroicons/react/24/solid";
import { FaGithub, FaTwitter, FaLinkedin,FaQrcode, FaArrowAltCircleRight, FaBars,
  FaTimes, } from 'react-icons/fa';

export default function Settings() {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    newPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const [randomPosition, setRandomPosition] = useState<string>("left");

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://readmemore.onrender.com";

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

        // Set random position for the book images
        setRandomPosition(Math.random() > 0.5 ? "left" : "right");

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
    <div className="relative min-h-screen p-4 flex flex-col items-center bg-cover bg-center pt-16  pb-16"
    style={{ backgroundImage: `url("/book.webp")` }}>
       {/* Hamburger Menu */}
    <div className="absolute top-4 left-4 md:hidden z-50">
      <button type="button"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="text-gray-700 p-2 rounded-full bg-white shadow-lg"
      >
        {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>
      {isMenuOpen && (
        <div className="absolute top-10 left-0 bg-white shadow-lg rounded-lg w-48 p-4">
          <ul className="space-y-4 text-gray-700">
            <li>
              <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                Profile
              </Link>
            </li>
            <li>
              <Link href="/search" onClick={() => setIsMenuOpen(false)}>
                Search
              </Link>
            </li>
            <li>
              <Link href="/about" onClick={() => setIsMenuOpen(false)}>
                About
              </Link>
            </li>
            <li>
              <Link href="/available-books" onClick={() => setIsMenuOpen(false)}>
                Available Books
              </Link>
            </li>
            <li>
              <Link href="/scan" onClick={() => setIsMenuOpen(false)}>
                Scan
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>

      {/* Header */}
      <div className={`absolute top-0 right-0 p-4 ${isMenuOpen ? 'hidden' : ''} sm:flex`}>
        <Link href="/profile">
          <UserIcon className="w-8 h-8 text-gray-700 cursor-pointer  hover:text-white transition duration-300" />
        </Link>
        <Link href="/search">
          <MagnifyingGlassIcon className="w-8 h-8 text-gray-700 cursor-pointer  hover:text-white transition duration-300" />
        </Link>
        <Link href="/about">
          <InformationCircleIcon className="w-8 h-8 text-gray-700 cursor-pointer  hover:text-white transition duration-300" />
        </Link>
        {/* Icône de prêt */}
      <Link href="/available-books">
        <FaArrowAltCircleRight className="w-8 h-8 text-gray-700 cursor-pointer hover:text-white transition duration-300" />
      </Link>
      
      {/* Icône de scan */}
      <Link href="/scan">
        <FaQrcode className="w-8 h-8 text-gray-700 cursor-pointer hover:text-white transition duration-300" />
      </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6 text-black">Profile settings</h1>
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleUpdateProfile} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <label htmlFor="username" className="block text-xl mb-2 text-amber-800">Username</label>
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
          <label htmlFor="newPassword" className="block text-xl mb-2 text-amber-800">New password</label>
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
         Apply
        </button>
      </form>

      <div className="flex space-x-4 mt-4">
        <button type="button"
          onClick={handleDeleteAccount}
          className="text-[#1e1e49] font-bold flex items-center space-x-2"
        >
          <TrashIcon className="w-6 h-6" />
          <span>Delete my account</span>
        </button>
      </div>
       {/* Footer */}
<footer className="bg-gradient-to-r from-indigo-950 via-orange-900 border-t-yellow-900 text-white py-4 mt-12 w-full fixed bottom-0 left-0">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} ReadMeMore. Tous droits réservés.</p>
          <ul className="flex space-x-6">
            <li>
              <a href="/legal" className="hover:underline">
                Mentions légales
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:underline">
                Politique de confidentialité
              </a>
            </li>
          </ul>
          <div className="flex space-x-6">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <FaGithub className="w-6 h-6 text-white" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="w-6 h-6 text-white" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="w-6 h-6 text-white" />
            </a>
          </div>
        </div>
      </footer>
    
    </div>
    
  );
}