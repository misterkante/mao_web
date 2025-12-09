import React from 'react';
import defaultImage from '../../assets/default_image.jpeg';

const MessageBubble = ({ message, artwork }) => {
  const isBot = message.sender === 'bot';
  
  // Utiliser l'image de l'artwork si disponible, sinon l'image par défaut
  const avatarImage = artwork?.image || defaultImage;

  // Format timestamp pour les messages utilisateur
  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex ${isBot ? 'justify-start items-start' : 'justify-end'} space-x-2`}>
      {/* Avatar du bot */}
      {isBot && (
        <div className="w-10 h-10 rounded-full shrink-0 mt-1 relative overflow-hidden border-2 border-white shadow-md">
          <img 
            src={avatarImage} 
            alt="Avatar du bot" 
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      )}

      <div className={`max-w-[75%] ${isBot ? '' : 'flex flex-col items-end'}`}>
        <div className={`rounded-2xl p-3 ${
          isBot 
            ? 'bg-gray-100' 
            : 'bg-orange-500 text-white'
        }`}>
          {message.type === 'text' && (
            <div>
              <p className={`text-sm ${isBot ? 'text-gray-800' : 'text-white'}`}>
                {message.text}
              </p>
              
              {/* Bouton audio pour le message du bot */}
              {isBot && message.hasAudioButton && (
                <button className="mt-2 flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-1.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-medium">Réécouter l'accueil</span>
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Timestamp pour les messages utilisateur */}
        {!isBot && message.timestamp && (
          <span className="text-xs text-gray-500 mt-1">{formatTime(message.timestamp)}</span>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
