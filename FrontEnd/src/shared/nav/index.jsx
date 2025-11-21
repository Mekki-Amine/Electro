import React from "react";
import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="text-xl font-bold text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
          >
            Fixer
          </Link>
          <div className="flex space-x-1 md:space-x-4">
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
          </div>
        </div>
      </div>
    </nav>
  );
};
