import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Link } from 'react-router-dom';

export default function QRCodeScanner() {
  const [scannedData, setScannedData] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  const stopScanner = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (err) {
        console.error('Erreur lors de l\'arrêt du scanner:', err);
      }
    }
  };

  useEffect(() => {
    // Cleanup function
    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch(console.error);
      }
    };
  }, []);

  useEffect(() => {
    // Démarrer le scanner quand isScanning devient true et que l'élément est monté
    if (isScanning && !scannedData) {
      const initScanner = async () => {
        try {
          // Attendre que l'élément soit dans le DOM
          await new Promise(resolve => setTimeout(resolve, 100));

          const element = document.getElementById("qr-reader");
          if (!element) {
            throw new Error("L'élément qr-reader n'a pas été trouvé dans le DOM");
          }

          // Créer une instance de Html5Qrcode si elle n'existe pas déjà
          if (!html5QrCodeRef.current) {
            html5QrCodeRef.current = new Html5Qrcode("qr-reader");
          }

          const html5QrCode = html5QrCodeRef.current;

          // Configuration du scanner
          const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          };

          // Callback de succès
          const qrCodeSuccessCallback = (decodedText) => {
            console.log('QR Code détecté:', decodedText);
            setScannedData(decodedText);
            setIsScanning(false);
            stopScanner();
          };

          // Callback d'erreur (appelé à chaque frame sans QR code, on l'ignore)
          const qrCodeErrorCallback = () => {
            // Ne rien faire, c'est normal de ne pas toujours détecter un QR code
          };

          // Démarrer le scanner avec la contrainte 'environment' (caméra arrière)
          await html5QrCode.start(
            { facingMode: "environment" },
            config,
            qrCodeSuccessCallback,
            qrCodeErrorCallback
          );

          console.log('Scanner démarré avec succès');
        } catch (err) {
          console.error('Erreur lors du démarrage du scanner:', err);
          setIsScanning(false);
          
          const errorMessage = err.toString();
          if (errorMessage.includes('NotAllowedError') || errorMessage.includes('Permission denied')) {
            setError("❌ Accès à la caméra refusé. Cliquez sur l'icône 🔒 dans la barre d'adresse pour autoriser l'accès à la caméra.");
          } else if (errorMessage.includes('NotFoundError') || errorMessage.includes('NotReadableError')) {
            setError("❌ Aucune caméra détectée ou caméra déjà utilisée par une autre application. Fermez les autres applications utilisant la caméra.");
          } else if (errorMessage.includes('OverconstrainedError')) {
            setError("⚠️ Caméra arrière non disponible. Essayez de redémarrer le scanner.");
          } else {
            setError("❌ Erreur : " + errorMessage);
          }
        }
      };

      initScanner();
    }
  }, [isScanning, scannedData]);

  const startScanner = () => {
    setError(null);
    setIsScanning(true);
  };

  const resetScanner = () => {
    setScannedData(null);
    setError(null);
    setIsScanning(true);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(scannedData);
      alert('Copié dans le presse-papiers !');
    } catch (err) {
      console.error('Erreur de copie:', err);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-100 to-blue-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Retour à l'accueil
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
            📷 Scanner de QR Code
          </h1>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <p className="font-semibold">⚠️ Erreur</p>
              <p className="mb-3">{error}</p>
              <button
                onClick={startScanner}
                className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition"
              >
                Réessayer
              </button>
            </div>
          )}

          {!isScanning && !scannedData && !error && (
            <div className="mb-6 p-6 bg-blue-50 border-2 border-blue-300 rounded-lg">
              <h3 className="font-bold text-blue-900 mb-3 text-lg text-center">
                📷 Scanner de QR Code
              </h3>
              <p className="text-blue-800 mb-4 text-center">
                Cliquez sur le bouton ci-dessous pour activer la caméra et scanner un QR code.
              </p>
              <button
                onClick={startScanner}
                className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition shadow-md hover:shadow-lg"
              >
                📷 Démarrer le scanner
              </button>
              <div className="mt-4 p-3 bg-white rounded border border-blue-200">
                <p className="text-sm text-gray-700">
                  <strong>💡 Note :</strong> Vous devrez autoriser l'accès à la caméra dans votre navigateur.
                </p>
              </div>
            </div>
          )}

          {isScanning && !scannedData && (
            <div className="mb-6">
              <div 
                id="qr-reader" 
                ref={scannerRef}
                className="w-full max-w-md mx-auto rounded-xl overflow-hidden border-4 border-purple-500 shadow-lg"
              ></div>
              <p className="text-center text-gray-600 mt-4 text-lg">
                📱 Positionnez le QR code devant la caméra
              </p>
              <button
                onClick={async () => {
                  await stopScanner();
                  setIsScanning(false);
                }}
                className="w-full mt-4 py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition"
              >
                ⏹️ Arrêter le scanner
              </button>
            </div>
          )}

          {scannedData && (
            <div className="space-y-4">
              <div className="p-6 bg-linear-to-r from-green-100 to-emerald-100 border-2 border-green-400 rounded-lg shadow-md">
                <p className="font-bold text-green-800 mb-3 text-lg flex items-center">
                  <span className="text-2xl mr-2">✓</span> QR Code scanné avec succès !
                </p>
                <div className="bg-white p-4 rounded-lg border border-green-300 shadow-inner">
                  <p className="text-sm text-gray-600 mb-2 font-semibold">Contenu :</p>
                  <p className="font-mono text-sm break-all text-gray-800">{scannedData}</p>
                </div>
              </div>

              {/* Actions selon le type de contenu */}
              <div className="space-y-3">
                {(scannedData.startsWith('http://') || scannedData.startsWith('https://')) && (
                  <a
                    href={scannedData}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-center transition shadow-md hover:shadow-lg"
                  >
                    🔗 Ouvrir le lien dans un nouvel onglet
                  </a>
                )}

                {scannedData.startsWith('mailto:') && (
                  <a
                    href={scannedData}
                    className="block w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg text-center transition shadow-md hover:shadow-lg"
                  >
                    ✉️ Envoyer un email
                  </a>
                )}

                {scannedData.startsWith('tel:') && (
                  <a
                    href={scannedData}
                    className="block w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg text-center transition shadow-md hover:shadow-lg"
                  >
                    📞 Appeler ce numéro
                  </a>
                )}

                <button
                  onClick={copyToClipboard}
                  className="w-full py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition shadow-md hover:shadow-lg"
                >
                  📋 Copier dans le presse-papiers
                </button>

                <button
                  onClick={resetScanner}
                  className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition shadow-md hover:shadow-lg"
                >
                  🔄 Scanner un autre QR Code
                </button>
              </div>
            </div>
          )}


        </div>

        {/* Conseils d'utilisation */}
        <div className="mt-6 p-6 bg-white rounded-lg shadow-lg">
          <h3 className="font-bold text-purple-900 mb-3 text-lg">💡 Conseils d'utilisation</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">•</span>
              <span>Autorisez l'accès à la caméra dans les paramètres du navigateur</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">•</span>
              <span>Maintenez le QR code stable devant la caméra</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">•</span>
              <span>Assurez-vous d'avoir un bon éclairage</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">•</span>
              <span>Compatible avec tous les types de QR codes (URL, texte, email, téléphone, etc.)</span>
            </li>
          </ul>
        </div>

        {/* Types de QR codes supportés */}
        <div className="mt-6 p-6 bg-linear-to-r from-blue-50 to-purple-50 rounded-lg border border-purple-200">
          <h3 className="font-bold text-purple-900 mb-3 text-lg">📱 Types de QR codes supportés</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center">
              <span className="text-2xl mr-2">🔗</span>
              <span>URLs / Sites web</span>
            </div>
            <div className="flex items-center">
              <span className="text-2xl mr-2">✉️</span>
              <span>Adresses email</span>
            </div>
            <div className="flex items-center">
              <span className="text-2xl mr-2">📞</span>
              <span>Numéros de téléphone</span>
            </div>
            <div className="flex items-center">
              <span className="text-2xl mr-2">📝</span>
              <span>Texte simple</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
