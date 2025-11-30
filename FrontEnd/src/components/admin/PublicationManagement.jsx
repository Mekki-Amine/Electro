import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '../Card';
import { useAuth } from '../../contexts/AuthContext';

const PublicationManagement = () => {
  const [publications, setPublications] = useState([]);
  const [unverifiedOnly, setUnverifiedOnly] = useState(true);
  const [statusFilter, setStatusFilter] = useState(''); // Filtre par statut
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newPublication, setNewPublication] = useState({
    title: "",
    description: "",
    type: "Reparation",
    price: 0,
    utilisateurId: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [editingStatus, setEditingStatus] = useState(null); // ID de la publication en cours d'édition
  const { user } = useAuth();

  useEffect(() => {
    fetchPublications();
  }, [unverifiedOnly, statusFilter]);

  const fetchPublications = async () => {
    try {
      setLoading(true);
      let endpoint;
      if (statusFilter) {
        // Filtrer par statut
        endpoint = `/api/admin/publications/status/${encodeURIComponent(statusFilter)}`;
      } else if (unverifiedOnly) {
        endpoint = '/api/admin/publications/unverified';
      } else {
        endpoint = '/api/admin/publications';
      }
      const response = await axios.get(endpoint);
      setPublications(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching publications:', err);
      setError('Erreur lors du chargement des publications');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (publicationId) => {
    try {
      await axios.post(`/api/admin/publications/${publicationId}/verify`, {
        adminId: user.userId,
      });
      fetchPublications();
      // Success message could be added here
    } catch (err) {
      console.error('Error verifying publication:', err);
      const errorMessage = err.response?.data?.message || 'Erreur lors de la vérification de la publication';
      alert(errorMessage);
    }
  };

  const handleUnverify = async (publicationId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir retirer cette publication du catalogue ?')) {
      return;
    }
    try {
      await axios.post(`/api/admin/publications/${publicationId}/unverify`);
      fetchPublications();
    } catch (err) {
      console.error('Error unverifying publication:', err);
      const errorMessage = err.response?.data?.message || 'Erreur lors de l\'annulation de la vérification';
      alert(errorMessage);
    }
  };

  const handleDelete = async (publicationId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette publication ?')) {
      return;
    }

    try {
      await axios.delete(`/api/admin/publications/${publicationId}`);
      setPublications(publications.filter((pub) => pub.id !== publicationId));
    } catch (err) {
      console.error('Error deleting publication:', err);
      alert('Erreur lors de la suppression de la publication');
    }
  };

  const handleStatusChange = async (publicationId, newStatus) => {
    try {
      await axios.put(`/api/admin/publications/${publicationId}/status`, {
        status: newStatus
      });
      setEditingStatus(null);
      fetchPublications();
    } catch (err) {
      console.error('Error updating status:', err);
      const errorMessage = err.response?.data?.message || 'Erreur lors de la mise à jour du statut';
      alert(errorMessage);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'non traité': 'bg-red-100 text-red-800',
      'en cours': 'bg-yellow-100 text-yellow-800',
      'traité': 'bg-green-100 text-green-800',
      'terminé': 'bg-blue-100 text-blue-800',
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type) => {
    const colors = {
      Reparation: 'bg-blue-100 text-blue-800',
      Achat: 'bg-green-100 text-green-800',
      Vente: 'bg-purple-100 text-purple-800',
      exchange: 'bg-orange-100 text-orange-800',
      donation: 'bg-pink-100 text-pink-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[type] || colors.other;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        <p className="mt-4 text-gray-600">Chargement des publications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchPublications}
          className="mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
        >
          Réessayer
        </button>
      </Card>
    );
  }

  const handleCreateAndVerify = async (publicationId) => {
    try {
      // Créer et vérifier immédiatement
      await handleVerify(publicationId);
      fetchPublications();
    } catch (err) {
      console.error('Error creating and verifying publication:', err);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Gestion des Publications</h2>
          <p className="text-gray-600">
            Total: {publications.length} publication(s)
            {statusFilter && ` (statut: "${statusFilter}")`}
            {!statusFilter && unverifiedOnly && ' (non vérifiées)'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            💡 Astuce: Vous pouvez créer une publication via /publications puis la vérifier ici pour la mettre au catalogue.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={unverifiedOnly}
              onChange={(e) => {
                setUnverifiedOnly(e.target.checked);
                if (e.target.checked) {
                  setStatusFilter(''); // Réinitialiser le filtre de statut
                }
              }}
              className="w-4 h-4 text-yellow-600 rounded focus:ring-yellow-500"
            />
            <span className="text-gray-700">Non vérifiées uniquement</span>
          </label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setUnverifiedOnly(false); // Désactiver le filtre non vérifiées
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
          >
            <option value="">Tous les statuts</option>
            <option value="non traité">Non traité</option>
            <option value="en cours">En cours</option>
            <option value="traité">Traité</option>
            <option value="terminé">Terminé</option>
          </select>
          <button
            onClick={fetchPublications}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
          >
            Actualiser
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {publications.length === 0 ? (
          <Card className="col-span-2 text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-600">
              {statusFilter
                ? `Aucune publication avec le statut "${statusFilter}"`
                : unverifiedOnly
                ? 'Aucune publication non vérifiée'
                : 'Aucune publication trouvée'}
            </p>
          </Card>
        ) : (
          publications.map((publication) => (
            <Card key={publication.id} className="p-6">
              {/* Image */}
              {publication.fileUrl && publication.fileType?.startsWith('image/') && (
                <div className="mb-4 rounded-lg overflow-hidden">
                  <img
                    src={`http://localhost:9090${publication.fileUrl}`}
                    alt={publication.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-gray-900 flex-1">{publication.title}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(
                    publication.type
                  )}`}
                >
                  {publication.type}
                </span>
              </div>

              <p className="text-gray-700 mb-4 line-clamp-3">{publication.description}</p>

              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-yellow-600">{publication.price}€</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    publication.verified
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {publication.verified ? '✓ Vérifiée' : '✗ Non vérifiée'}
                </span>
              </div>

              {/* Affichage et modification du statut */}
              <div className="mb-3">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Statut:
                </label>
                {editingStatus === publication.id ? (
                  <div className="flex items-center space-x-2">
                    <select
                      value={publication.status || 'non traité'}
                      onChange={(e) => {
                        handleStatusChange(publication.id, e.target.value);
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      autoFocus
                    >
                      <option value="non traité">Non traité</option>
                      <option value="en cours">En cours</option>
                      <option value="traité">Traité</option>
                      <option value="terminé">Terminé</option>
                    </select>
                    <button
                      onClick={() => setEditingStatus(null)}
                      className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        publication.status
                      )}`}
                    >
                      {publication.status || 'non traité'}
                    </span>
                    <button
                      onClick={() => setEditingStatus(publication.id)}
                      className="px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 rounded transition-colors"
                      title="Modifier le statut"
                    >
                      ✏️ Modifier
                    </button>
                  </div>
                )}
              </div>

              <div className="mb-3 text-sm text-gray-600">
                <p><strong>Utilisateur ID:</strong> {publication.utilisateurId}</p>
                {publication.createdAt && (
                  <p><strong>Créée le:</strong> {new Date(publication.createdAt).toLocaleDateString('fr-FR')}</p>
                )}
                {publication.verifiedAt && (
                  <p><strong>Vérifiée le:</strong> {new Date(publication.verifiedAt).toLocaleDateString('fr-FR')}</p>
                )}
              </div>

              <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
                {!publication.verified ? (
                  <button
                    onClick={() => handleVerify(publication.id)}
                    className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-semibold"
                    title="Mettre dans le catalogue (vérifier)"
                  >
                    ✓ Mettre au catalogue
                  </button>
                ) : (
                  <button
                    onClick={() => handleUnverify(publication.id)}
                    className="flex-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors font-semibold"
                    title="Retirer du catalogue"
                  >
                    ✗ Retirer du catalogue
                  </button>
                )}
                <button
                  onClick={() => handleDelete(publication.id)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  title="Supprimer définitivement"
                >
                  🗑️ Supprimer
                </button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default PublicationManagement;

