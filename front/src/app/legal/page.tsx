"use client";

export default function Legal() {
  return (
    <div className="max-w-screen-xl m-auto p-6">
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl text-left pb-12">
        Mentions légales
      </h1>
      <div className="space-y-6 text-gray-800 leading-relaxed">

        <p>
          Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004
          pour la confiance dans l'économie numérique, il est précisé aux utilisateurs
          du site ReadMeMore l'identité des différents intervenants dans le cadre de sa réalisation
          et de son suivi.
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
          Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">https://vercel.com</a>
        </p>
        <p>
          Le backend et la base de données sont hébergés par :
          <br />
          <strong>Render</strong>, Render Services, Inc., 149 New Montgomery St, 4th Floor, San Francisco, CA 94105, États-Unis.
          <br />
          Site web : <a href="https://render.com" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">https://render.com</a>
        </p>

        <h2 className="font-bold text-lg">Directeur de la publication</h2>
        <p>
          Le directeur de la publication est : <strong>DEHAS Hizia</strong>.
        </p>

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
          <li>Par email : <a href="mailto:hiziadehas@gmail.com" className="underline text-blue-600">hiziadehas@gmail.com</a></li>
          <li>Par courrier : (adresse à compléter si nécessaire)</li>
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

        <p className="mt-6 text-sm text-gray-600">
          Mentions légales mises à jour pour ReadMeMore – site personnel réalisé par DEHAS Hizia.
        </p>
      </div>
    </div>
  );
}