import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function HomePage() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Rediriger les admins vers le dashboard admin
  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin');
    }
  }, [user, isAdmin, navigate]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          Bienvenue {user ? user.user_metadata?.full_name || user.email : 'sur notre site'} !
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {user 
            ? 'Vous êtes connecté avec succès.' 
            : 'Connectez-vous pour accéder à toutes les fonctionnalités.'}
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            to="/scanner" 
            className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition shadow-md hover:shadow-lg"
          >
            Scanner un QR Code
          </Link>
          
          {user ? (
            <Link 
              to="/profile" 
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition shadow-md hover:shadow-lg"
            >
              Voir mon profil
            </Link>
          ) : (
            <Link 
              to="/login" 
              className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition shadow-md hover:shadow-lg"
            >
              Se connecter
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
