import React from 'react';
import { useNavigate } from 'react-router-dom';

const InvitationBlock = () => {
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    navigate('/login');
  };

  const handleDownloadApp = () => {
    // Implémenter la redirection vers l'App Store
    console.log('Télécharger l\'app');
  };

  return (
    <div className="flex justify-center my-4">
      <div className="border-2 border-orange-500 rounded-2xl px-6 py-5 bg-[#FFF8F0] max-w-md w-full">
        {/* Header avec icône */}
        <div className="flex items-center mb-3">
          <svg className="w-6 h-6 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <h3 className="text-lg font-bold text-gray-800">
            Pour continuer la conversation...
          </h3>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-800 mb-4">
          Découvre des milliers d'œuvres et discute sans limite avec les artistes IA.
        </p>

        {/* Boutons */}
        <div className="space-y-3">
          {/* Bouton Créer un compte */}
          <button
            onClick={handleCreateAccount}
            className="w-full py-3 px-4 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-md"
          >
            Créer un compte
          </button>

          {/* Bouton Télécharger l'App */}
          <button
            onClick={handleDownloadApp}
            className="w-full py-3 px-4 bg-transparent border-2 border-orange-500 text-orange-500 font-bold rounded-xl hover:bg-orange-50 transition-colors flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Télécharger l'App</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvitationBlock;
