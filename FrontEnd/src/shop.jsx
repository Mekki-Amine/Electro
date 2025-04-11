
import React from "react";
import "tailwindcss/tailwind.css";
import { Navbar } from "./shared/nav";

const Shop = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-yellow-100 to-yellow-300">
      <header className="bg-yellow-300 text-black font-bold p-4 text-center text-xl">
        Bienvenue chez Fixer
      </header>
<Navbar />

      <main className="flex flex-col items-center justify-center flex-1 p-4">
        <h1 className="text-3xl text-black mb-4">Collection: Produits</h1>
        <div className="flex flex-wrap justify-center">
          <div className="bg-yellow-200 border border-yellow-400 rounded-lg p-4 m-2 w-64 text-center text-black">
            Aucun produit trouvé
          </div>
        </div>
      </main>
    </div>
  );
};

export default Shop;
