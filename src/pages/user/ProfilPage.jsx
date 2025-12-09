import React, { useState } from 'react';
import { Camera, Image, MessageCircle, MapPin, Trophy, User, LogOut, Settings, Mic, HelpCircle, Info, Clock } from 'lucide-react';
import EditProfileModal from '../EditProfileModal';
import { useAuth } from '../../hooks/useAuth';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fonction pour obtenir les initiales
  const getInitials = (name) => {
    if (!name) return user?.email?.[0]?.toUpperCase() || 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'ArtLover';
  const avatarUrl = user?.user_metadata?.avatar_url;
  const voiceCredits = 12;

  const handleSaveProfile = async (data) => {
    // Logique de sauvegarde avec Supabase
    console.log('Saving profile:', data);
    // Ici vous mettrez votre logique de mise à jour Supabase
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
        {/* Titre Mobile */}
        <h1 className="lg:hidden text-center text-2xl font-bold mb-6">Profil</h1>

        {/* Layout Desktop: Sidebar + Content */}
        <div className="lg:grid lg:grid-cols-[340px_1fr] lg:gap-6">
          {/* LEFT SIDEBAR - Desktop */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8">
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative group mb-4">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt="Avatar" 
                      className="w-24 h-24 lg:w-28 lg:h-28 rounded-full shadow-lg object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-3xl lg:text-4xl font-bold shadow-lg">
                      {getInitials(displayName)}
                    </div>
                  )}
                  <button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="absolute bottom-0 right-0 w-9 h-9 lg:w-10 lg:h-10 bg-blue-500 rounded-full flex items-center justify-center border-4 border-white cursor-pointer hover:bg-blue-600 transition shadow-lg"
                  >
                    <Camera className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                  </button>
                </div>
                
                {/* Nom et Email */}
                <h2 className="text-xl lg:text-2xl font-bold mb-1">{displayName}</h2>
                <p className="text-gray-600 text-sm mb-2">{user?.email}</p>
                <p className="text-xs text-gray-500 mb-4">Membre depuis Janvier 2024</p>
                
                {/* Boutons */}
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="w-full bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition mb-3"
                >
                  Modifier le profil
                </button>
                <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition">
                  Passer à Premium
                </button>
              </div>
            </div>

            {/* Voice Credits - Desktop Sidebar */}
            <div className="hidden lg:block bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Crédits Voix</h3>
                  <p className="text-xs text-gray-600">Minutes restantes</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-2xl font-bold text-orange-600">{voiceCredits} min</span>
                  <span className="text-sm text-gray-500">/ 30 min</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full" style={{width: '40%'}}></div>
                </div>
              </div>
              <button className="w-full bg-white border-2 border-orange-500 text-orange-600 py-2.5 rounded-lg font-semibold hover:bg-orange-50 transition">
                Acheter des crédits
              </button>
            </div>
          </div>

          {/* RIGHT CONTENT - Desktop */}
          <div className="space-y-6 mt-6 lg:mt-0">
            {/* Stats Cards - Mobile uniquement */}
            <div className="lg:hidden grid grid-cols-3 gap-3 mb-6">
              <StatCard icon={<Image />} value="42" label="Œuvres" />
              <StatCard icon={<MessageCircle />} value="126" label="Messages" />
              <StatCard icon={<MapPin />} value="8" label="Quartiers" />
            </div>

            {/* Stats Row - Desktop */}
            <div className="hidden lg:grid lg:grid-cols-4 gap-4">
              <StatCardDesktop icon={<Image />} value="42" label="Œuvres découvertes" />
              <StatCardDesktop icon={<MessageCircle />} value="126" label="Messages envoyés" />
              <StatCardDesktop icon={<MapPin />} value="8" label="Quartiers visités" />
              <StatCardDesktop icon={<Trophy />} value="5/12" label="Quêtes complétées" />
            </div>

            {/* Œuvres Récentes - Desktop */}
            <div className="hidden lg:block bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Œuvres Récentes</h3>
                <button className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
                  Voir tout
                  <span>›</span>
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <ArtworkCard 
                  title="Liberté Urbaine" 
                  location="Zongo, Cotonou"
                  imageUrl="https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400&h=400&fit=crop"
                />
                <ArtworkCard 
                  title="Espoir Digital" 
                  location="Akpakpa, Cotonou"
                  imageUrl="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop"
                />
                <ArtworkCard 
                  title="Rythme Africain" 
                  location="Ganhi, Cotonou"
                  imageUrl="https://images.unsplash.com/photo-1582561833649-b5c1ffaee85e?w=400&h=400&fit=crop"
                />
                <ArtworkCard 
                  title="Renaissance" 
                  location="Haie Vive, Cotonou"
                  imageUrl="https://images.unsplash.com/photo-1549887534-1541e9326642?w=400&h=400&fit=crop"
                />
              </div>
            </div>

            {/* Voice Credits - Mobile */}
            <div className="lg:hidden bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Mic className="w-5 h-5 text-orange-500" />
                Crédits Vocaux
              </h3>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 border border-orange-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                    <Mic className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-base">{voiceCredits} minutes</div>
                    <div className="text-sm text-gray-600">sur 30 minutes</div>
                  </div>
                </div>
                <div className="w-full bg-orange-200 rounded-full h-3 mb-4 shadow-inner">
                  <div className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 rounded-full shadow-sm" style={{width: '40%'}}></div>
                </div>
                <button className="w-full bg-white border-2 border-orange-500 text-orange-600 py-3 rounded-xl font-bold hover:bg-orange-50 transition">
                  Acheter 1h de voix - 6€
                </button>
              </div>
            </div>

            {/* Mon Activité & Paramètres - Desktop Grid */}
            <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
              {/* Mon Activité */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-bold text-lg mb-4">Mon Activité</h3>
                <div className="space-y-1">
                  <MenuItem icon={<Image />} text="Œuvres scannées" />
                  <MenuItem icon={<MessageCircle />} text="Historique des chats" />
                  <MenuItem icon={<Trophy />} text="Mes quêtes" />
                </div>
              </div>

              {/* Paramètres */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-bold text-lg mb-4">Paramètres</h3>
                <div className="space-y-1">
                  <MenuItem icon={<Settings />} text="Paramètres du compte" />
                  <MenuItem icon={<HelpCircle />} text="Aide & Support" />
                  <MenuItem icon={<Info />} text="À propos de MAO" />
                  <MenuItemLogout icon={<LogOut />} text="Se déconnecter" onClick={handleLogout} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Espace pour la bottom nav mobile */}
        <div className="h-20 lg:hidden"></div>
      </main>

      {/* Modal d'édition */}
      <EditProfileModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onSave={handleSaveProfile}
      />
    </div>
  );
}

function StatCard({ icon, value, label }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 text-center">
      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mx-auto mb-2">
        {React.cloneElement(icon, { className: "w-5 h-5" })}
      </div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <div className="text-xs text-gray-600">{label}</div>
    </div>
  );
}

function StatCardDesktop({ icon, value, label }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition group cursor-pointer">
      <div className="w-12 h-12 bg-gray-100 group-hover:bg-orange-100 rounded-full flex items-center justify-center text-gray-600 group-hover:text-orange-600 mb-3 transition">
        {React.cloneElement(icon, { className: "w-6 h-6" })}
      </div>
      <div className="text-3xl font-bold text-gray-800 mb-1">{value}</div>
      <div className="text-xs text-gray-600">{label}</div>
    </div>
  );
}

function ArtworkCard({ title, location, imageUrl }) {
  return (
    <div className="group relative rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition aspect-square">
      <img 
        src={imageUrl} 
        alt={title}
        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h4 className="font-semibold text-sm mb-1">{title}</h4>
        <p className="text-xs opacity-90">{location}</p>
      </div>
    </div>
  );
}

function MenuItem({ icon, text, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-orange-50 transition group"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-gray-100 group-hover:bg-orange-100 rounded-lg flex items-center justify-center text-gray-600 group-hover:text-orange-600 transition">
          {React.cloneElement(icon, { className: "w-5 h-5" })}
        </div>
        <span className="font-medium text-gray-800 text-sm">{text}</span>
      </div>
      <span className="text-gray-400 group-hover:text-orange-500 text-xl transition">›</span>
    </button>
  );
}

function MenuItemLogout({ icon, text, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-red-50 transition group"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
          {React.cloneElement(icon, { className: "w-5 h-5" })}
        </div>
        <span className="font-medium text-red-600 text-sm">{text}</span>
      </div>
      <span className="text-red-400 text-xl">›</span>
    </button>
  );
}
