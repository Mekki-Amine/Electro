import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Logo } from "../../components/Logo";
import { useUserNotifications } from "../../components/UserNotifications";
import { useCart } from "../../components/useCart";
import { api, API_BASE_URL } from "../../api";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, handleNotificationClick } = useUserNotifications();
  const { cartItemCount } = useCart();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Charger la photo de profil
  useEffect(() => {
    const fetchProfilePhoto = async () => {
      if (isAuthenticated && user?.userId) {
        try {
          // --- Dans useEffect ---
        const response = await api.get(
         `/api/utilis/profile/${user.userId}`);

          if (response.data?.profilePhoto) {
            setProfilePhoto(response.data.profilePhoto);
          }
        } catch (err) {
          // Ignorer les erreurs silencieusement
        }
      }
    };

    fetchProfilePhoto();
  }, [isAuthenticated, user?.userId]);

  // Fermer le dropdown quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 relative">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
          >
            <Logo className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0" />
            Fixer
          </Link>
          <div className="flex items-center space-x-1 md:space-x-4 absolute left-1/2 transform -translate-x-1/2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                isActive("/")
                  ? "bg-yellow-500 text-black"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              Accueil
            </Link>
            <Link
              to="/shop"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                isActive("/shop")
                  ? "bg-yellow-500 text-black"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              Catalogue
            </Link>
            {!isAdmin() && (
              <Link
                to="/contact"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive("/contact")
                    ? "bg-yellow-500 text-black"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                Contact
              </Link>
            )}
            <Link
              to="/publications"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                isActive("/publications")
                  ? "bg-yellow-500 text-black"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              Les appareils
            </Link>
            {isAuthenticated && !isAdmin() && (
              <Link
                to="/messages"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive("/messages")
                    ? "bg-yellow-500 text-black"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                Messages
              </Link>
            )}
            {isAuthenticated && (
              <Link
                to="/profile"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive("/profile")
                    ? "bg-yellow-500 text-black"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                Profil
              </Link>
            )}
            {isAuthenticated && !isAdmin() && (
              <Link
                to="/cart"
                className={`relative px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive("/cart")
                    ? "bg-yellow-500 text-black"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                🛒
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                )}
              </Link>
            )}
            {isAuthenticated && !isAdmin() && (
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 text-gray-300 hover:bg-gray-700 hover:text-white"
                  title="Notifications"
                >
                  🔔
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                {/* Dropdown des notifications */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 border border-gray-200 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      {notifications.length > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Tout marquer comme lu
                        </button>
                      )}
                    </div>
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        Aucune notification
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                              !notification.isRead ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => {
                              handleNotificationClick(notification);
                              setShowNotifications(false);
                            }}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(notification.createdAt).toLocaleString('fr-FR')}
                                </p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                                className="ml-2 text-gray-400 hover:text-gray-600"
                                title="Marquer comme lu"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            {isAuthenticated && isAdmin() && (
              <Link
                to="/admin"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  location.pathname.startsWith("/admin")
                    ? "bg-yellow-500 text-black"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                Admin
              </Link>
            )}
          </div>
          <div className="flex-1"></div>
          <div className="flex items-center space-x-2 ml-auto">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* Icône de profil avec point vert */}
                <Link
                  to="/profile"
                  className="relative flex items-center justify-center w-10 h-10 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors cursor-pointer overflow-hidden"
                  title="Voir mon profil"
                >
                  {profilePhoto ? (
                    <img
                      src={`${API_BASE_URL}${profilePhoto}`}
                      alt="Profil"
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-gray-900 font-semibold text-sm">
                      {(user?.username || user?.email || 'U').charAt(0).toUpperCase()}
                    </span>
                  )}
                  {/* Point vert pour indiquer que l'utilisateur est connecté */}
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900 z-10"></span>
                </Link>
                {/* Nom de l'utilisateur */}
                <span className="text-sm text-gray-300 font-medium">
                  {user?.username || user?.email || 'Utilisateur'}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm font-medium transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-md text-sm font-medium transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm font-medium transition-colors"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
