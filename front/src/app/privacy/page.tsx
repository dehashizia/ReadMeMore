"use client";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-screen-xl m-auto p-6">
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl text-left pb-12">
        Politique de Confidentialité
      </h1>
      <div className="text-gray-800 leading-relaxed space-y-6">
        <p>
          La présente Politique de Confidentialité a pour objectif de vous informer de la manière dont nous
          collectons, utilisons, stockons et protégeons vos données personnelles, conformément à la loi n° 78-17
          du 6 janvier 1978 modifiée, et au Règlement Général sur la Protection des Données (RGPD) n°2016/679.
        </p>

        <h2 className="font-bold text-lg">1. Responsable du traitement</h2>
        <p>
          Le responsable du traitement est : <strong>DEHAS Hizia</strong>, développeuse web indépendante.
          <br />Contact :{" "}
          <a href="mailto:hiziadehas@gmail.com" className="underline text-blue-600">
            hiziadehas@gmail.com
          </a>
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
        <p>Les données sont collectées pour les finalités suivantes :</p>
        <ul className="list-disc ml-5">
          <li>Gestion des comptes utilisateurs (base légale : exécution du contrat)</li>
          <li>Amélioration du service et personnalisation (base légale : intérêt légitime)</li>
          <li>Envoi de notifications importantes (base légale : intérêt légitime ou consentement)</li>
          <li>Analyse d’usage pour optimiser l’application (base légale : intérêt légitime)</li>
        </ul>

        <h2 className="font-bold text-lg">4. Partage des données</h2>
        <p>Vos données ne sont jamais vendues. Elles peuvent être partagées avec :</p>
        <ul className="list-disc ml-5">
          <li>Des prestataires techniques (hébergement, emailing) dans le cadre de contrats de sous-traitance</li>
          <li>Les autorités si la loi l'exige (ex. ordonnance judiciaire)</li>
        </ul>

        <h2 className="font-bold text-lg">5. Durée de conservation</h2>
        <p>
          Les données sont conservées tant que votre compte est actif. Vous pouvez demander leur suppression à tout moment.
        </p>

        <h2 className="font-bold text-lg">6. Sécurité</h2>
        <p>
          Des mesures techniques et organisationnelles appropriées sont mises en place pour protéger vos données.
          Cependant, aucun système n’étant infaillible, une sécurité absolue ne peut être garantie.
        </p>

        <h2 className="font-bold text-lg">7. Vos droits</h2>
        <p>Conformément au RGPD, vous disposez des droits suivants :</p>
        <ul className="list-disc ml-5">
          <li>Droit d'accès, de rectification, d’effacement</li>
          <li>Droit à la limitation et d’opposition au traitement</li>
          <li>Droit à la portabilité</li>
          <li>Droit de retirer votre consentement à tout moment</li>
          <li>Droit d’introduire une réclamation auprès de la CNIL (www.cnil.fr)</li>
        </ul>
        <p>
          Pour exercer vos droits, contactez-nous à{" "}
          <a href="mailto:hiziadehas@gmail.com" className="underline text-blue-600">
            hiziadehas@gmail.com
          </a>
          .
        </p>

        <h2 className="font-bold text-lg">8. Modifications</h2>
        <p>
          Cette politique pourra être mise à jour à tout moment. Dernière mise à jour : <strong>5 mai 2025</strong>.
        </p>

        <h2 className="font-bold text-lg">9. Contact</h2>
        <ul className="list-disc ml-5">
          <li>Email : hiziadehas@gmail.com</li>
         
        </ul>

        <p className="mt-6 text-sm text-gray-600">
          Politique de Confidentialité rédigée pour l’application ReadMeMore.
        </p>
      </div>
    </div>
  );
}