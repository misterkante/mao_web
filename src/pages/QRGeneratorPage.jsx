import { useState } from 'react';
import { Link } from 'react-router-dom';
import QrCode from '../components/QRcode';
import { supabase } from '../services/supabase';
import { apiRequest } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const initialForm = { name: '' };
const bucketName = import.meta.env.VITE_QR_BUCKET || 'qr-codes';

export default function QRGeneratorPage() {
  const { session } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [options, setOptions] = useState(null);
  const [qrValue, setQrValue] = useState('');
  const [createdArtwork, setCreatedArtwork] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resetState = () => {
    setForm(initialForm);
    setOptions(null);
    setQrValue('');
    setCreatedArtwork(null);
  };

  const getQrPath = (id) => `artworks/${id}.png`;

  /**
   * Supprime un artwork et son fichier QR code associé
   */
  const deleteArtwork = async (id, token) => {
    // Supprimer l'enregistrement via le backend sécurisé
    await apiRequest(`/artworks/${id}`, { method: 'DELETE', token });

    // Nettoyer le fichier image si possible
    await supabase.storage.from(bucketName).remove([getQrPath(id)]);
  };

  const handleCancel = async () => {
    setError('');
    try {
      if (createdArtwork?.id) {
        await deleteArtwork(createdArtwork.id, session?.access_token);
      }
      resetState();
    } catch (err) {
      setError(`Impossible de supprimer l'œuvre nouvellement créée : ${err.message}`);
    }
  };

  /**
   * Génère un QR code pour une oeuvre
   */
  const handleGenerate = async (event) => {
    event.preventDefault();
    setError('');

    // règles de validation
    const accessToken = session?.access_token;
    if (!accessToken) {
      setError("Authentification requise pour créer un QR code.");
      return;
    }

    const trimmedName = form.name.trim();
    if (!trimmedName) {
      setError('Le nom de l’artwork est obligatoire.');
      return;
    }

    setLoading(true);
    try {
      if (createdArtwork?.id) {
        await deleteArtwork(createdArtwork.id, accessToken);
      }

      const tempQr = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const inserted = await apiRequest('/artworks', {
        method: 'POST',
        token: accessToken,
        body: { name: trimmedName, qr_code: tempQr },
      });

      const appUrl = 'https://mao-web.vercel.app';
      const qrContent = `${appUrl.replace(/\/$/, '')}/chat/${inserted.id}`;

      setCreatedArtwork(inserted);
      setQrValue(qrContent);
      setOptions({
        ecLevel: 'M',
        enableCORS: false,
        size: 300,
        quietZone: 10,
        bgColor: '#FFFFFF',
        fgColor: '#000000',
        logoImage: '',
        logoWidth: 40,
        logoHeight: 40,
        qrStyle: 'squares',
        logoOpacity: '1,320'
      });

      const canvas = await waitForCanvas();
      const blob = await new Promise((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Échec de la génération de l’image'))), 'image/png'),
      );

      const path = getQrPath(inserted.id);
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(path, blob, { upsert: true, contentType: 'image/png' });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicData } = supabase.storage.from(bucketName).getPublicUrl(path);
      const publicUrl = publicData?.publicUrl;

      const updated = await apiRequest(`/artworks/${inserted.id}`, {
        method: 'PATCH',
        token: accessToken,
        body: { qr_code: publicUrl || '' },
      });

      setCreatedArtwork(updated);
    } catch (err) {
      setError(err.message ?? 'Une erreur est survenue lors de la création du QR code.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Télécharge le QR code affiché dans le canvas
   */
  const waitForCanvas = async () => {
    for (let i = 0; i < 10; i += 1) {
      const canvas = document.getElementById('react-qrcode-logo');
      if (canvas) return canvas;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    throw new Error('Impossible de récupérer le canvas du QR code.');
  };

  const downloadCode = () => {
    const canvas = document.getElementById('react-qrcode-logo');
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `${createdArtwork?.name || 'qrcode'}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="min-h-screen  py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
        <Link
            to="/"
            className="flex items-center gap-20 text-orange-600 hover:text-orange-700 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
</svg>
Générer QR Code
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6">

          <p className="text-gray-600 text-center mb-6">
            Saisissez le nom de l'oeuvre. <br /><i>Ce nom pourra être modifié plus tard.</i>
          </p>
          <form className="space-y-4" onSubmit={handleGenerate}>
            <div>
              {/*<label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de l&apos;oeuvre <span className='text-red-500'>*</span>
              </label>*/}
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                disabled={!!qrValue}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-gray-400 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                placeholder="Ex : Sculpture principale"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                {error}
              </div>
            )}

            {!qrValue && (
              <div className="flex justify-between flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg shadow disabled:opacity-60"
                >
                  {loading ? 'Création en cours...' : 'Confirmer'}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading || !createdArtwork}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg shadow disabled:opacity-60"
                >
                  Annuler
                </button>
              </div>
            )}
          </form>

          {createdArtwork && qrValue && (
            <div className="flex justify-center my-6">
              <QrCode url={qrValue} options={options} />
            </div>
          )}

          {qrValue && (
            <button
              type="button"
              onClick={downloadCode}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v2.25a2.25 2.25 0 0 1-2.25 2.25h-10.5A2.25 2.25 0 0 1 4.5 16.5v-2.25m3.75-3 3 3m0 0 3-3m-3 3V3.75"
                />
              </svg>
              Télécharger
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
