import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UserManagement from '../components/admin/UserManagement';
import PublicationManagement from '../components/admin/PublicationManagement';
import MessageManagement from '../components/admin/MessageManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('publications');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-yellow-400">Administration</h1>
              <p className="text-sm text-gray-300">Bienvenue, {user?.username || user?.email}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Retour au site
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('publications')}
              className={`px-6 py-4 font-semibold transition-colors ${
                activeTab === 'publications'
                  ? 'text-yellow-600 border-b-2 border-yellow-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Gérer les Publications
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-4 font-semibold transition-colors ${
                activeTab === 'users'
                  ? 'text-yellow-600 border-b-2 border-yellow-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Gérer les Utilisateurs
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-6 py-4 font-semibold transition-colors ${
                activeTab === 'messages'
                  ? 'text-yellow-600 border-b-2 border-yellow-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Messages
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'publications' && <PublicationManagement />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'messages' && <MessageManagement />}
      </main>
    </div>
  );
};

export default AdminDashboard;

