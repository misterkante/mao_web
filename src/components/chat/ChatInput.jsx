import React, { useState } from 'react';

const ChatInput = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && onSendMessage && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !disabled) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      <div className="flex items-center space-x-2 max-w-4xl mx-auto">
        {/* Champ de texte */}
        <input
          type="text"
          value={message}
          onChange={(e) => !disabled && setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={disabled ? "Connectez-vous pour continuer..." : "Écris ton message..."}
          disabled={disabled}
          className={`flex-1 px-4 py-3 bg-white rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm ${
            disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''
          }`}
        />

        {/* Icône cadenas */}
        <button 
          className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Verrouiller"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </button>

        {/* Bouton d'envoi orange */}
        <button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            disabled || !message.trim()
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg'
          }`}
          aria-label="Envoyer"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
