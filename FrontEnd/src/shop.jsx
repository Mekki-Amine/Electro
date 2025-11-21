import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "./components/Card";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simuler le chargement des produits depuis l'API
    // Pour l'instant, on affiche un message si aucun produit n'est disponible
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Notre Catalogue
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Découvrez notre sélection de produits et services pour tous vos
            besoins en réparation
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            <p className="mt-4 text-gray-600">Chargement des produits...</p>
          </div>
        ) : error ? (
          <Card className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </Card>
        ) : products.length === 0 ? (
          <div className="max-w-2xl mx-auto">
            <Card className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Aucun produit disponible pour le moment
              </h2>
              <p className="text-gray-600 mb-6">
                Notre catalogue sera bientôt disponible. En attendant, n'hésitez
                pas à nous contacter pour vos besoins spécifiques.
              </p>
              <a
                href="/contact"
                className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
              >
                Nous contacter
              </a>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} hover>
                <div className="aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-4xl">📦</span>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-yellow-600">
                    {product.price}€
                  </span>
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                    Voir plus
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
