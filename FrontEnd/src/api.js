import axios from 'axios';

// Configuration de l'URL de base de l'API
// URL du backend déployé en production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://electro-433v.onrender.com';

// Créer une instance axios avec la configuration de base
// En développement avec Vite, si VITE_API_URL n'est pas défini, on utilise des chemins relatifs
// qui passent par le proxy configuré dans vite.config.js
// En production ou si VITE_API_URL est défini, on utilise l'URL complète du backend
const isDevelopment = import.meta.env.DEV;
const useProxy = isDevelopment && !import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: useProxy ? '' : API_BASE_URL, // En dev sans VITE_API_URL, chemins relatifs pour le proxy
  timeout: 30000, // 30 secondes de timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Gérer les erreurs 401 (non autorisé) - déconnexion automatique
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      // Rediriger vers la page de login si nécessaire
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export { api, API_BASE_URL };

