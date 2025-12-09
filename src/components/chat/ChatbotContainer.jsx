import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { getArtworkById } from '../../services/artworks';
import { useAuth } from '../../hooks/useAuth';
import defaultImage from '../../assets/default_image.jpeg';
import logo from '../../assets/logo-Mao1.PNG';
import defaultAudio from '../../assets/hello.mp3';

const ChatbotContainer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showIntro, setShowIntro] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [barHeights, setBarHeights] = useState([30, 55, 40, 65, 35, 50]);
  const audioRef = useRef(null);
  const hasAutoPlayedRef = useRef(false);

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
        
        // Initialiser avec le message du bot
        const defaultMessage = artworkData?.first_message || 
          "Salut ! Je suis Liberté Urbaine et je représente la jeunesse qui refuse le silence. Tu vois mes couleurs rouges et bleues ? Elles symbolisent la passion et la paix qui coexistent dans nos rues.";
        
        setMessages([{
          id: '1',
          text: defaultMessage,
          sender: 'bot',
          timestamp: new Date(),
          type: 'text',
          hasAudioButton: true
        }]);
        
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

  // Prépare l'audio d'introduction (boucle légère pour l'ambiance)
  useEffect(() => {
    if (!artwork) return;

    const src = artwork.audio_url || artwork.audioUrl || artwork.audio || defaultAudio;

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

    if (showIntro && !hasAutoPlayedRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          hasAutoPlayedRef.current = true; // autoplay uniquement 1x
        })
        .catch(() => setIsPlaying(false));
    } else if (!showIntro) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    return () => {
      audioRef.current?.pause();
    };
  }, [artwork, showIntro]);

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

  const handleStartChat = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setShowIntro(false);
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

  if (showIntro) {
    const backgroundImage = artwork.image || defaultImage;
    return (
      <div
        className="min-h-screen w-full relative overflow-hidden text-white"
        style={{
          backgroundImage: backgroundImage
            ? `linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.55) 100%), url(${backgroundImage})`
            : 'linear-gradient(180deg, #1f2937 0%, #111827 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/30" aria-hidden />
        <div className="relative z-10 max-w-md mx-auto px-6 py-10 space-y-8">
          <div className="flex flex-col items-center gap-6 text-center">
            {artwork.qr_code ? (
              <img
                src={logo}
                alt="QR Code de l'œuvre"
                className="w-28 h-32 rounded-3xl shadow-xl border border-white/20 bg-orange-600 p-3"
              />
            ) : (
              <div className="w-28 h-28 rounded-3xl bg-orange-500 flex items-center justify-center text-2xl font-bold shadow-xl">
                QR
              </div>
            )}
            <div className="space-y-2">
              <p className="text-sm font-semibold tracking-wide">
                Bienvenue sur Mao code, vous venez de rencontrer <span className='text-orange-500'> {artwork.name}</span>
              </p>
              {(artwork.latitude || artwork.longitude || artwork.city || artwork.place) && (
                <p className="text-sm text-white/80">
                  {artwork.place || artwork.city || ''} {artwork.place && artwork.city ? '·' : ''}{' '}
                  {artwork.latitude && artwork.longitude
                    ? `${artwork.latitude}, ${artwork.longitude}`
                    : null}
                </p>
              )}
            </div>
          </div>

          <div className="bg-transparent rounded-3xl px-6 shadow-2xl">
            
            <div className="mt-4 flex items-center justify-between gap-3 bg-white/5 rounded-2xl p-3">
              <button
                onClick={togglePlayPause}
                className="w-11 h-11 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center shadow-lg transition-colors"
                aria-label={isPlaying ? 'Mettre en pause' : 'Reprendre l\'audio'}
              >
                {isPlaying ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4 3h2v10H4zm6 0h2v10h-2z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4 3l9 5-9 5V3z" />
                  </svg>
                )}
              </button>

              <div className="flex items-end gap-1 h-11 flex-1 justify-center">
                {barHeights.map((height, index) => (
                  <span
                    key={index}
                    className="w-1 bg-orange-400 rounded-full transition-all duration-150"
                    style={{ height: `${height}%`, minHeight: '12px', maxHeight: '44px' }}
                  />
                ))}
              </div>

              <button
                onClick={handleReplay}
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-orange-400 flex items-center justify-center border border-orange-400/50 transition-colors"
                aria-label="Réécouter l'audio"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a8 8 0 00-7.938 7H0l3 3 3-3H4.062A6 6 0 1110 16a6.003 6.003 0 01-5.657-4H2.05A8 8 0 1010 2z" />
                </svg>
              </button>
            </div>
            <div className='text-center'>
                <h2 className="text-lg font-semibold">{artwork.name}</h2>
                {/* {artwork.location && ( */}
                  <p className="text-sm text-white/70">{artwork.location || 'Zongo, Cotonou'}</p>
                {/* )} */}
              </div>
          </div>

          <div>
          <p className="text-sm leading-relaxed text-white/85 text-center">
              {artwork.description ||
                "Salut ! Je suis Liberté Urbaine et je représente la jeunesse qui refuse le silence. Tu vois mes couleurs rouges et bleues ? Elles symbolisent la passion et la paix qui coexistent dans nos rues."}
            </p>
            <div className="mt-8 text-center text-xs text-white/70">
              Découvre l'histoire de cette œuvre...
            </div>
            <button
              onClick={handleStartChat}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition shadow-lg shadow-orange-500/30"
            >
              Commencer à discuter →
            </button>
          </div>
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
      />
      <ChatInput onSendMessage={handleSendMessage} disabled={isChatBlocked} />
    </div>
  );
};

export default ChatbotContainer;
