import React from 'react';
import defaultImage from '../../assets/default_image.jpeg';

const ChatHeader = ({ onBack, artwork }) => {
  // Utiliser l'image de l'artwork si disponible, sinon utiliser l'image par défaut
  const backgroundImage = artwork?.image || defaultImage;
  
  const backgroundStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };

  // Formater la localisation depuis les coordonnées ou utiliser une valeur par défaut
  const getLocation = () => {
    if (artwork?.latitude && artwork?.longitude) {

      return 'Belleville, Paris 20e'; // Valeur par défaut pour l'instant
    }
    return artwork?.description || 'Son emplacement demeure un secret bien gardé';
  };

  return (
    <div className="relative w-11/12 mx-auto mt-4 h-64 overflow-hidden rounded-3xl">
      {/* Image de fond - Mural stylisé ou image de l'artwork */}
      <div 
        className="absolute inset-0"
        style={backgroundStyle}
      >
      </div>

      {/* Overlay sombre pour la lisibilité */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Contenu du header */}
      <div className="relative z-10 h-full flex flex-col p-4">
        {/* Boutons en haut */}
        <div className="flex justify-between items-start mb-auto">
          {/* Bouton retour */}
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
            aria-label="Retour"
          >
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Bouton Activer */}
          <button
            className="px-4 py-2 text-orange-600 bg-gray-100 rounded-lg flex items-center space-x-2 shadow-lg hover:bg-gray-50 transition-colors"
            aria-label="Activer"
          >
            <span className="font-medium text-sm">Activer</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-1.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Titre et localisation */}
        <div className="mt-auto mb-4">
          <h1 className="text-3xl font-bold text-white mb-2">
            {artwork?.name || 'Énergie Urbaine'}
          </h1>
          <div className="flex items-center space-x-1 text-white">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">{getLocation()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
