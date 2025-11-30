import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    // Set up axios interceptor for token
    const interceptor = axios.interceptors.request.use(
      (config) => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          config.headers.Authorization = `Bearer ${storedToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Load user from token on mount
    if (token) {
      loadUserFromToken(token);
    } else {
      setLoading(false);
    }

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, []);

  const loadUserFromToken = async (tokenToUse) => {
    try {
      // Decode token to get user info (simple approach)
      // In production, you might want to verify token with backend
      const payload = JSON.parse(atob(tokenToUse.split('.')[1]));
      
      // Get userId from localStorage if available (stored during login)
      const storedUserId = localStorage.getItem('userId');
      const storedUsername = localStorage.getItem('username');
      
      setUser({
        email: payload.sub,
        role: payload.role,
        userId: storedUserId ? parseInt(storedUserId, 10) : null,
        username: storedUsername || null,
      });
      setToken(tokenToUse);
    } catch (error) {
      console.error('Error loading user from token:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // Normalize email to lowercase
      const normalizedEmail = email.toLowerCase().trim();
      
      console.log('Attempting login with email:', normalizedEmail);
      
      const response = await axios.post('/api/auth/login', { 
        email: normalizedEmail, 
        password: password 
      }, {
        timeout: 10000, // 10 second timeout
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('✅ Login response received:', response.data);
      
      const { token: newToken, email: userEmail, role, userId, username } = response.data;
      
      if (!newToken) {
        console.error('No token in response:', response.data);
        return {
          success: false,
          error: 'Erreur: Token non reçu du serveur',
        };
      }
      
      localStorage.setItem('token', newToken);
      if (userId) {
        localStorage.setItem('userId', userId.toString());
      }
      if (username) {
        localStorage.setItem('username', username);
      }
      setToken(newToken);
      setUser({ email: userEmail, role, userId, username });
      
      return { success: true };
    } catch (error) {
      // Log detailed error information
      console.group('🔴 Login Error Details');
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response status text:', error.response.statusText);
        console.error('Response data:', JSON.stringify(error.response.data, null, 2));
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received. Request:', error.request);
        console.error('This usually means the server is not running or not accessible.');
      }
      
      console.error('Full error:', error);
      console.groupEnd();
      
      let errorMessage = 'Erreur de connexion';
      
      if (error.response) {
        // Server responded with error
        const data = error.response.data;
        errorMessage = data?.message || 
                      data?.error ||
                      (data?.errors ? JSON.stringify(data.errors) : null) ||
                      `Erreur ${error.response.status}: ${error.response.statusText}`;
      } else if (error.request) {
        // Request made but no response
        errorMessage = 'Impossible de contacter le serveur. Vérifiez que le serveur Spring Boot est démarré sur le port 9090.';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'La requête a pris trop de temps. Vérifiez votre connexion.';
      } else {
        // Something else happened
        errorMessage = error.message || 'Erreur inattendue';
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await axios.post('/api/utilis', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de l\'inscription',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    setToken(null);
    setUser(null);
  };

  const isAdmin = () => {
    return user?.role === 'ADMIN';
  };

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    isAdmin,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

