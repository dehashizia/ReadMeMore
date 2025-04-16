"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

interface User {
  user_id: number;
  username: string;
  profile_photo: string;
}

interface Message {
  message_id: number;
  loan_request_id: number;
  sender_id: number;
  recipient_id: number;
  content: string;
  timestamp: string;
  sender: User;
  recipient: User;
}

const MessagePage = () => {
  const { requestId, recipientUsername } = useParams();  // Récupérer les paramètres de l'URL
  const [messages, setMessages] = useState<Message[]>([]); // Initialisation de messages en tant que tableau
  const [newMessage, setNewMessage] = useState<string>(""); // Nouveau message
  const [csrfToken, setCsrfToken] = useState<string>("");

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://readmemore.onrender.com"; // Récupérer l'URL de base de l'API

  // Fonction pour récupérer le CSRF token
  const fetchCsrfToken = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/csrf-token`, {
        withCredentials: true, // Nécessaire pour inclure les cookies
      });
      setCsrfToken(response.data.csrfToken);
    } catch (err) {
      console.error("Erreur lors de la récupération du CSRF token :", err);
      throw new Error("Impossible de récupérer le CSRF token.");
    }
  }, [API_BASE_URL]); // Ajouter API_BASE_URL comme dépendance

  useEffect(() => {
    // Récupérer le CSRF token au chargement de la page
    fetchCsrfToken();
  }, [fetchCsrfToken]); // Ajouter fetchCsrfToken comme dépendance

  useEffect(() => {
    if (requestId && recipientUsername) {
      // Récupérer les messages via API
      const fetchMessages = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error("Utilisateur non authentifié.");
          }

          const response = await axios.get(
            `${API_BASE_URL}/api/messages/${requestId}/${recipientUsername}`,
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          );
          setMessages(response.data); // Set messages fetched from API
        } catch (error) {
          console.error("Erreur lors de la récupération des messages :", error);
        }
      };

      fetchMessages();
    }
  }, [requestId, recipientUsername, API_BASE_URL]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Utilisateur non authentifié.");
        }

        // Envoi du nouveau message
        const response = await axios.post(
          `${API_BASE_URL}/api/messages/${requestId}/${recipientUsername}`,
          { content: newMessage },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Token pour authentification
              "X-CSRF-Token": csrfToken, // Token CSRF pour la sécurité
            },
            withCredentials: true, // Inclut les cookies (CSRF)
          }
        );

        // Ajouter le message envoyé à l'état
        setMessages((prevMessages) => [...prevMessages, response.data]);
        setNewMessage("");  // Réinitialiser le champ de message
      } catch (err) {
        console.error("Erreur lors de l'envoi du message :", err);
      }
    }
  };

  return (
    <div className="min-h-screen p-4 flex flex-col">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Messages with {recipientUsername}
      </h1>

      {/* Liste des messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">No messages yet.</p>
        ) : (
          messages.map((message) => (
            <div
              key={message.message_id}
              className={`p-4 mb-4 rounded-lg ${message.sender.username === recipientUsername ? "bg-blue-100" : "bg-gray-100"}`}
            >
              <div className="flex items-center">
                <img
                  src={message.sender.profile_photo || "/default-avatar.png"}
                  alt={message.sender.username}
                  className="w-8 h-8 rounded-full mr-3"
                />
                <span className="font-semibold">{message.sender.username}</span>
              </div>
              <p className="mt-2">{message.content}</p>
              <p className="text-sm text-gray-600 text-right">
                {new Date(message.timestamp).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Formulaire pour envoyer un message */}
      <div className="flex mt-4">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-lg"
        />
        <button
          type="button"
          onClick={handleSendMessage}
          className="ml-4 bg-green-600 text-white py-2 px-4 rounded-lg shadow hover:bg-green-500 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessagePage;