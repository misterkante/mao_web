import React, { useState } from 'react';
import { X, Camera, Mail, Lock, User, Check, AlertCircle } from 'lucide-react';

export default function EditProfileModal({ isOpen, onClose, user, onSave }) {
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    currentEmail: user?.email || '',
    newEmail: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [activeTab, setActiveTab] = useState('profile'); // profile, email, password
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const getInitials = (name) => {
    if (!name) return user?.email?.[0]?.toUpperCase() || 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
    setSuccess('');
  };

  const handleSaveProfile = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Logique de sauvegarde du nom
      await onSave({ fullName: formData.fullName });
      setSuccess('Profil mis à jour avec succès !');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = async () => {
    if (!formData.newEmail) {
      setError('Veuillez entrer une nouvelle adresse email');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Logique d'envoi de confirmation par email
      // await updateEmail(formData.newEmail);
      setEmailSent(true);
      setSuccess('Email de confirmation envoyé ! Vérifiez votre boîte de réception.');
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'envoi de la confirmation');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!formData.currentPassword) {
      setError('Veuillez entrer votre mot de passe actuel');
      return;
    }

    if (!formData.newPassword || formData.newPassword.length < 6) {
      setError('Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Logique de changement de mot de passe
      // await updatePassword(formData.currentPassword, formData.newPassword);
      setSuccess('Mot de passe modifié avec succès !');
      setFormData(prev => ({ 
        ...prev, 
        currentPassword: '', 
        newPassword: '', 
        confirmPassword: '' 
      }));
      setTimeout(() => {
        setActiveTab('profile');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-4 lg:p-6 border-b">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800">Modifier le profil</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-gray-50">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition relative ${
              activeTab === 'profile' 
                ? 'text-orange-600 bg-white' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <User className="w-4 h-4 inline mr-2" />
            Profil
            {activeTab === 'profile' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition relative ${
              activeTab === 'email' 
                ? 'text-orange-600 bg-white' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Mail className="w-4 h-4 inline mr-2" />
            Email
            {activeTab === 'email' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition relative ${
              activeTab === 'password' 
                ? 'text-orange-600 bg-white' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Lock className="w-4 h-4 inline mr-2" />
            Mot de passe
            {activeTab === 'password' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600"></div>
            )}
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mx-4 lg:mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mx-4 lg:mx-6 mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center">
                <div className="relative group mb-4">
                  {user?.user_metadata?.avatar_url ? (
                    <img 
                      src={user.user_metadata.avatar_url} 
                      alt="Avatar" 
                      className="w-24 h-24 rounded-full shadow-lg object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                      {getInitials(formData.fullName)}
                    </div>
                  )}
                  <button className="absolute bottom-0 right-0 w-9 h-9 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center border-4 border-white cursor-pointer transition shadow-lg">
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  Cliquez pour changer votre photo de profil
                </p>
              </div>

              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                  placeholder="Votre nom complet"
                />
              </div>

              {/* Current Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email actuel
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.currentEmail}
                    disabled
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-600 cursor-not-allowed"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                      Vérifié
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Pour changer votre email, utilisez l'onglet "Email"
                </p>
              </div>
            </div>
          )}

          {/* Email Tab */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              {!emailSent ? (
                <>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex gap-3">
                      <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900 text-sm mb-1">
                          Changement d'email sécurisé
                        </h4>
                        <p className="text-xs text-blue-700">
                          Pour des raisons de sécurité, vous recevrez un email de confirmation 
                          à votre nouvelle adresse. Vous devrez cliquer sur le lien pour finaliser 
                          le changement.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email actuel
                    </label>
                    <input
                      type="email"
                      value={formData.currentEmail}
                      disabled
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-600 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nouvelle adresse email
                    </label>
                    <input
                      type="email"
                      value={formData.newEmail}
                      onChange={(e) => handleInputChange('newEmail', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                      placeholder="nouvelle@email.com"
                    />
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    Email de confirmation envoyé !
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Nous avons envoyé un email à <strong>{formData.newEmail}</strong>. 
                    Cliquez sur le lien dans l'email pour confirmer le changement.
                  </p>
                  <button
                    onClick={() => setEmailSent(false)}
                    className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                  >
                    Modifier l'adresse email
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex gap-3">
                  <Lock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-900 text-sm mb-1">
                      Sécurité du mot de passe
                    </h4>
                    <p className="text-xs text-amber-700">
                      Votre nouveau mot de passe doit contenir au moins 6 caractères.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 lg:p-6 border-t bg-gray-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
          >
            Annuler
          </button>
          <button
            onClick={() => {
              if (activeTab === 'profile') handleSaveProfile();
              else if (activeTab === 'email' && !emailSent) handleChangeEmail();
              else if (activeTab === 'password') handleChangePassword();
            }}
            disabled={loading || (activeTab === 'email' && emailSent)}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Chargement...' : (
              activeTab === 'profile' ? 'Sauvegarder' : 
              activeTab === 'email' ? 'Envoyer la confirmation' : 
              'Changer le mot de passe'
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}