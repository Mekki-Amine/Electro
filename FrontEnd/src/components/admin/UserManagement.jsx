import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card } from '../Card';

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedUsers, setExpandedUsers] = useState(new Set());
  const [copiedPassword, setCopiedPassword] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/users');
      console.log('Users fetched:', response.data);
      // Debug: vérifier si les passwords sont présents
      response.data.forEach(user => {
        console.log(`User ${user.id} password:`, user.password ? 'Present' : 'Missing');
      });
      setUsers(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserDetails = (userId) => {
    const newExpanded = new Set(expandedUsers);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedUsers(newExpanded);
  };

  const copyPassword = async (password, userId) => {
    try {
      await navigator.clipboard.writeText(password);
      setCopiedPassword(userId);
      setTimeout(() => setCopiedPassword(null), 2000);
    } catch (err) {
      console.error('Failed to copy password:', err);
      alert('Erreur lors de la copie du mot de passe');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      await axios.delete(`/api/admin/users/${userId}`);
      setUsers(users.filter((user) => user.id !== userId));
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Erreur lors de la suppression de l\'utilisateur');
    }
  };

  const handleVerifyEmail = async (userId) => {
    try {
      const response = await axios.post(`/api/admin/users/${userId}/verify-email`);
      setUsers(users.map(user => user.id === userId ? response.data : user));
    } catch (err) {
      console.error('Error verifying email:', err);
      alert('Erreur lors de la vérification de l\'email');
    }
  };

  const handleUnverifyEmail = async (userId) => {
    try {
      const response = await axios.post(`/api/admin/users/${userId}/unverify-email`);
      setUsers(users.map(user => user.id === userId ? response.data : user));
    } catch (err) {
      console.error('Error unverifying email:', err);
      alert('Erreur lors de l\'annulation de la vérification de l\'email');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        <p className="mt-4 text-gray-600">Chargement des utilisateurs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchUsers}
          className="mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
        >
          Réessayer
        </button>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Gestion des Utilisateurs</h2>
          <p className="text-gray-600">Total: {users.length} utilisateur(s)</p>
        </div>
        <button
          onClick={fetchUsers}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
        >
          Actualiser
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {users.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-600">Aucun utilisateur trouvé</p>
          </Card>
        ) : (
          users.map((user) => (
            <Card key={user.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {user.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1">
                      <h3 
                        className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-yellow-600 hover:underline transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Navigating to user profile:', user.id);
                          window.location.href = `/user/${user.id}`;
                        }}
                        title="Cliquez pour voir le profil"
                      >
                        {user.username || 'Sans nom'}
                      </h3>
                      <p 
                        className="text-gray-600 cursor-pointer hover:text-yellow-600 hover:underline transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Navigating to user profile:', user.id);
                          window.location.href = `/user/${user.id}`;
                        }}
                        title="Cliquez pour voir le profil"
                      >
                        {user.email}
                      </p>
                      <div className="flex items-center space-x-2 mt-1 flex-wrap">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            user.role === 'ADMIN'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {user.role || 'USER'}
                        </span>
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            user.emailVerified
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {user.emailVerified ? '✓ Email vérifié' : '✗ Email non vérifié'}
                        </span>
                        <span className="text-xs text-gray-500">ID: {user.id}</span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedUsers.has(user.id) && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                      <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1">
                          Mot de passe (Hash BCrypt)
                        </label>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-50 p-3 rounded-lg border border-gray-300">
                            <code className="text-xs text-gray-800 break-all">
                              {user.password || 'Mot de passe non disponible'}
                            </code>
                          </div>
                          <button
                            onClick={() => copyPassword(user.password, user.id)}
                            className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm whitespace-nowrap"
                            title="Copier le mot de passe"
                          >
                            {copiedPassword === user.id ? '✓ Copié' : '📋 Copier'}
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Note: Ceci est un hash BCrypt. Le mot de passe original ne peut pas être récupéré.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2 flex-wrap">
                  <button
                    onClick={() => toggleUserDetails(user.id)}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                  >
                    {expandedUsers.has(user.id) ? 'Masquer' : 'Détails'}
                  </button>
                  {user.emailVerified ? (
                    <button
                      onClick={() => handleUnverifyEmail(user.id)}
                      className="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors text-sm"
                      title="Dé-vérifier l'email"
                    >
                      ✗ Email
                    </button>
                  ) : (
                    <button
                      onClick={() => handleVerifyEmail(user.id)}
                      className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
                      title="Vérifier l'email"
                    >
                      ✓ Email
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default UserManagement;

