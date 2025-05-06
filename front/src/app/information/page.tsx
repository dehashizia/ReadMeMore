"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import {  InformationCircleIcon } from "@heroicons/react/24/solid";
import { FaArrowAltCircleRight, FaQrcode } from "react-icons/fa";
import { FaBars, FaTimes } from "react-icons/fa";
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

import { UserIcon } from "@heroicons/react/24/solid";
import { BookOpenIcon, MagnifyingGlassIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/solid";

const Information = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col justify-between pb-16">
      {/* Header Icons */}
      <div className="hidden sm:flex absolute top-0 right-0 p-4">
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
        <Link href="/scan">
          <FaQrcode className="w-8 h-8 text-gray-700 cursor-pointer hover:text-white transition duration-300" />
        </Link>
        <Link href="/contact">
  <ChatBubbleLeftIcon className="w-8 h-8 text-gray-700 cursor-pointer hover:text-white transition duration-300" />
</Link>
      </div>

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
              <li>
                <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
                  Scan
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-extrabold mt-16 mb-6">À propos de ReadMeMore</h1>

        <section className="space-y-4">
          <p>
            <strong>ReadMeMore</strong> est une application dédiée aux passionnés de lecture. 
            Notre mission est de vous aider à organiser votre bibliothèque personnelle, 
            à découvrir de nouveaux livres et à interagir avec une communauté de lecteurs partageant les mêmes passions.
          </p>
          <p>
            Grâce à des fonctionnalités avancées comme la gestion de vos livres, les prêts entre utilisateurs et les commentaires,
            ReadMeMore est votre compagnon idéal pour une expérience de lecture enrichie.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Fonctionnalités principales</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Créer un compte avec confirmation et réinitialisation de mot de passe par email.</li>
            <li>Rechercher des livres dans votre bibliothèque personnelle ou via Google Books.</li>
            <li>Ajouter des livres à votre bibliothèque avec différents statuts : Wishlist, To Read, Read, Favorites.</li>
            <li>Consulter les détails d’un livre, ajouter des commentaires et donner des notes.</li>
            <li>Voir les avis et notes des autres utilisateurs sur les livres.</li>
            <li>Prêter et emprunter des livres en gérant les demandes via l’application.</li>
            <li>Personnaliser votre profil : photo, email, nom d'utilisateur, mot de passe.</li>
            <li>Supprimer votre compte ou vous déconnecter facilement.</li>
            <li>Scanner un ISBN pour ajouter un livre ou le rendre disponible pour un prêt.</li>
            <li>Filtrer les résultats de recherche par catégorie.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Comment utiliser ReadMeMore ?</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li><strong>Inscrivez-vous</strong> et confirmez votre compte via le lien envoyé par email.</li>
            <li><strong>Ajoutez des livres</strong> à votre bibliothèque en les recherchant ou en scannant leur ISBN.</li>
            <li><strong>Organisez vos livres</strong> selon les statuts : Wishlist, Read, To Read ou Favorites.</li>
            <li><strong>Prêtez vos livres</strong> en les rendant disponibles et en gérant les demandes reçues.</li>
            <li><strong>Interagissez</strong> avec la communauté en laissant des commentaires et des notes.</li>
            <li>Explorez les livres disponibles pour un prêt via la page "Available Books".</li>
          </ol>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Liens utiles</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><a href="/legal" className="text-blue-600 hover:underline">Mentions légales</a></li>
            <li><a href="/privacy" className="text-blue-600 hover:underline">Politique de confidentialité</a></li>
            <li><a href="/faq" className="text-blue-600 hover:underline">FAQ</a></li>
            <li><a href="/contact" className="text-blue-600 hover:underline">Contactez-nous</a></li>
          </ul>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-indigo-950 via-orange-900 border-t-yellow-900 text-white py-4 mt-12 w-full fixed bottom-0 left-0">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} ReadMeMore. Tous droits réservés.</p>
          <ul className="flex space-x-6">
            <li><a href="/legal" className="hover:underline">Mentions légales</a></li>
            <li><a href="/privacy" className="hover:underline">Politique de confidentialité</a></li>
          </ul>
          <div className="flex space-x-6">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"><FaGithub className="w-6 h-6 text-white" /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter className="w-6 h-6 text-white" /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin className="w-6 h-6 text-white" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Information;