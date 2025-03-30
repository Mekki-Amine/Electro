import React from 'react';
import 'tailwindcss/tailwind.css';

const Contact = () => {
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
        <h1 className="text-3xl text-gray-800 mb-4">Formulaire de contact</h1>
        <form className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Nom
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Nom" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              E-mail *
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="amine.mekki@sesame.com.tn" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
              Numéro de téléphone
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="phone" type="tel" placeholder="Numéro de téléphone" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="comment">
              Commentaire
            </label>
            <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="comment" placeholder="Commentaire"></textarea>
          </div>
          <div className="flex items-center justify-between">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
              Envoyer
            </button>
          </div>
        </form>
      </main>
      <footer className="bg-blue-600 text-white p-4 text-center">
        <p>Horaire d'ouverture : Lundi - Vendredi, 8h00 - 18h00</p>
        <p>Email: myrepartout@gmail.com | Téléphone: 0652499545</p>
        <p>© 2025, Ma boutique. Commerce électronique propulsé par Shopify</p>
      </footer>
    </div>
  );
};

export default Contact;