"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { CogIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Profile() {
  const [userData, setUserData] = useState<{
    username: string;
    email: string;
    role_name: string;
    profile_photo?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [imageLoading, setImageLoading] = useState<boolean>(true); // état pour charger l'image
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vous devez être connecté pour télécharger une photo.");
        return;
      }
  
      try {
        // Récupérer le token CSRF
        const csrfResponse = await axios.get(`${API_BASE_URL}/api/csrf-token`);
        const csrfToken = csrfResponse.data.csrfToken;
  
        // Créer le FormData
        const formData = new FormData();
        formData.append("profilePhoto", file);
  
        // Envoi du fichier avec le token CSRF
        const response = await axios.post(
          `${API_BASE_URL}/api/upload-profile-photo`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
              "X-CSRF-Token": csrfToken, // Ajoutez ici le token CSRF
            },
          }
        );
  
        // Mise à jour de l'interface utilisateur si la photo est mise à jour
        if (response.data.profile_photo) {
          alert("Photo de profil mise à jour avec succès !");
          setUserData((prevData) => {
            // Si prevData est non null, on met à jour la photo de profil.
            if (prevData) {
              return {
                ...prevData,
                profile_photo: response.data.profile_photo, // Mettre à jour la photo de profil
              };
            }
            // Si prevData est null, on renvoie null.
            return prevData;
          });
        }
      } catch (error) {
        console.error("Erreur lors de l'upload de la photo", error);
        alert("Une erreur est survenue lors de l'upload.");
      }
    }
  };

  const handleImageLoad = () => setImageLoading(false); // Mettre à jour l'état une fois l'image chargée

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center p-4 relative"
      style={{ backgroundImage: `url("/book.webp")` }}
    >
      <div className="absolute inset-0 bg-black opacity-50" />
      <div className="relative z-10 bg-white p-8 rounded-lg shadow-lg max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">My Profile</h1>
        {userData ? (
          <div className="space-y-4">
            {/* Photo de profil */}
            <div className="relative">
              {/* Affichage de l'image avec gestion du chargement */}
              <img
                src={
                  userData.profile_photo
                    ? `${API_BASE_URL}/uploads/profiles/${userData.profile_photo}`
                    : "/default-profile.jpg" // Image par défaut si aucune photo n'est présente
                }
                alt="User Profile"
                onLoad={handleImageLoad} // Appel de la fonction une fois l'image chargée
                className={`w-24 h-24 mx-auto rounded-full object-cover border-4 border-indigo-500 ${
                  imageLoading ? "opacity-0" : "opacity-100"
                }`} // Appliquer une opacité quand l'image est en cours de chargement
              />
              <label
                htmlFor="profile-photo"
                className="absolute -bottom-2 right-20 bg-indigo-500 text-white p-2 rounded-full cursor-pointer"
              >
                📷
              </label>
              <input
                id="profile-photo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </div>

            {/* Informations utilisateur */}
            <p className="text-xl font-semibold text-gray-800">
              Username: <span className="text-gray-600">{userData.username}</span>
            </p>
            <p className="text-xl font-semibold text-gray-800">
              Email: <span className="text-gray-600">{userData.email}</span>
            </p>

            {/* Lien vers les paramètres */}
            <Link href="/settings">
              <div className="flex items-center justify-center space-x-2 mt-4 text-indigo-700 hover:text-indigo-900 cursor-pointer">
                <CogIcon className="w-6 h-6" />
                <span className="text-lg">Modifier mon profil</span>
              </div>
            </Link>

            {/* Bouton de déconnexion */}
            <button type="button"
              onClick={handleLogout}
              className="mt-6 w-full py-3 bg-indigo-900 text-white text-lg font-bold rounded-lg hover:bg-indigo-800"
            >
              Déconnexion
            </button>
          </div>
        ) : (
          <p className="text-gray-600">Chargement des données...</p>
        )}
      </div>
    </div>
  );
}