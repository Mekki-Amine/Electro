import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const RecommendationForm = () => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [userRating, setUserRating] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserRecommendation();
    fetchStats();
  }, [user]);

  const fetchUserRecommendation = async () => {
    if (!user?.userId) return;

    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get(`/api/recommendations/user/${user.userId}`, { headers });
      if (response.data) {
        setUserRating(response.data.rating);
        setRating(response.data.rating);
      }
    } catch (err) {
      // Pas de recommandation existante
      console.log('No existing recommendation');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/recommendations/stats');
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.userId) {
      setError('Vous devez être connecté pour recommander');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      await axios.post(
        `/api/recommendations/user/${user.userId}`,
        { rating },
        { headers }
      );

      setUserRating(rating);
      setSuccess('Votre recommandation a été enregistrée avec succès !');
      fetchStats();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Erreur lors de l\'enregistrement de votre recommandation');
      console.error('Error submitting recommendation:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null; // Ne pas afficher si l'utilisateur n'est pas connecté
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Recommanderais-tu Fixer à tes amis ou à tes proches ?
      </h2>
      <p className="text-gray-600 mb-4">
        (10 étant la meilleure note) 0 = pas du tout probable, 10 = très probable
      </p>

      {stats && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Note moyenne : <span className="font-bold text-yellow-600">{stats.averageRating?.toFixed(1) || '0.0'}</span> / 10
          </p>
          <p className="text-sm text-gray-600">
            Nombre total de recommandations : <span className="font-bold">{stats.totalRecommendations || 0}</span>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Votre note : {rating} / 10
          </label>
          <input
            type="range"
            min="0"
            max="10"
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>

        {userRating !== null && (
          <p className="text-sm text-gray-600">
            Votre note actuelle : <span className="font-semibold">{userRating} / 10</span>
          </p>
        )}

        {success && (
          <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Enregistrement...' : userRating !== null ? 'Mettre à jour ma recommandation' : 'Soumettre ma recommandation'}
        </button>
      </form>
    </div>
  );
};

export default RecommendationForm;

