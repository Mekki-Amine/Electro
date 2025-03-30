import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-2 flex justify-around">
      <Link to="/" className="hover:underline">
        Accueil
      </Link>
      <Link to="/shop" className="hover:underline">
        Catalogue
      </Link>
      <Link to="/contact" className="hover:underline">
        Contact
      </Link>
      <Link to="/publications" className="hover:underline">
        Publications
      </Link>
    </nav>
  );
};
