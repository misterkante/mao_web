import React from 'react';

const ChatActions = () => {
  const suggestions = [
    'Mon histoire',
    'Mon quartier',
    'Mon artiste'
  ];

  return (
    <div className="px-4 py-2 border-t border-gray-100">
      <p className="text-xs text-gray-500 mb-2 font-medium">Pose-moi une question sur</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="px-3 py-1.5 text-sm rounded-full border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatActions;
