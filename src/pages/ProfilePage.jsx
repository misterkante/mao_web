import { useAuth } from '../hooks/useAuth';

export default function ProfilePage() {
  const { user, session } = useAuth();

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Mon Profil</h1>
        
        <div className="space-y-4">
          {user.user_metadata?.avatar_url && (
            <div className="flex justify-center mb-6">
              <img 
                src={user.user_metadata.avatar_url} 
                alt="Avatar" 
                className="w-24 h-24 rounded-full shadow-md"
              />
            </div>
          )}

          <div className="border-b pb-3">
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Nom complet
            </label>
            <p className="text-lg text-gray-800">
              {user.user_metadata?.full_name || 'Non renseigné'}
            </p>
          </div>

          <div className="border-b pb-3">
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Email
            </label>
            <p className="text-lg text-gray-800">{user.email}</p>
          </div>

          <div className="border-b pb-3">
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              ID Utilisateur
            </label>
            <p className="text-sm text-gray-600 font-mono">{user.id}</p>
          </div>

          <div className="border-b pb-3">
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Dernière connexion
            </label>
            <p className="text-sm text-gray-700">
              {new Date(user.last_sign_in_at).toLocaleString('fr-FR')}
            </p>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded">
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Métadonnées complètes
            </label>
            <pre className="text-xs text-gray-700 overflow-x-auto">
              {JSON.stringify(user.user_metadata, null, 2)}
            </pre>
          </div>

          {session && (
            <div className="mt-4 p-4 bg-blue-50 rounded">
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Token d'accès (premiers caractères)
              </label>
              <p className="text-xs font-mono text-gray-700 break-all">
                {session.access_token.substring(0, 50)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
