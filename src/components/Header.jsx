import React, { useState } from 'react';
import { Menu, X, Bell, MapPin, Trophy, User, LogOut, Settings, Mic } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function AppHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  
  const { user, signOut } = useAuth();
  const isAuthenticated = !!user;
  
  const getInitials = (name) => {
    if (!name) return user?.email?.[0]?.toUpperCase() || 'U';
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'ArtLover';
  const avatarUrl = user?.user_metadata?.avatar_url;
  const voiceCredits = 12; // À récupérer depuis votre base de données
  const notifications = 3; // À récupérer depuis votre base de données

  const handleLogout = async () => {
    await signOut();
    setProfileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo avec image */}
          <a href="/" className="flex items-center cursor-pointer">
            <img 
              src="../src/assets/logo-Mao.PNG" 
              alt="MAO Logo" 
              className="h-10 lg:h-14 w-auto object-contain"
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <a href="/" className="text-gray-700 hover:text-orange-500 font-medium transition">
              Accueil
            </a>
            <a href="/explorer" className="text-gray-700 hover:text-orange-500 font-medium transition">
              Explorer
            </a>
            <a href="/quetes" className="text-gray-700 hover:text-orange-500 font-medium transition">
              Quêtes
            </a>
            <a href="/about" className="text-gray-700 hover:text-orange-500 font-medium transition">
              À propos
            </a>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3 lg:gap-4">
            {isAuthenticated ? (
              <>
                {/* Voice Credits - Desktop only */}
                <div className="hidden lg:flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-lg">
                  <Mic className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-semibold text-orange-600">{voiceCredits} min</span>
                </div>

                {/* Notifications */}
                <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
                  <Bell className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600" />
                  {notifications > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                      {notifications}
                    </span>
                  )}
                </button>

                {/* Profile Menu - ORDRE CORRIGÉ: nom PUIS avatar */}
                <div className="relative ml-auto">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg transition"
                  >
                    <span className="hidden lg:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
                      {displayName}
                    </span>
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-9 h-9 lg:w-10 lg:h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-9 h-9 lg:w-10 lg:h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {getInitials(displayName)}
                      </div>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {profileMenuOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setProfileMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                        <div className="px-4 py-3 border-b">
                          <p className="font-semibold text-gray-800">{displayName}</p>
                          <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                        </div>
                        
                        <div className="py-2">
                          <a href="/profile" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition">
                            <User className="w-5 h-5 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">Mon Profil</span>
                          </a>
                          <a href="/settings" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition">
                            <Settings className="w-5 h-5 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">Paramètres</span>
                          </a>
                          <div className="lg:hidden">
                            <a href="/credits" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition">
                              <Mic className="w-5 h-5 text-orange-600" />
                              <span className="text-sm font-medium text-gray-700">Crédits Voix</span>
                              <span className="ml-auto text-sm font-semibold text-orange-600">{voiceCredits} min</span>
                            </a>
                          </div>
                        </div>

                        <div className="border-t pt-2">
                          <button 
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition w-full text-left"
                          >
                            <LogOut className="w-5 h-5 text-red-600" />
                            <span className="text-sm font-medium text-red-600">Se déconnecter</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Not Authenticated */}
                <a 
                  href="/login"
                  className="hidden lg:block text-gray-700 hover:text-orange-500 font-medium transition"
                >
                  Connexion
                </a>
                <a 
                  href="/login"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 lg:px-6 py-2 lg:py-2.5 rounded-lg font-semibold hover:shadow-lg transition"
                >
                  Inscription
                </a>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t py-4 space-y-2">
            <a href="/" className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg font-medium transition">
              Accueil
            </a>
            <a href="/explorer" className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg font-medium transition flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Explorer
            </a>
            <a href="/quetes" className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg font-medium transition flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Quêtes
            </a>
            <a href="/about" className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg font-medium transition">
              À propos
            </a>
            
            {!isAuthenticated && (
              <div className="pt-4 border-t space-y-2">
                <a 
                  href="/login"
                  className="block w-full text-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition border border-gray-300"
                >
                  Connexion
                </a>
                <a 
                  href="/login"
                  className="block w-full text-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-lg font-semibold hover:shadow-lg transition"
                >
                  Inscription
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}