import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Logo } from "../../components/Logo";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout, user } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center gap-3 text-xl font-bold text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
          >
            <Logo className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0" />
            Fixer
          </Link>
          <div className="flex items-center space-x-1 md:space-x-4">
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
            <Link
              to="/publications"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                isActive("/publications")
                  ? "bg-yellow-500 text-black"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              Publications
            </Link>
            {isAuthenticated && (
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
            {isAuthenticated ? (
              <div className="flex items-center space-x-2 ml-4">
                <span className="text-sm text-gray-300">
                  {user?.username || user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm font-medium transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 ml-4">
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
