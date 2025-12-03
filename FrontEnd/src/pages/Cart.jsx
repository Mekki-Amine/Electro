import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BackButton } from '../components/BackButton';

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });

  useEffect(() => {
    if (user?.userId) {
      fetchCart();
    }
  }, [user]);

  const fetchCart = async () => {
    if (!user?.userId) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.get(`/api/cart/user/${user.userId}`, { headers });
      setCart(response.data);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Erreur lors du chargement du panier');
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (cartItemId) => {
    if (!user?.userId) return;

    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      await axios.delete(`/api/cart/user/${user.userId}/items/${cartItemId}`, { headers });
      fetchCart(); // Recharger le panier
    } catch (err) {
      console.error('Error removing item:', err);
      setError('Erreur lors de la suppression de l\'article');
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (!user?.userId || newQuantity <= 0) return;

    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      await axios.put(
        `/api/cart/user/${user.userId}/items/${cartItemId}`,
        { quantity: newQuantity },
        { headers }
      );
      fetchCart(); // Recharger le panier
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError('Erreur lors de la mise à jour de la quantité');
    }
  };

  const clearCart = async () => {
    if (!user?.userId) return;

    if (!window.confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      await axios.delete(`/api/cart/user/${user.userId}/clear`, { headers });
      fetchCart(); // Recharger le panier
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError('Erreur lors de la suppression du panier');
    }
  };

  const calculateTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => {
      return total + (item.publicationPrice || 0) * (item.quantity || 1);
    }, 0);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessingPayment(true);

    try {
      // Simulation de paiement
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const total = calculateTotal();
      alert(`Paiement de ${total.toFixed(2)} DT effectué avec succès !`);
      
      // Vider le panier après paiement réussi
      await clearCart();
      setShowPaymentModal(false);
      setPaymentInfo({
        cardNumber: "",
        cardHolder: "",
        expiryDate: "",
        cvv: "",
      });
    } catch (err) {
      console.error('Error processing payment:', err);
      alert('Erreur lors du traitement du paiement');
    } finally {
      setProcessingPayment(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">Veuillez vous connecter pour accéder à votre panier.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">Chargement du panier...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-4">
          <BackButton to="/shop" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Mon Panier</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {!cart || !cart.items || cart.items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600 mb-4">Votre panier est vide.</p>
            <button
              onClick={() => navigate('/shop')}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-colors"
            >
              Parcourir le catalogue
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex items-start gap-4">
                  {item.publicationFileUrl && (
                    <img
                      src={`http://localhost:9090${item.publicationFileUrl}`}
                      alt={item.publicationTitle}
                      className="w-24 h-24 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {item.publicationTitle}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {item.publicationDescription}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-700">Quantité:</label>
                        <button
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                          className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="px-3 py-1 bg-gray-100 rounded min-w-[3rem] text-center">
                          {item.quantity || 1}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                          className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {(item.publicationPrice || 0) * (item.quantity || 1)} DT
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.publicationPrice} DT / unité
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="mt-2 text-sm text-red-600 hover:text-red-800"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Résumé</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Articles:</span>
                    <span>{cart.items.length}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Total:</span>
                    <span className="text-xl font-bold text-gray-900">{calculateTotal().toFixed(2)} DT</span>
                  </div>
                </div>
                <button
                  onClick={clearCart}
                  className="w-full mb-3 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
                >
                  Vider le panier
                </button>
                <button
                  className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-colors"
                  onClick={() => setShowPaymentModal(true)}
                >
                  Passer la commande
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Paiement
              </h2>
              <p className="text-gray-600 mb-2">
                Montant total: <span className="font-bold text-yellow-600">{calculateTotal().toFixed(2)} DT</span>
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {cart?.items?.length || 0} article(s) dans votre panier
              </p>
              
              <form onSubmit={handlePayment} className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Numéro de carte
                  </label>
                  <input
                    type="text"
                    value={paymentInfo.cardNumber}
                    onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value.replace(/\D/g, "").slice(0, 16) })}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Titulaire de la carte
                  </label>
                  <input
                    type="text"
                    value={paymentInfo.cardHolder}
                    onChange={(e) => setPaymentInfo({ ...paymentInfo, cardHolder: e.target.value })}
                    placeholder="NOM PRÉNOM"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Date d'expiration
                    </label>
                    <input
                      type="text"
                      value={paymentInfo.expiryDate}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, "");
                        if (value.length >= 2) {
                          value = value.slice(0, 2) + "/" + value.slice(2, 4);
                        }
                        setPaymentInfo({ ...paymentInfo, expiryDate: value });
                      }}
                      placeholder="MM/AA"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      maxLength={5}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={paymentInfo.cvv}
                      onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) })}
                      placeholder="123"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      maxLength={3}
                      required
                    />
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPaymentModal(false);
                      setPaymentInfo({
                        cardNumber: "",
                        cardHolder: "",
                        expiryDate: "",
                        cvv: "",
                      });
                    }}
                    className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={processingPayment}
                    className="flex-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processingPayment ? "Traitement..." : `Payer ${calculateTotal().toFixed(2)} DT`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

