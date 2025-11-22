import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "./components/Button";
import { Input } from "./components/Input";
import { Textarea } from "./components/Textarea";
import { Card } from "./components/Card";

function Pup() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPublication, setNewPublication] = useState({
    title: "",
    description: "",
    type: "Reparation",
    price: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = () => {
    setLoading(true);
    axios
      .get("/api/pub")
      .then((response) => {
        setPublications(response.data);
        setError(null);
      })
      .catch((error) => {
        console.error("Error fetching publications:", error);
        setError("Impossible de charger les publications. Vérifiez que le serveur est démarré.");
      })
      .finally(() => setLoading(false));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPublication((prevState) => ({
      ...prevState,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);

    // send only title, description and price to backend
    const payload = {
      title: newPublication.title,
      description: newPublication.description,
      type: newPublication.type,
      price: newPublication.price,
      utilisateurId: 1
    };

    axios
      .post("/api/pub", payload)
      .then((response) => {
        setPublications([...publications, response.data]);
        setNewPublication({
          title: "",
          description: "",
          type: "Reparation",
          price: 0,
        });
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 5000);
      })
      .catch((error) => {
        console.error("Error creating publication:", error);
        setError("Erreur lors de la publication. Veuillez réessayer.");
      })
      .finally(() => setIsSubmitting(false));
  };

  const getTypeColor = (type) => {
    const colors = {
      Reparation: "bg-blue-100 text-blue-800",
      Achat: "bg-green-100 text-green-800",
      Vente: "bg-purple-100 text-purple-800",
      exchange: "bg-orange-100 text-orange-800",
      donation: "bg-pink-100 text-pink-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[type] || colors.other;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Publications
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Publiez vos annonces de réparation, achat, vente ou échange
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Publier une nouvelle annonce
            </h2>
            {submitSuccess && (
              <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                ✓ Votre publication a été créée avec succès !
              </div>
            )}
            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Titre"
                id="title"
                name="title"
                type="text"
                placeholder="Titre de votre annonce"
                value={newPublication.title}
                onChange={handleChange}
                required
              />

              <Textarea
                label="Description"
                id="description"
                name="description"
                placeholder="Description détaillée..."
                value={newPublication.description}
                onChange={handleChange}
                required
                rows={5}
              />

              <div className="mb-4">
                <label
                  htmlFor="type"
                  className="block text-sm font-semibold mb-2 text-gray-800"
                >
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="type"
                  name="type"
                  value={newPublication.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="Reparation">Réparation</option>
                  <option value="Achat">Achat</option>
                  <option value="Vente">Vente</option>
                  <option value="exchange">Échange</option>
                  <option value="donation">Donation</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <Input
                label="Prix (€)"
                id="price"
                name="price"
                type="number"
                placeholder="0"
                value={newPublication.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />

              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto min-w-[150px]"
                >
                  {isSubmitting ? "Publication..." : "Publier"}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Annonces récentes
          </h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
              <p className="mt-4 text-gray-600">Chargement des publications...</p>
            </div>
          ) : publications.length === 0 ? (
            <Card className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-600">
                Aucune publication pour le moment. Soyez le premier à publier !
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {publications.map((publication) => (
                <Card key={publication.id} hover>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      {publication.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(
                        publication.type
                      )}`}
                    >
                      {publication.type}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {publication.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-2xl font-bold text-yellow-600">
                      {publication.price}€
                    </span>
                    <span className="text-sm text-gray-500">
                      #{publication.id}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Pup;
