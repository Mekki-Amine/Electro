
import React from "react";
import "tailwindcss/tailwind.css";
import { Navbar } from "./shared/nav";

const Contact = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-yellow-100 to-yellow-300">
      <header className="bg-yellow-300 text-black p-4 text-center text-xl">
        Bienvenue chez Fixer 
      </header>
<Navbar />
      <main className="flex flex-col items-center justify-center flex-1 p-4">
        <h1 className="text-3xl text-gray-800 mb-4">Formulaire de contact</h1>
        <form className="bg-black p-6 rounded-lg shadow-md w-full max-w-md">
          <div className="mb-4">
            <label
              className="block text-yellow-500 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Nom
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-yellow-500 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Nom"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-yellow-500 text-sm font-bold mb-2"
              htmlFor="email"
            >
              E-mail *
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-yellow-500 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="amine.mekki@sesame.com.tn"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-yellow-500 text-sm font-bold mb-2"
              htmlFor="phone"
            >
              Numéro de téléphone
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-yellow-500 leading-tight focus:outline-none focus:shadow-outline"
              id="phone"
              type="tel"
              placeholder="Numéro de téléphone"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-yellow-500 text-sm font-bold mb-2"
              htmlFor="comment"
            >
              Commentaire
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-yellow-500 leading-tight focus:outline-none focus:shadow-outline"
              id="comment"
              placeholder="Commentaire"
            ></textarea>
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-yellow-500 hover:bg-yellow-700 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Envoyer
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Contact;
