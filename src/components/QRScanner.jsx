import { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';

export default function QRScanner() {
  const [scannedData, setScannedData] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const [error, setError] = useState(null);

  const handleScan = (result) => {
    if (result && result[0]) {
      const data = result[0].rawValue;
      setScannedData(data);
      setIsScanning(false);
      setError(null);
    }
  };

  const handleError = (err) => {
    console.error('QR Scanner Error:', err);
    setError("Erreur d'accès à la caméra. Veuillez autoriser l'accès à la caméra.");
  };

  const resetScanner = () => {
    setScannedData(null);
    setIsScanning(true);
    setError(null);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Scanner de QR Code
        </h2>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <p className="font-semibold">Erreur</p>
            <p>{error}</p>
          </div>
        )}

        {!scannedData && isScanning && (
          <div className="mb-4">
            <div className="relative w-full aspect-square max-w-md mx-auto overflow-hidden rounded-lg border-4 border-blue-500">
              <Scanner
                onScan={handleScan}
                onError={handleError}
                constraints={{
                  facingMode: 'environment',
                }}
                styles={{
                  container: {
                    width: '100%',
                    height: '100%',
                  },
                }}
              />
            </div>
            <p className="text-center text-gray-600 mt-4">
              Positionnez le QR code devant la caméra
            </p>
          </div>
        )}

        {scannedData && (
          <div className="space-y-4">
            <div className="p-4 bg-green-100 border border-green-400 rounded">
              <p className="font-semibold text-green-800 mb-2">
                ✓ QR Code scanné avec succès !
              </p>
              <div className="bg-white p-3 rounded border border-green-300">
                <p className="text-sm text-gray-600 mb-1">Contenu :</p>
                <p className="font-mono text-sm break-all">{scannedData}</p>
              </div>
            </div>

            {/* Détection du type de contenu */}
            <div className="space-y-2">
              {scannedData.startsWith('http://') || scannedData.startsWith('https://') ? (
                <a
                  href={scannedData}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-center transition"
                >
                  🔗 Ouvrir le lien
                </a>
              ) : scannedData.startsWith('mailto:') ? (
                <a
                  href={scannedData}
                  className="block w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg text-center transition"
                >
                  ✉️ Envoyer un email
                </a>
              ) : scannedData.startsWith('tel:') ? (
                <a
                  href={scannedData}
                  className="block w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg text-center transition"
                >
                  📞 Appeler
                </a>
              ) : null}

              <button
                onClick={() => navigator.clipboard.writeText(scannedData)}
                className="w-full py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition"
              >
                📋 Copier dans le presse-papiers
              </button>

              <button
                onClick={resetScanner}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
              >
                🔄 Scanner un autre QR Code
              </button>
            </div>
          </div>
        )}

        {!isScanning && !scannedData && (
          <div className="text-center">
            <button
              onClick={resetScanner}
              className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              Démarrer le scan
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Conseils</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Assurez-vous que votre caméra est autorisée dans les paramètres du navigateur</li>
          <li>• Maintenez le QR code stable devant la caméra</li>
          <li>• Assurez-vous d'avoir un bon éclairage</li>
          <li>• Le scanner fonctionne avec tous les types de QR codes (URL, texte, etc.)</li>
        </ul>
      </div>
    </div>
  );
}
