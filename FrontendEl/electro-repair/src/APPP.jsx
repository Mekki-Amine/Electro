import React from 'react';
import 'tailwindcss/tailwind.css';

const APPP = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-100 to-blue-300">
      <header className="bg-blue-600 text-white p-4 text-center text-xl">
        Bienvenue chez REPARTOUT
      </header>
      <nav className="bg-gray-800 text-white p-2 flex justify-around">
        <a href="#" className="hover:underline">Accueil</a>
        <a href="#" className="hover:underline">Catalogue</a>
        <a href="#" className="hover:underline">Contact</a>
        <a href="#" className="hover:underline">Compte</a>
        <a href="#" className="hover:underline">Panier</a>
      </nav>
      <main className="flex flex-col items-center justify-center flex-1 p-4">
        <h1 className="text-3xl text-gray-800 mb-4">Collection: Produits</h1>
        <div className="flex flex-wrap justify-center">
          <div className="bg-white border border-gray-300 rounded-lg p-4 m-2 w-64 text-center">
            Aucun produit trouvé
          </div>
        </div>
      </main>
      <footer className="bg-blue-600 text-white p-4 text-center">
        <p>Horaire d'ouverture : Lundi - Vendredi, 8h00 - 18h00</p>
        <p>Email: myrepartout@gmail.com | Téléphone: 0652499545</p>
        <p>© 2025, Ma boutique. Commerce électronique propulsé par Shopify</p>
      </footer>
    </div>
  );
};

export default APPP;