"use client";

import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react"; // Importer uniquement pour le typage
import axios from "axios";
import Link from "next/link";
import { UserIcon, BookOpenIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { FaArrowAltCircleRight, FaQrcode } from "react-icons/fa";
import {

  InformationCircleIcon,
 
} from "@heroicons/react/24/solid";
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { FaBars, FaTimes } from "react-icons/fa";


export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/csrf-token`, {
          withCredentials: true,
        });
        setCsrfToken(response.data.csrfToken);
      } catch (err) {
        console.error("Erreur lors de la récupération du token CSRF", err);
        setResponseMessage("Erreur lors de la récupération du token CSRF.");
      }
    };

    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      fetchCsrfToken();
    } else {
      setIsAuthenticated(false);
    }
  }, [API_BASE_URL]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setResponseMessage("Veuillez vous connecter pour envoyer un message.");
      setIsSubmitting(false);
      return;
    }

    if (!csrfToken) {
      setResponseMessage("Erreur de CSRF. Veuillez réessayer.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        setResponseMessage("Votre message a été envoyé avec succès !");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setResponseMessage(data.error || "Une erreur est survenue.");
      }
    } catch (error) {
      setResponseMessage("Erreur réseau. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    
    <div className="min-h-screen flex items-center justify-center  pb-16">
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
                search
              </Link>
            </li>
            <li>
              <Link href="/my-library" onClick={() => setIsMenuOpen(false)}>
                My Library
              </Link>
            </li>
            <li>
              <Link href="/information" onClick={() => setIsMenuOpen(false)}>
                About
              </Link>
            </li>
            <li>
                <Link href="/loan-requests" onClick={() => setIsMenuOpen(false)}> {/* Lien vers la page des demandes de prêt */}
                  Loan Requests
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

      
      {/* Header Icons */}
     
  <div className={`absolute top-0 right-0 p-4 ${isMenuOpen ? 'hidden' : ''} sm:flex`}>
        <Link href="/profile">
          <UserIcon className="w-8 h-8 text-gray-700 cursor-pointer hover:text-white transition duration-300" />
        </Link>
        <Link href="/search">
          <MagnifyingGlassIcon className="w-8 h-8 text-gray-700 cursor-pointer  hover:text-white transition duration-300" />
        </Link>
        <Link href="/my-library">
          <BookOpenIcon className="w-8 h-8 text-gray-700 cursor-pointer hover:text-white transition duration-300" />
        </Link>
        <Link href="/information">
          <InformationCircleIcon className="w-8 h-8 text-gray-700 cursor-pointer hover:text-white transition duration-300" />
        </Link>
       
      {/* Icône de prêt */}
      <Link href="/loan-requests">
      <div className="flex items-center space-x-2">
         <UserIcon className="w-6 h-6 text-gray-700 " />
         <BookOpenIcon className="w-6 h-6 text-gray-700  hover:text-white transition duration-300" />
         <UserIcon className="w-6 h-6 text-gray-700 " />
      </div>
        </Link>

        <Link href="/available-books">
          <FaArrowAltCircleRight className="w-8 h-8 text-gray-700 cursor-pointer hover:text-white transition duration-300" />
        </Link>
        {/* Icône de scan */}
      <Link href="/scan">
        <FaQrcode className="w-8 h-8 text-gray-700 cursor-pointer hover:text-white transition duration-300" />
      </Link>
      </div>
      
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Contact Us</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="text-black mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="text-black mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Your e-mail"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="text-black mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Your message"
              rows={4}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-900 text-white rounded-lg hover:bg-indigo-800 disabled:bg-indigo-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>

        {responseMessage && (
          <p className="mt-4 text-center text-sm text-gray-600">
            {responseMessage}
          </p>
        )}
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