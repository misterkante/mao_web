import { useState, useEffect, useRef, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Link, useNavigate } from "react-router-dom";
import CameraIcon from "../assets/icons/CameraIcon";
import { useAuth } from "../hooks/useAuth";

export default function QRCodeScanner() {
  const [scannedData, setScannedData] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const [error, setError] = useState(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const appUrl = (import.meta.env.VITE_APP_URL || "").replace(/\/$/, "");

  const ensureQrElement = () => {
    const element = document.getElementById("qr-reader");
    if (!element) {
      throw new Error("L'élément qr-reader n'a pas été trouvé dans le DOM");
    }
    return element;
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (err) {
        console.error("Erreur lors de l'arrêt du scanner:", err);
      }
    }
  };

  const extractArtworkId = useCallback((value) => {
    try {
      const url = new URL(value);
      const pathParts = url.pathname.split("/").filter(Boolean);
      // Cherche un segment "chat/:id"
      const chatIndex = pathParts.findIndex((part) => part === "chat");
      if (chatIndex !== -1 && pathParts[chatIndex + 1]) {
        return pathParts[chatIndex + 1];
      }
      // Si le domaine ne correspond pas, on ignore
      if (appUrl && !value.startsWith(appUrl)) {
        return null;
      }
    } catch {
      // pas une URL → ignore
    }
    return null;
  }, [appUrl]);

  const handleDecodedResult = useCallback(
    async (decodedText) => {
      setScannedData(decodedText);
      setIsScanning(false);
      await stopScanner();

      // Si admin et QR MAO → rediriger vers la page d'édition de l'œuvre
      if (isAdmin && user) {
        const artworkId = extractArtworkId(decodedText);
        if (artworkId) {
          navigate(`/artworks/${artworkId}/edit`);
        }
      }
    },
    [extractArtworkId, isAdmin, navigate, user]
  );

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch(console.error);
      }
    };
  }, []);

  useEffect(() => {
    if (isScanning && !scannedData) {
      const initScanner = async () => {
        try {
          // Attendre que l'élément soit dans le DOM
          await new Promise((resolve) => setTimeout(resolve, 50));

          ensureQrElement();

          // Créer une instance de Html5Qrcode si elle n'existe pas déjà
          if (!html5QrCodeRef.current) {
            html5QrCodeRef.current = new Html5Qrcode("qr-reader");
          }

          const html5QrCode = html5QrCodeRef.current;

          if (html5QrCode.isScanning) {
            return; // éviter un double démarrage
          }

          // Configuration du scanner
          const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          };

          // Callback de succès
          const qrCodeSuccessCallback = async (decodedText) => {
            console.log("QR Code détecté:", decodedText);
            await handleDecodedResult(decodedText);
          };

          const qrCodeErrorCallback = () => {
            //
          };

          // Démarrer le scanner avec la contrainte 'environment' (caméra arrière)
          await html5QrCode.start(
            { facingMode: "environment" },
            config,
            qrCodeSuccessCallback,
            qrCodeErrorCallback
          );

          console.log("Scanner démarré avec succès");
        } catch (err) {
          console.error("Erreur lors du démarrage du scanner:", err);
          setIsScanning(false);

          const errorMessage = err.toString();
          if (
            errorMessage.includes("NotAllowedError") ||
            errorMessage.includes("Permission denied")
          ) {
            setError(
              "Accès à la caméra refusé. Veuillez autoriser l'accès à la caméra."
            );
          } else if (
            errorMessage.includes("NotFoundError") ||
            errorMessage.includes("NotReadableError")
          ) {
            setError(
              "Aucune caméra détectée ou caméra déjà utilisée par une autre application."
            );
          } else if (errorMessage.includes("OverconstrainedError")) {
            setError(
              "Caméra arrière non disponible. Essayez de redémarrer le scanner."
            );
          } else {
            setError("Erreur : " + errorMessage);
          }
        }
      };

      initScanner();
    }
  }, [handleDecodedResult, isScanning, scannedData]);

  const startScanner = () => {
    setError(null);
    setIsScanning(true);
  };

  const resetScanner = () => {
    setScannedData(null);
    setError(null);
    setIsScanning(true);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoadingFile(true);
    setError(null);

    try {
      await stopScanner();

      ensureQrElement();

      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode("qr-reader");
      }

      const result = await html5QrCodeRef.current.scanFile(file, true);
      const decodedText = typeof result === "string" ? result : result?.text;

      if (decodedText) {
        await handleDecodedResult(decodedText);
      } else {
        throw new Error("Aucun QR code détecté");
      }
    } catch (err) {
      console.error("Erreur lors de la lecture du fichier:", err);
      setError(
        "Impossible de lire ce fichier. Assurez-vous que l'image contient un QR code net."
      );
    } finally {
      setIsLoadingFile(false);
      event.target.value = "";
    }
  };

  // const copyToClipboard = async () => {
  //   try {
  //     await navigator.clipboard.writeText(scannedData);
  //     alert("Copié dans le presse-papiers !");
  //   } catch (err) {
  //     console.error("Erreur de copie:", err);
  //   }
  // };

  return (
    <div className="min-h-screen from-orange-100 to-orange-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            to="/"
            className="flex items-center gap-20 text-orange-600 hover:text-orange-700 font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
            Scanner QR Code
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6">
          {/*<h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
            Scanner QR Code
          </h1>*/}

          {error && (
            <div className="mb-4 p-4 bg-red-50 text-gray-700 rounded-lg">
              <div className="w-max mx-auto">
                <CameraIcon />
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center my-3">
                <span className="text-sm text-center">{error}</span>
                <button
                  onClick={startScanner}
                  className="w-min py-2 px-3 text-red-700 hover:text-red-600 font-semibold rounded"
                >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6 hover:cursor-pointer"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
                </button>
              </div>
            </div>
          )}

          {!isScanning && !scannedData && !error && (
            <div className="mb-6 p-6 bg-orange-50 border-2 border-orange-300 rounded-lg">
              <p className="text-orange-800 mb-4 text-center text-md sm:text-lg">
                Cliquez sur le bouton ci-dessous pour activer la caméra.
              </p>
              <button
                onClick={startScanner}
                className="flex flex-col items-center gap-3 w-full sm:w-max mx-auto py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition shadow-md hover:shadow-lg uppercase"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-40"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z"
                  />
                </svg>
                Démarrer le scanner
              </button>
            </div>
          )}

          <div className="mb-6 p-6 bg-orange-50 border border-dashed border-orange-300 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-orange-900 font-semibold">
                  Importer une image de QR code
                </p>
                <p className="text-sm text-gray-700">
                  Sélectionnez une image depuis votre appareil pour la scanner,
                  pratique sur ordinateur ou si la caméra n'est pas disponible.
                </p>
              </div>
              <label
                htmlFor="qr-upload"
                className="inline-flex items-center gap-2 py-2 px-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg cursor-pointer transition shadow-md hover:shadow-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 9 12 4.5 7.5 9M12 4.5V15"
                  />
                </svg>
                {isLoadingFile ? "Analyse..." : "Choisir une image"}
              </label>
              <input
                id="qr-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
                disabled={isLoadingFile}
              />
            </div>
          </div>

          <div className="mb-6">
            <div
              id="qr-reader"
              ref={scannerRef}
              className={`w-full max-w-md mx-auto rounded-xl overflow-hidden border-4 border-orange-500 shadow-lg ${
                isScanning ? "" : "hidden"
              }`}
            ></div>
            {isScanning && !scannedData && (
              <>
                <p className="text-center text-gray-600 mt-4 text-md">
                  Positionnez le QR code devant la caméra
                </p>
                <button
                  onClick={async () => {
                    await stopScanner();
                    setIsScanning(false);
                  }}
                  className="flex items-center gap-3 mx-auto mt-4 py-2 px-4 bg-red-500 hover:bg-red-400 text-white font-semibold rounded-lg transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 0 1 9 14.437V9.564Z"
                    />
                  </svg>
                  Arrêter le scanner
                </button>
              </>
            )}
          </div>

          {scannedData && (
            <div className="space-y-4">
              <div className="p-6 bg-linear-to-r from-green-100 to-emerald-100 border-2 border-green-400 rounded-lg shadow-md">
                <p className="font-bold text-green-800 mb-3 text-lg flex items-center">
                  <span className="text-2xl mr-2">✓</span> QR Code scanné avec
                  succès !
                </p>
                <div className="bg-white p-4 rounded-lg border border-green-300 shadow-inner">
                  <p className="text-sm text-gray-600 mb-2 font-semibold">
                    Contenu :
                  </p>
                  <p className="font-mono text-sm break-all text-gray-800">
                    {scannedData}
                  </p>
                </div>
              </div>

              {/* Actions selon le type de contenu */}
              <div className="space-y-3">
                {(scannedData.startsWith("http://") ||
                  scannedData.startsWith("https://")) && (
                  <a
                    href={scannedData}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg text-center transition shadow-md hover:shadow-lg"
                  >
                    Ouvrir le lien dans un nouvel onglet
                  </a>
                )}                

                <button
                  onClick={resetScanner}
                  className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition shadow-md hover:shadow-lg"
                >
                Scanner un autre QR Code
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Conseils d'utilisation */}
        <div className="mt-6 p-6 bg-white rounded-lg shadow-lg">
          <h3 className="font-bold text-orange-900 mb-3 text-lg">
            💡 Conseils d'utilisation
          </h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li className="flex items-start">
              <span className="text-orange-600 mr-2">•</span>
              <span>
                Autorisez l'accès à la caméra dans les paramètres du navigateur
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-600 mr-2">•</span>
              <span>Maintenez le QR code stable devant la caméra</span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-600 mr-2">•</span>
              <span>Assurez-vous d'avoir un bon éclairage</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
