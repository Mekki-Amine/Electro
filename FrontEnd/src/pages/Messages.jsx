import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '../components/Card';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BackButton } from '../components/BackButton';

const Messages = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [adminId, setAdminId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    findAdminId();
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (adminId && user?.userId) {
      fetchConversation();
      // Polling pour mettre à jour les messages toutes les 3 secondes
      const interval = setInterval(() => {
        fetchConversation();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [adminId, user?.userId]);

  const findAdminId = async () => {
    try {
      console.log('🔍 Looking for admin ID...');
      const response = await axios.get('/api/messages/admin-id');
      console.log('✅ Admin ID found:', response.data);
      if (response.data) {
        setAdminId(response.data);
        setError(null);
      }
    } catch (err) {
      console.error('❌ Error finding admin:', err);
      console.error('Error details:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message
      });
      
      // Fallback: essayer de trouver l'admin via les messages existants
      if (user?.userId) {
        try {
          console.log('🔄 Trying fallback method...');
          const messagesResponse = await axios.get(`/api/messages/user/${user.userId}`);
          console.log('Fallback messages:', messagesResponse.data);
          if (messagesResponse.data && messagesResponse.data.length > 0) {
            // Prendre le premier message et extraire l'admin (sender ou receiver)
            const firstMessage = messagesResponse.data[0];
            if (firstMessage.senderId !== user.userId) {
              console.log('✅ Admin ID found via fallback (sender):', firstMessage.senderId);
              setAdminId(firstMessage.senderId);
              setError(null);
            } else if (firstMessage.receiverId !== user.userId) {
              console.log('✅ Admin ID found via fallback (receiver):', firstMessage.receiverId);
              setAdminId(firstMessage.receiverId);
              setError(null);
            }
          } else {
            setError('Aucun administrateur trouvé. Veuillez contacter le support.');
          }
        } catch (fallbackErr) {
          console.error('❌ Fallback error:', fallbackErr);
          setError('Impossible de trouver l\'administrateur. Veuillez réessayer plus tard.');
        }
      } else {
        setError('Vous devez être connecté pour envoyer des messages.');
      }
    }
  };

  const fetchConversation = async () => {
    if (!adminId || !user?.userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `/api/messages/conversation/${user.userId}/${adminId}`
      );
      setMessages(response.data || []);
      // Marquer les messages comme lus
      const unreadMessages = (response.data || []).filter(
        m => !m.isRead && m.receiverId === user.userId
      );
      if (unreadMessages.length > 0) {
        try {
          await axios.put(`/api/messages/user/${user.userId}/read-all`);
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
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !adminId || !user?.userId) {
      alert('Veuillez remplir tous les champs nécessaires');
      return;
    }

    try {
      setSending(true);
      console.log('📤 Sending message:', {
        content: newMessage,
        senderId: user.userId,
        receiverId: adminId
      });
      
      const response = await axios.post('/api/messages', {
        content: newMessage.trim(),
        senderId: user.userId,
        receiverId: adminId,
      });
      
      console.log('✅ Message sent successfully:', response.data);
      setNewMessage('');
      setError(null);
      await fetchConversation();
    } catch (err) {
      console.error('❌ Error sending message:', err);
      console.error('Error details:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message,
        config: err.config
      });
      
      // Le serveur retourne maintenant le message d'erreur dans le body
      let errorMessage = 'Erreur lors de l\'envoi du message. Veuillez réessayer.';
      
      if (err.response?.data) {
        // Si c'est une string, c'est le message d'erreur
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
        }
      } else if (err.response?.statusText) {
        errorMessage = err.response.statusText;
      }
      
      console.error('Error message from server:', errorMessage);
      alert(errorMessage);
      setError(errorMessage);
    } finally {
      setSending(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading && messages.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            <p className="mt-4 text-gray-600">Chargement des messages...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <BackButton to="/" />
        </div>
        <Card className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Messages avec l'administrateur
          </h1>
          
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <p>{error}</p>
            </div>
          )}
          
          {!adminId && !loading && (
            <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
              <p>Chargement de l'administrateur...</p>
            </div>
          )}

          {/* Messages */}
          <div className="h-96 overflow-y-auto space-y-4 mb-6 pr-2 border-b border-gray-200 pb-4">
            {messages.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Aucun message. Commencez la conversation !
              </p>
            ) : (
              messages.map((message) => {
                const isUser = message.senderId === user.userId;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        isUser
                          ? 'bg-yellow-500 text-black'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
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
          {adminId && (
            <form onSubmit={handleSendMessage}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Tapez votre message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  disabled={sending || !adminId}
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim() || !adminId}
                  className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {sending ? 'Envoi...' : 'Envoyer'}
                </button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Messages;

