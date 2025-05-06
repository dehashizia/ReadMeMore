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

export default function Legal() {
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
        <h1 className="mt-20 text-2xl font-bold tracking-tight sm:text-4xl text-left pb-12">Mentions légales</h1>
        <div className="space-y-6">
          <p>
            Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie
            numérique, il est précisé aux utilisateurs du site ReadMeMore l'identité des différents intervenants dans
            le cadre de sa réalisation et de son suivi.
          </p>
          <h2 className="font-bold text-lg">Édition du site</h2>
          <p>
            Le site <strong>https://read-me-blush.vercel.app/</strong> est édité par :
            <br />
            <strong>DEHAS Hizia</strong>, développeuse web indépendante.
          </p>

          <h2 className="font-bold text-lg">Hébergement</h2>
          <p>
            Le site est hébergé par :
            <br />
            <strong>Vercel Inc.</strong>, 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.
            <br />
            Site web :{" "}
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-400"
            >
              https://vercel.com
            </a>
          </p>
          <p>
            Le backend et la base de données sont hébergés par :
            <br />
            <strong>Render</strong>, Render Services, Inc., 149 New Montgomery St, 4th Floor, San Francisco, CA 94105, États-Unis.
            <br />
            Site web :{" "}
            <a
              href="https://render.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-400"
            >
              https://render.com
            </a>
          </p>

          <h2 className="font-bold text-lg">Directeur de publication</h2>
          <p>Le Directeur de la publication du Site est : DEHAS Hizia.</p>

          <h2 className="font-bold text-lg">Propriété intellectuelle</h2>
          <p>
            L’ensemble des contenus présents sur le site (textes, images, graphismes, logos, vidéos, icônes, etc.)
            sont la propriété exclusive de <strong>ReadMeMore</strong> ou de ses partenaires, sauf mention contraire.
          </p>
          <p>
            Certaines images sont issues de la plateforme <strong>Unsplash</strong> et respectent leurs conditions d’utilisation.
          </p>

          <h2 className="font-bold text-lg">Nous contacter</h2>
          <ul className="list-disc ml-5">
            <li>
              Par email :{" "}
              <a href="mailto:hiziadehas@gmail.com" className="underline text-blue-400">
                hiziadehas@gmail.com
              </a>
            </li>
          </ul>

          <h2 className="font-bold text-lg">Données personnelles</h2>
          <p>
            Le traitement de vos données personnelles est régi par notre Politique de Confidentialité,
            accessible depuis le lien "Politique de Confidentialité", conformément au Règlement Général
            sur la Protection des Données (RGPD) n° 2016/679 du 27 avril 2016.
          </p>
          <p>
            Les données collectées sont utilisées uniquement pour la gestion des comptes utilisateurs,
            l’amélioration de l’application, et ne sont en aucun cas revendues à des tiers.
          </p>

          <p className="mt-6 text-sm text-gray-400">
            Mentions légales mises à jour pour ReadMeMore – site personnel réalisé par DEHAS Hizia.
          </p>
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