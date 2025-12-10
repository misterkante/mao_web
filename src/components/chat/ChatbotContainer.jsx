import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { getArtworkById } from '../../services/artworks';
import { useAuth } from '../../hooks/useAuth';
import defaultAudio from '../../assets/hello.mp3';

const ChatbotContainer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [barHeights, setBarHeights] = useState([30, 55, 40, 65, 35, 50]);
  const audioRef = useRef(null);
  const hasAutoPlayedRef = useRef(false);
  const playTimerRef = useRef(null);

  useEffect(() => {
    const fetchArtwork = async () => {
      if (!id) {
        setError('ID de l\'artwork manquant');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const artworkData = await getArtworkById(id);
        setArtwork(artworkData);

        const defaultMessage =
          artworkData?.first_message ||
          "Salut ! Je suis Liberté Urbaine et je représente la jeunesse qui refuse le silence. Tu vois mes couleurs rouges et bleues ? Elles symbolisent la passion et la paix qui coexistent dans nos rues.";

        const audioSrc =
          artworkData?.audio_url ||
          artworkData?.audioUrl ||
          artworkData?.audio ||
          defaultAudio;

        setMessages([
          {
            id: "intro-audio",
            text: defaultMessage,
            sender: "bot",
            timestamp: new Date(),
            type: "audio",
            audioSrc,
          },
        ]);
        
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement de l\'artwork:', err);
        setError(err.message || 'Erreur lors du chargement de l\'artwork');
      } finally {
        setLoading(false);
      }
    };

    fetchArtwork();
  }, [id]);

  // Prépare l'audio d'introduction
  useEffect(() => {
    if (loading) {
      audioRef.current?.pause();
      setIsPlaying(false);
      if (playTimerRef.current) {
        clearTimeout(playTimerRef.current);
        playTimerRef.current = null;
      }
      return;
    }

    if (error || !artwork || messages.length === 0) return;

    const src =
      messages[0]?.audioSrc ||
      artwork.audio_url ||
      artwork.audioUrl ||
      artwork.audio ||
      defaultAudio;

    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.loop = false;
      audioRef.current.volume = 0.8;
      audioRef.current.onended = () => setIsPlaying(false);
    } else if (audioRef.current.src !== new URL(src, window.location.href).href) {
      audioRef.current.pause();
      audioRef.current.src = src;
      audioRef.current.loop = false;
    }

    if (!hasAutoPlayedRef.current && !playTimerRef.current) {
      playTimerRef.current = setTimeout(() => {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            hasAutoPlayedRef.current = true; // autoplay uniquement 1x
          })
          .catch(() => setIsPlaying(false));
        playTimerRef.current = null;
      }, 500);
    }

    return () => {
      audioRef.current?.pause();
      if (playTimerRef.current) {
        clearTimeout(playTimerRef.current);
        playTimerRef.current = null;
      }
    };
  }, [artwork, messages, loading, error]);

  // Animation simple des barres pour simuler la variation de voix
  useEffect(() => {
    let intervalId;
    if (isPlaying) {
      intervalId = setInterval(() => {
        setBarHeights((prev) =>
          prev.map(() => Math.floor(25 + Math.random() * 55))
        );
      }, 180);
    } else {
      setBarHeights((prev) => prev.map((height) => Math.max(12, height - 20)));
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPlaying]);

  const handleBack = () => {
    navigate(-1);
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
      hasAutoPlayedRef.current = true;
    }
  };

  const handleReplay = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
    hasAutoPlayedRef.current = true;
  };

  // Calculer si le chat est bloqué (après le 2ème message utilisateur si non connecté)
  const userMessages = messages.filter(msg => msg.sender === 'user');
  const userMessageCount = userMessages.length;
  const isChatBlocked = !user && userMessageCount >= 2;

  // Fonction pour ajouter un message utilisateur et générer une réponse du bot
  const handleSendMessage = (text) => {
    if (!text.trim() || isChatBlocked) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    // Ajouter le message utilisateur
    setMessages(prev => [...prev, userMessage]);

    // Ne générer une réponse que si on n'a pas atteint la limite (2 messages utilisateur si non connecté)
    const newUserMessageCount = userMessageCount + 1;
    if (user || newUserMessageCount < 2) {
      // Générer une réponse du bot (statique pour le moment)
      setTimeout(() => {
        const botResponses = [
          "C'est une excellente question ! Mon histoire est riche et complexe, comme celle de ce quartier.",
          "Je suis ravi que tu t'intéresses à mon œuvre. Chaque détail a une signification profonde.",
          "Merci pour ta curiosité ! L'art urbain raconte toujours une histoire unique.",
          "C'est fascinant que tu poses cette question. Laisse-moi te partager quelque chose d'intéressant à ce sujet."
        ];
        
        const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
        
        const botMessage = {
          id: `bot-${Date.now()}`,
          text: randomResponse,
          sender: 'bot',
          timestamp: new Date(),
          type: 'text'
        };

        setMessages(prev => [...prev, botMessage]);
      }, 1000); // Délai de 1 seconde pour simuler une réponse
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de l'oeuvre...</p>
        </div>
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Artwork introuvable'}</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-white overflow-hidden">
      <ChatHeader 
        onBack={handleBack} 
        artwork={artwork}
      />
      <ChatMessages 
        artwork={artwork}
        messages={messages}
        setMessages={setMessages}
        isAuthenticated={!!user}
        introAudioControls={{
          isPlaying,
          onToggle: togglePlayPause,
          onReplay: handleReplay,
          bars: barHeights,
        }}
      />
      <ChatInput onSendMessage={handleSendMessage} disabled={isChatBlocked} />
    </div>
  );
};

export default ChatbotContainer;
