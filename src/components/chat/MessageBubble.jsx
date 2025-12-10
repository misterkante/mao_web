import React from 'react';
import defaultImage from '../../assets/default_image.jpeg';

const MessageBubble = ({ message, artwork, introAudioControls }) => {
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
        <div
          className={`rounded-2xl p-3 ${
            isBot ? "bg-gray-100" : "bg-orange-500 text-white"
          }`}
        >
          {message.type === "text" && (
            <div>
              <p className={`text-sm ${isBot ? "text-gray-800" : "text-white"}`}>
                {message.text}
              </p>
            </div>
          )}

          {message.type === "audio" && (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={introAudioControls?.onToggle}
                  className="w-9 h-9 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-colors"
                  aria-label={introAudioControls?.isPlaying ? "Pause" : "Lecture"}
                >
                  {introAudioControls?.isPlaying ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M4 3h2v10H4zm6 0h2v10h-2z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M4 3l9 5-9 5V3z" />
                    </svg>
                  )}
                </button>

                <div className="flex items-end gap-1 h-10 flex-1">
                  {(introAudioControls?.bars || []).map((height, index) => (
                    <span
                      key={index}
                      className="w-1 bg-orange-400 rounded-full transition-all duration-150"
                      style={{ height: `${height}%`, minHeight: "10px", maxHeight: "40px" }}
                    />
                  ))}
                </div>

                <button
                  onClick={introAudioControls?.onReplay}
                  className="text-xs font-semibold text-orange-600 hover:text-orange-700"
                >
                  Réécouter
                </button>
              </div>
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
