"use client";

export default function Legal() {
  return (
    <div className='max-w-screen-xl m-auto p-6'>
      <h1 className='mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl text-left pb-12'>
        Mentions légales
      </h1>
      <div>
        Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004 pour la confiance en l'économie numérique, il est précisé aux utilisateurs du site ReadMeMore l'identité des différents intervenants dans le cadre de sa réalisation et de son suivi.
        
        <h2 className='font-bold text-lg py-4'>Édition du site</h2>
        Le présent site, accessible à l’URL [ajoute ici ton URL] (le « Site »), est édité par :
        <br />
        DEHAS Hizia, en qualité de développeur.
        
        <h2 className='font-bold text-lg py-4'>Hébergement</h2>
        Le Site est hébergé par [nom de ton hébergeur], situé à [adresse de l’hébergeur]. 
        <br />
        Contact : [email ou téléphone de l’hébergeur].

        <h2 className='font-bold text-lg py-4'>Directeur de publication</h2>
        Le Directeur de la publication du Site est : DEHAS Hizia.

        <h2 className='font-bold text-lg py-4'>Propriété intellectuelle</h2>
        Tous les contenus présents sur le Site, y compris les textes, images, graphismes, logos, vidéos et icônes, sont la propriété exclusive de [ton nom ou ReadMeMore], sauf indication contraire.
        <br />
        Les images utilisées sont, en partie, issues de Unsplash, et respectent leurs conditions d'utilisation.

        <h2 className='font-bold text-lg py-4'>Nous contacter</h2>
        Vous pouvez nous contacter :
        <ul className='list-disc ml-5'>
          <li>Par email : hiziadehas@gmail.com</li>
          <li>Par courrier : </li>
        </ul>

        <h2 className='font-bold text-lg py-4'>Données personnelles</h2>
        Le traitement de vos données à caractère personnel est régi par notre Politique de Confidentialité, disponible depuis la section "Politique de Confidentialité", conformément au Règlement Général sur la Protection des Données 2016/679 du 27 avril 2016 (« RGPD »).
        <br />
        Les données collectées sont utilisées uniquement dans le cadre de la gestion des comptes utilisateurs, l'amélioration de l'application, etc..

        <p className='mt-6 text-sm text-gray-600'>
          Génération des mentions légales adaptée pour ReadMeMore.
        </p>
      </div>
    </div>
  );
}

