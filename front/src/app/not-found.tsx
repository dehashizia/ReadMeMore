'use client';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-200 text-center p-6">
      <div className="max-w-lg w-full bg-white shadow-xl rounded-lg p-8">
        <h1 className="text-6xl font-bold text-red-600">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mt-4">Page non trouvée</h2>
        <p className="mt-2 text-lg text-gray-600">
          Désolé, la page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <div className="mt-6">
          <a
            href="/"
            className="inline-block px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Retour à la page d'accueil
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;