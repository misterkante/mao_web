import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/Header';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Données de démo - à remplacer par des appels API réels
  const stats = {
    artworks: 24,
    views: 1847,
    conversations: 523,
    scans: 89
  };

  const recentActivities = [
    {
      id: 1,
      text: 'Nouveau scan sur "Liberté Urbaine"',
      time: 'Il y a 5 min'
    },
    {
      id: 2,
      text: '3 nouvelles conversations',
      time: 'Il y a 12 min'
    },
    {
      id: 3,
      text: 'Œuvre "Rêve Coloré" publiée',
      time: 'Il y a 1h'
    }
  ];

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        
        <div className="mb-6">
          {/* <div className="flex justify-between items-start mb-4"> 
            <div>
              <h1 className="text-3xl font-bold text-gray-800">MAO Admin</h1>
              <p className="text-gray-600 mt-1">Tableau de bord</p>
            </div>
            <button className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>

              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>*/}
          <AppHeader/>
          {/* <div className="h-1 bg-orange-500"></div> */}
        </div>

        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Bonjour MAO</h2>
          <p className="text-gray-600">Voici un aperçu de tes œuvres</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Artworks Card */}
          <div className="bg-white border border-gray-300 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">{stats.artworks}</div>
            <div className="text-gray-600">Œuvres</div>
          </div>

          {/* Views Card */}
          <div className="bg-white border border-gray-300 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">{stats.views.toLocaleString()}</div>
            <div className="text-gray-600">Vues</div>
          </div>

          {/* Conversations Card */}
          <div className="bg-white border border-gray-300 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">{stats.conversations}</div>
            <div className="text-gray-600">Conversations</div>
          </div>

          {/* Scans Card */}
          <div className="bg-white border border-gray-300 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">{stats.scans}</div>
            <div className="text-gray-600">Scans</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => navigate('/scanner')}
            className="py-4 px-6 bg-white border-2 border-orange-500 text-orange-500 font-bold rounded-xl hover:bg-orange-50 transition-colors flex items-center justify-center space-x-2"
          >
            {/*<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>*/}
            <span>Scanner un QR code</span>
          </button>

          <button
            onClick={() => navigate('/generator')}
            className="py-4 px-6 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2 shadow-md"
          >
            {/*<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>*/}
            <span>Générer un QR code</span>
          </button>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Activité Récente</h3>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white border border-gray-300 rounded-xl p-4 flex justify-between items-center"
              >
                <span className="text-gray-800">{activity.text}</span>
                <span className="text-gray-500 text-sm">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
