"use client";

import { useState } from "react";
import Link from "next/link";
import { FaGithub, FaTwitter, FaLinkedin, FaBars, FaTimes, FaArrowAltCircleRight, FaQrcode } from "react-icons/fa";
import {
  UserIcon,
  BookOpenIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/solid";

export default function PrivacyPolicy() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col justify-between pb-16 text-white bg-black">
      {/* Header Desktop */}
      <div className="hidden sm:flex absolute top-0 right-0 p-4">
        <Link href="/profile">
          <UserIcon className="w-8 h-8 text-white cursor-pointer hover:text-orange-400" />
        </Link>
        <Link href="/search">
          <MagnifyingGlassIcon className="w-8 h-8 text-white cursor-pointer hover:text-orange-400" />
        </Link>
        <Link href="/my-library">
          <BookOpenIcon className="w-8 h-8 text-white cursor-pointer hover:text-orange-400" />
        </Link>
        <Link href="/information">
          <InformationCircleIcon className="w-8 h-8 text-white cursor-pointer hover:text-orange-400" />
        </Link>
        <Link href="/loan-requests">
          <div className="flex items-center space-x-2">
            <UserIcon className="w-6 h-6 text-white" />
            <BookOpenIcon className="w-6 h-6 text-white hover:text-orange-400" />
            <UserIcon className="w-6 h-6 text-white" />
          </div>
        </Link>
        <Link href="/available-books">
          <FaArrowAltCircleRight className="w-8 h-8 text-white hover:text-orange-400" />
        </Link>
        <Link href="/scan">
          <FaQrcode className="w-8 h-8 text-white hover:text-orange-400" />
        </Link>
        <Link href="/contact">
          <ChatBubbleLeftIcon className="w-8 h-8 text-white hover:text-orange-400" />
        </Link>
      </div>

      {/* Hamburger Menu Mobile */}
      <div className="absolute top-4 left-4 md:hidden z-50">
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white p-2 rounded-full bg-gray-800 shadow-lg"
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
        {isMenuOpen && (
          <div className="absolute top-10 left-0 bg-white text-black shadow-lg rounded-lg w-48 p-4 z-50">
            <ul className="space-y-4">
              <li><Link href="/profile" onClick={() => setIsMenuOpen(false)}>Profile</Link></li>
              <li><Link href="/search" onClick={() => setIsMenuOpen(false)}>Search</Link></li>
              <li><Link href="/my-library" onClick={() => setIsMenuOpen(false)}>My Library</Link></li>
              <li><Link href="/information" onClick={() => setIsMenuOpen(false)}>About</Link></li>
              <li><Link href="/loan-requests" onClick={() => setIsMenuOpen(false)}>Loan Requests</Link></li>
              <li><Link href="/available-books" onClick={() => setIsMenuOpen(false)}>Available Books</Link></li>
              <li><Link href="/scan" onClick={() => setIsMenuOpen(false)}>Scan</Link></li>
              <li><Link href="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
            </ul>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-screen-xl m-auto p-6">
        <h1 className="mt-20 text-2xl font-bold tracking-tight sm:text-4xl text-left pb-12">Politique de Confidentialité</h1>
        <div className="space-y-6">
          <p>
            La présente Politique de Confidentialité a pour objectif de vous informer de la manière dont nous
            collectons, utilisons, stockons et protégeons vos données personnelles, conformément à la loi n° 78-17
            du 6 janvier 1978 modifiée, et au Règlement Général sur la Protection des Données (RGPD) n°2016/679.
          </p>

          <h2 className="font-bold text-lg">1. Responsable du traitement</h2>
          <p>
            Le responsable du traitement est : <strong>DEHAS Hizia</strong>, développeuse web indépendante.
            <br />Contact :{" "}
            <a href="mailto:hiziadehas@gmail.com" className="underline text-blue-400">hiziadehas@gmail.com</a>
          </p>

          <h2 className="font-bold text-lg">2. Données collectées</h2>
          <p>Nous collectons les données suivantes :</p>
          <ul className="list-disc ml-5">
            <li>Nom et prénom</li>
            <li>Adresse email</li>
            <li>Identifiants de connexion (mot de passe crypté, etc.)</li>
            <li>Informations liées à l'utilisation du service (livres ajoutés, commentaires, likes, etc.)</li>
          </ul>

          <h2 className="font-bold text-lg">3. Finalités et base légale</h2>
          <ul className="list-disc ml-5">
            <li>Gestion des comptes utilisateurs (base légale : exécution du contrat)</li>
            <li>Amélioration du service (base légale : intérêt légitime)</li>
            <li>Notifications importantes (base légale : intérêt légitime ou consentement)</li>
            <li>Analyse d’usage (base légale : intérêt légitime)</li>
          </ul>

          <h2 className="font-bold text-lg">4. Partage des données</h2>
          <ul className="list-disc ml-5">
            <li>Prestataires techniques (hébergement, emailing)</li>
            <li>Autorités légales si requis</li>
          </ul>

          <h2 className="font-bold text-lg">5. Durée de conservation</h2>
          <p>Les données sont conservées tant que votre compte est actif.</p>

          <h2 className="font-bold text-lg">6. Sécurité</h2>
          <p>Des mesures techniques et organisationnelles sont mises en place pour sécuriser vos données.</p>

          <h2 className="font-bold text-lg">7. Vos droits</h2>
          <ul className="list-disc ml-5">
            <li>Droit d'accès, rectification, effacement</li>
            <li>Droit d’opposition, de limitation, portabilité</li>
            <li>Droit de retirer votre consentement</li>
            <li>Réclamation auprès de la CNIL (www.cnil.fr)</li>
          </ul>
          <p>
            Contact :{" "}
            <a href="mailto:hiziadehas@gmail.com" className="underline text-blue-400">
              hiziadehas@gmail.com
            </a>
          </p>

          <h2 className="font-bold text-lg">8. Modifications</h2>
          <p>Cette politique peut être mise à jour à tout moment. Dernière mise à jour : <strong>5 mai 2025</strong>.</p>

          <p className="mt-6 text-sm text-gray-400">Politique de Confidentialité rédigée pour ReadMeMore.</p>
        </div>
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
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"><FaGithub className="w-6 h-6" /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter className="w-6 h-6" /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin className="w-6 h-6" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}