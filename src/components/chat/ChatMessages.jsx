import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import InvitationBlock from './InvitationBlock';

const ChatMessages = ({ artwork, messages, setMessages, isAuthenticated }) => {
  const messagesEndRef = useRef(null);
  
  // Mettre à jour le message initial quand l'artwork change
  useEffect(() => {
    if (artwork?.first_message && messages.length > 0 && messages[0]?.sender === 'bot') {
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages];
        if (updatedMessages[0]?.sender === 'bot') {
          updatedMessages[0] = {
            ...updatedMessages[0],
            text: artwork.first_message
          };
        }
        return updatedMessages;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artwork?.first_message]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Compter les messages utilisateur
  const userMessages = messages.filter(msg => msg.sender === 'user');
  const userMessageCount = userMessages.length;
  const hasUserMessages = userMessageCount > 0;
  const shouldShowInvitation = !isAuthenticated && userMessageCount >= 2;

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-white">
      <div className="space-y-4 max-w-4xl mx-auto">
        {messages.map((message, index) => {
          const isFirstBotMessage = message.sender === 'bot' && index === 0;
          
          // Compter les messages utilisateur avant ce message
          const userMessagesBefore = messages.slice(0, index + 1).filter(msg => msg.sender === 'user').length;
          const isSecondUserMessage = message.sender === 'user' && userMessagesBefore === 2;
          
          return (
            <React.Fragment key={message.id}>
              <MessageBubble message={message} artwork={artwork} />
              
              {/* Afficher le bloc de suggestion juste après le premier message du bot, avant toute réponse utilisateur */}
              {isFirstBotMessage && !hasUserMessages && (
                <div className="flex justify-center my-4">
                  <div className="border-2 border-orange-500 rounded-xl px-4 py-3 bg-white">
                    <p className="text-sm text-center text-gray-800 font-medium">
                      Pose-moi une question sur mon histoire, mon quartier ou mon artiste !
                    </p>
                  </div>
                </div>
              )}
              
              {/* Afficher le bloc d'invitation après le 2ème message utilisateur si non connecté */}
              {isSecondUserMessage && shouldShowInvitation && (
                <InvitationBlock />
              )}
            </React.Fragment>
          );
        })}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessages;
