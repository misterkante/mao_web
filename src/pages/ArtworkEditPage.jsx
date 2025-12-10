import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getArtworkById, updateArtwork } from "../services/artworks";
import { useAuth } from "../hooks/useAuth";

const selectOptions = {
  place_type: [
    "rue",
    "allée",
    "passage",
    "impasse",
    "cour",
    "parc",
    "façade",
    "mur",
    "pont",
    "gare",
    "transport",
    "bar",
    "café",
    "restaurant",
    "école",
    "université",
    "hôpital",
    "musée",
    "marché",
    "galerie",
    "entrepôt",
    "immeuble",
  ],
  perceived_age: ["enfant", "préado", "ado", "jeune_adulte", "adulte", "senior"],
  perceived_gender: ["féminin", "masculin", "non_binaire", "neutre", "mixte"],
  language_register: ["très_familier", "familier", "standard", "formel", "très_formel"],
  base_mood: [
    "joyeux",
    "énergique",
    "mélancolique",
    "pensive",
    "chill",
    "mystérieux",
    "sombre",
    "léger",
    "ludique",
    "solennel",
  ],
  voice_timbre: [
    "très_grave",
    "grave",
    "médium_grave",
    "médium",
    "médium_aigu",
    "aigu",
    "très_aigu",
  ],
  voice_texture: [
    "claire",
    "douce",
    "rauque",
    "métallique",
    "creuse",
    "profonde",
    "cristalline",
    "veloutée",
  ],
  voice_accent: [
    "FR_parisien",
    "FR_régional",
    "FR_standard",
    "français_ouest",
    "français_sud",
    "beninois",
    "ivoirien",
    "camerounais",
    "congolais",
    "sénégalais",
    "neutre",
    "anglophone",
  ],
  voice_speed: ["très_lent", "lent", "modéré", "normal", "rapide", "très_rapide"],
  sentence_style: [
    "direct",
    "conversationnel",
    "poétique",
    "lyrique",
    "punchline",
    "humoristique",
    "pédagogique",
    "narratif",
    "mystagogique",
    "énigmatique",
    "argumentatif",
  ],
  general_tone: [
    "chaleureux",
    "amical",
    "taquin",
    "ironique",
    "rassurant",
    "protecteur",
    "sérieux",
    "grave",
    "contemplatif",
    "introspectif",
    "provocateur",
    "subversif",
    "ludique",
    "cynique",
  ],
};

const emptyArtwork = {
  name: "",
  description: "",
  image: "",
  longitude: "",
  latitude: "",
  time: "",
  date: "",
  first_message: "",
  nearby_artworks: "",
  place_type: "",
  perceived_age: "",
  perceived_gender: "",
  language_register: "",
  base_mood: "",
  voice_timbre: "",
  voice_texture: "",
  voice_accent: "",
  voice_speed: "",
  sentence_style: "",
  general_tone: "",
};

const labelMap = {
  name: "Nom",
  description: "Description",
  image: "Image (URL)",
  longitude: "Longitude",
  latitude: "Latitude",
  time: "Heure (HH:MM)",
  date: "Date (YYYY-MM-DD)",
  first_message: "Premier message",
  nearby_artworks: "Œuvres à proximité (IDs séparés par des virgules)",
  place_type: "Type de lieu",
  perceived_age: "Âge perçu",
  perceived_gender: "Genre perçu",
  language_register: "Niveau de langage",
  base_mood: "Humeur de base",
  voice_timbre: "Timbre de voix",
  voice_texture: "Texture de voix",
  voice_accent: "Accent de voix",
  voice_speed: "Vitesse de voix",
  sentence_style: "Style de phrase",
  general_tone: "Ton général",
};

const SelectField = ({ name, value, onChange, options }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-700">{labelMap[name]}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white"
    >
      <option value="">Non renseigné</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default function ArtworkEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [form, setForm] = useState(emptyArtwork);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const nearbyValue = useMemo(() => {
    if (!form.nearby_artworks) return "";
    if (Array.isArray(form.nearby_artworks)) return form.nearby_artworks.join(", ");
    return form.nearby_artworks;
  }, [form.nearby_artworks]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError("");
        setLoading(true);
        const data = await getArtworkById(id);
        setForm({
          ...emptyArtwork,
          ...data,
          longitude: data.longitude ?? "",
          latitude: data.latitude ?? "",
          time: data.time ?? "",
          date: data.date ?? "",
          nearby_artworks: data.nearby_artworks ?? "",
        });
      } catch (err) {
        setError(err.message || "Impossible de charger l'œuvre.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const payload = {};
      const copy = { ...form, nearby_artworks: nearbyValue };
      const forbiddenKeys = new Set(["id", "created_at", "updated_at", "qr_code"]);

      Object.entries(copy).forEach(([key, value]) => {
        if (forbiddenKeys.has(key)) return;

        if (key === "longitude" || key === "latitude") {
          if (value === "") return;
          const num = Number(value);
          if (!Number.isNaN(num)) payload[key] = num;
          return;
        }

        if (key === "nearby_artworks") {
          const items = (value || "")
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean);
          if (items.length) {
            payload.nearby_artworks = items;
          } else {
            payload.nearby_artworks = [];
          }
          return;
        }

        if (value !== undefined) {
          if (typeof value === "string" && value === "") {
            // pour les selects, on ignore pour ne pas écraser avec vide
            if (selectOptions[key]) return;
          }
          payload[key] = value;
        }
      });

      await updateArtwork(id, payload);
      setSuccess("Enregistré");
    } catch (err) {
      setError(err.message || "Échec de la mise à jour.");
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/admin"
            className="flex items-center gap-3 text-orange-600 hover:text-orange-700 font-medium"
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
          </Link>
          <Link
            to={`/chat/${id}`}
            rel="noreferrer"
            className="flex items-center gap-1 text-gray-600 hover:text-gray-700 text-2xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
</svg>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Fiche œuvre</h1>
            <p className="text-sm text-gray-600">Modifier les informations associées au QR code.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded-lg">
              {success}
            </div>
          )}

          {loading ? (
            <div className="py-12 text-center text-gray-600">Chargement...</div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">
                    {labelMap.name} <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleInput}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">{labelMap.description}</label>
                  <textarea
                    name="description"
                    value={form.description || ""}
                    onChange={handleInput}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">{labelMap.image}</label>
                  <input
                    name="image"
                    value={form.image || ""}
                    onChange={handleInput}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">{labelMap.first_message}</label>
                  <textarea
                    name="first_message"
                    value={form.first_message || ""}
                    onChange={handleInput}
                    rows={2}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">{labelMap.longitude}</label>
                    <input
                      name="longitude"
                      value={form.longitude}
                      onChange={handleInput}
                      type="number"
                      step="0.000001"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">{labelMap.latitude}</label>
                    <input
                      name="latitude"
                      value={form.latitude}
                      onChange={handleInput}
                      type="number"
                      step="0.000001"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">{labelMap.date}</label>
                    <input
                      name="date"
                      value={form.date || ""}
                      onChange={handleInput}
                      type="date"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">{labelMap.time}</label>
                    <input
                      name="time"
                      value={form.time || ""}
                      onChange={handleInput}
                      type="time"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">
                    {labelMap.nearby_artworks}
                  </label>
                  <input
                    name="nearby_artworks"
                    value={nearbyValue}
                    onChange={handleInput}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                    placeholder="id1, id2, id3"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(selectOptions).map(([key, values]) => (
                  <SelectField
                    key={key}
                    name={key}
                    value={form[key] || ""}
                    onChange={handleInput}
                    options={values}
                  />
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg shadow disabled:opacity-60"
                >
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
                <Link
                  to="/admin"
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg shadow"
                >
                  Annuler
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
