"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ConfirmEmail() {
  const router = useRouter();
  const { token } = router.query;
  const [message, setMessage] = useState("Vérification en cours...");

  useEffect(() => {
    if (token) {
      axios
        .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/confirm-email`, { token })
        .then(() => {
          setMessage("Email confirmé avec succès !");
        })
        .catch(() => {
          setMessage("Erreur lors de la confirmation de l'email.");
        });
    }
  }, [token]);

  return <div>{message}</div>;
}