import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card } from '../Card';
import { useAuth } from '../../contexts/AuthContext';

const MessageManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [adminId, setAdminId] = useState(null);

  useEffect(() => {
    fetchUsersWithConversations();
    findAdminId();
  }, []);

  useEffect(() => {
    if (selectedUserId && adminId) {
      fetchConversation(selectedUserId);
      // Polling pour mettre à jour les messages toutes les 3 secondes
      const interval = setInterval(() => {
        fetchConversation(selectedUserId);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedUserId, adminId]);

  const findAdminId = async () => {
    try {
      const response = await axios.get('/api/messages/admin-id');
      if (response.data) {
        setAdminId(response.data);
      }
    } catch (err) {
      console.error('Error finding admin:', err);
      // Fallback pour l'admin: utiliser l'ID de l'utilisateur connecté si c'est un admin
      if (user?.role === 'ADMIN') {
        setAdminId(user.userId);
      }
    }
  };

  const fetchUsersWithConversations = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/messages/admin/users');
      setUsers(response.data);
      if (response.data.length > 0 && !selectedUserId) {
        setSelectedUserId(response.data[0].id);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversation = async (userId) => {
    if (!userId || !adminId) return;
    
    try {
      const response = await axios.get(`/api/messages/admin/conversation/${userId}`);
      setMessages(response.data || []);
      // Marquer les messages comme lus
      const unreadMessages = (response.data || []).filter(
        m => !m.isRead && m.receiverId === adminId
      );
      if (unreadMessages.length > 0) {
        try {
          await axios.put(`/api/messages/user/${adminId}/read-all`);
        } catch (markErr) {
          console.error('Error marking messages as read:', markErr);
        }
      }
    } catch (err) {
      console.error('Error fetching conversation:', err);
      // Si c'est une erreur 404, c'est normal s'il n'y a pas encore de messages
      if (err.response?.status !== 404) {
        setMessages([]);
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !adminId || !selectedUserId) {
      alert('Veuillez remplir tous les champs nécessaires');
      return;
    }

    try {
      setSending(true);
      console.log('📤 Admin sending message:', {
        content: newMessage,
        senderId: adminId,
        receiverId: selectedUserId
      });
      
      const response = await axios.post('/api/messages', {
        content: newMessage.trim(),
        senderId: adminId,
        receiverId: selectedUserId,
      });
      
      console.log('✅ Message sent successfully:', response.data);
      setNewMessage('');
      await fetchConversation(selectedUserId);
    } catch (err) {
      console.error('❌ Error sending message:', err);
      console.error('Error details:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message
      });
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.statusText || 
                          'Erreur lors de l\'envoi du message. Veuillez réessayer.';
      alert(errorMessage);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        <p className="mt-4 text-gray-600">Chargement des conversations...</p>
      </div>
    );
  }

  const selectedUser = users.find(u => u.id === selectedUserId);

  return (
    <div className="space-y-6">
      <div className="flex gap-6 h-[600px]">
        {/* Liste des utilisateurs */}
        <div className="w-1/3 border-r border-gray-200 pr-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Conversations</h2>
          <div className="space-y-2 overflow-y-auto max-h-[550px]">
            {users.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Aucune conversation</p>
            ) : (
              users.map((u) => (
                <Card
                  key={u.id}
                  className={`p-4 transition-colors ${
                    selectedUserId === u.id
                      ? 'bg-yellow-50 border-yellow-500'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center cursor-pointer hover:bg-yellow-200 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Navigating to user profile:', u.id);
                        window.location.href = `/user/${u.id}`;
                      }}
                      title="Voir le profil"
                    >
                      <span className="text-yellow-600 font-semibold">
                        {(u.username || u.email || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p 
                        className="font-semibold text-gray-900 truncate cursor-pointer hover:text-yellow-600 hover:underline transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          console.log('Navigating to user profile:', u.id);
                          window.location.href = `/user/${u.id}`;
                        }}
                        title="Cliquez pour voir le profil"
                      >
                        {u.username || u.email || 'Utilisateur'}
                      </p>
                      <p 
                        className="text-xs text-gray-500 truncate cursor-pointer hover:text-yellow-600 hover:underline transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          console.log('Navigating to user profile:', u.id);
                          window.location.href = `/user/${u.id}`;
                        }}
                        title="Cliquez pour voir le profil"
                      >
                        {u.email}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setSelectedUserId(u.id);
                        }}
                        className="mt-1 text-xs text-blue-600 hover:text-blue-800 underline"
                      >
                        Ouvrir la conversation
                      </button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Zone de conversation */}
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Conversation avec{' '}
                  <span 
                    className="text-yellow-600 hover:text-yellow-700 cursor-pointer underline font-semibold"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Navigating to user profile:', selectedUser.id);
                      window.location.href = `/user/${selectedUser.id}`;
                    }}
                    title="Cliquez pour voir le profil"
                  >
                    {selectedUser.username || selectedUser.email}
                  </span>
                </h3>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                {messages.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    Aucun message. Commencez la conversation !
                  </p>
                ) : (
                  messages.map((message) => {
                    const isAdmin = message.senderId === adminId;
                    const senderId = isAdmin ? adminId : selectedUserId;
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            isAdmin
                              ? 'bg-yellow-500 text-black'
                              : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          <p 
                            className="text-xs font-semibold mb-1 cursor-pointer hover:underline"
                            onClick={() => navigate(`/user/${senderId}`)}
                            title="Voir le profil"
                          >
                            {isAdmin ? (selectedUser?.username || selectedUser?.email || 'Admin') : (selectedUser?.username || selectedUser?.email || 'Utilisateur')}
                          </p>
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {new Date(message.createdAt).toLocaleString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Formulaire d'envoi */}
              <form onSubmit={handleSendMessage} className="border-t border-gray-200 pt-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Tapez votre message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {sending ? 'Envoi...' : 'Envoyer'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Sélectionnez un utilisateur pour commencer</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageManagement;

