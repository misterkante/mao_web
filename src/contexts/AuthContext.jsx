import { createContext, useEffect, useState } from 'react';
import { signOut, supabase } from '../services/supabase';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    // Attribuer un role aux utilisateurs inscrits via Google Oauth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      try {
        const user = session?.user;
        if (user && (!user.user_metadata || !user.user_metadata.role)) {
          await supabase.auth.updateUser({ data: { role: 'user', ...(user.user_metadata || {}) } });
          const refreshed = await supabase.auth.getSession();
          setSession(refreshed.data.session);
          setUser(refreshed.data.session?.user ?? null);
        }
      } catch (err) {
        console.error('Erreur lors de la mise à jour du role par défaut (onAuthStateChange):', err);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fonction pour vérifier si l'utilisateur est admin
  const isAdmin = () => {
    if (!user) return false;
    // Vérifier dans user_metadata ou app_metadata
    const role = user.user_metadata?.role || user.app_metadata?.role;
    return role === 'admin' || role === 'dev';
  };

  const value = {
    user,
    session,
    loading,
    signOut: () => signOut(),
    isAdmin: isAdmin(),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
