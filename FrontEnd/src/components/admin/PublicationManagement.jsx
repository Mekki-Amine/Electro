import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card } from '../Card';
import { useAuth } from '../../contexts/AuthContext';

const PublicationManagement = () => {
  const [publications, setPublications] = useState([]);
  const [filteredPublications, setFilteredPublications] = useState([]);
  const [unverifiedOnly, setUnverifiedOnly] = useState(true);
  const [statusFilter, setStatusFilter] = useState(''); // Filtre par statut
  const [typeFilter, setTypeFilter] = useState(''); // Filtre par type
  const [searchQuery, setSearchQuery] = useState(''); // Recherche par nom
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
  const [editingPrice, setEditingPrice] = useState(null); // ID de la publication en cours d'édition du prix
  const [editingPriceValue, setEditingPriceValue] = useState(''); // Valeur du prix en cours d'édition
  const [editingType, setEditingType] = useState(null); // ID de la publication en cours d'édition du type
  const [editingTitle, setEditingTitle] = useState(null); // ID de la publication en cours d'édition du titre
  const [editingTitleValue, setEditingTitleValue] = useState(''); // Valeur du titre en cours d'édition
  const [editingDescription, setEditingDescription] = useState(null); // ID de la publication en cours d'édition de la description
  const [editingDescriptionValue, setEditingDescriptionValue] = useState(''); // Valeur de la description en cours d'édition
  const { user } = useAuth();
  const navigate = useNavigate();

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

  // Filtrer les publications par type et par nom
  useEffect(() => {
    let filtered = publications;
    
    // Filtrer par type
    if (typeFilter !== '') {
      filtered = filtered.filter(pub => pub.type === typeFilter);
    }
    
    // Filtrer par nom/titre
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(pub => 
        pub.title && pub.title.toLowerCase().includes(query)
      );
    }
    
    setFilteredPublications(filtered);
  }, [typeFilter, searchQuery, publications]);

  const handleSetInCatalog = async (publicationId, inCatalog) => {
    try {
      // Si la publication n'est pas vérifiée, la vérifier d'abord
      const publication = publications.find(p => p.id === publicationId);
      if (publication && !publication.verified) {
        await axios.post(`/api/admin/publications/${publicationId}/verify`, {
          adminId: user.userId,
        });
      }
      
      await axios.put(`/api/admin/publications/${publicationId}/catalog`, {
        inCatalog: inCatalog
      });
      fetchPublications();
      alert(
        inCatalog 
          ? '✅ Publication mise au catalogue ! Elle est maintenant visible sur la page /shop.'
          : '✅ Publication retirée du catalogue.'
      );
    } catch (err) {
      console.error('Error setting publication in catalog:', err);
      const errorMessage = err.response?.data?.message || 'Erreur lors de la mise à jour';
      alert(errorMessage);
    }
  };

  const handleSetInPublications = async (publicationId, inPublications) => {
    try {
      // Si la publication n'est pas vérifiée, la vérifier d'abord
      const publication = publications.find(p => p.id === publicationId);
      if (publication && !publication.verified) {
        await axios.post(`/api/admin/publications/${publicationId}/verify`, {
          adminId: user.userId,
        });
      }
      
      await axios.put(`/api/admin/publications/${publicationId}/publications`, {
        inPublications: inPublications
      });
      fetchPublications();
      alert(
        inPublications 
          ? '✅ Publication mise dans les publications ! Elle est maintenant visible sur la page /publications.'
          : '✅ Publication retirée des publications.'
      );
    } catch (err) {
      console.error('Error setting publication in publications:', err);
      const errorMessage = err.response?.data?.message || 'Erreur lors de la mise à jour';
      alert(errorMessage);
    }
  };

  const handleUnverify = async (publicationId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir retirer cette publication du catalogue ? Elle ne sera plus visible dans la page des publications.')) {
      return;
    }
    try {
      await axios.post(`/api/admin/publications/${publicationId}/unverify`);
      fetchPublications();
      alert('⚠️ Publication retirée du catalogue. Elle n\'est plus visible dans la page des publications.');
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

  const handlePriceChange = async (publicationId, newPrice) => {
    try {
      const price = parseFloat(newPrice);
      if (isNaN(price) || price <= 0) {
        alert('Le prix doit être un nombre positif');
        return;
      }
      await axios.put(`/api/admin/publications/${publicationId}/price`, {
        price: price
      });
      setEditingPrice(null);
      setEditingPriceValue('');
      fetchPublications();
      alert('✅ Prix mis à jour avec succès !');
    } catch (err) {
      console.error('Error updating price:', err);
      const errorMessage = err.response?.data?.message || 'Erreur lors de la mise à jour du prix';
      alert(errorMessage);
    }
  };

  const handleTypeChange = async (publicationId, newType) => {
    try {
      if (!newType || newType.trim() === '') {
        alert('Le type ne peut pas être vide');
        return;
      }
      await axios.put(`/api/admin/publications/${publicationId}/type`, {
        type: newType
      });
      setEditingType(null);
      fetchPublications();
      alert('✅ Type mis à jour avec succès !');
    } catch (err) {
      console.error('Error updating type:', err);
      const errorMessage = err.response?.data?.message || 'Erreur lors de la mise à jour du type';
      alert(errorMessage);
    }
  };

  const handleTitleChange = async (publicationId, newTitle) => {
    try {
      if (!newTitle || newTitle.trim() === '') {
        alert('Le titre ne peut pas être vide');
        return;
      }
      await axios.put(`/api/admin/publications/${publicationId}/title`, {
        title: newTitle
      });
      setEditingTitle(null);
      setEditingTitleValue('');
      fetchPublications();
      alert('✅ Titre mis à jour avec succès !');
    } catch (err) {
      console.error('Error updating title:', err);
      const errorMessage = err.response?.data?.message || 'Erreur lors de la mise à jour du titre';
      alert(errorMessage);
    }
  };

  const handleDescriptionChange = async (publicationId, newDescription) => {
    try {
      if (!newDescription || newDescription.trim() === '') {
        alert('La description ne peut pas être vide');
        return;
      }
      await axios.put(`/api/admin/publications/${publicationId}/description`, {
        description: newDescription
      });
      setEditingDescription(null);
      setEditingDescriptionValue('');
      fetchPublications();
      alert('✅ Description mise à jour avec succès !');
    } catch (err) {
      console.error('Error updating description:', err);
      const errorMessage = err.response?.data?.message || 'Erreur lors de la mise à jour de la description';
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
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Gestion des Publications</h2>
            <p className="text-gray-600">
              Total: {publications.length} publication(s)
              {statusFilter && ` (statut: "${statusFilter}")`}
              {!statusFilter && unverifiedOnly && ' (non vérifiées)'}
              {(typeFilter || searchQuery.trim()) && (
                <span className="ml-2 text-yellow-600">
                  ({filteredPublications.length} résultat{(typeFilter || searchQuery.trim()) ? 's' : ''})
                </span>
              )}
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

        {/* Recherche et filtres */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Recherche par nom */}
          <div>
            <input
              type="text"
              placeholder="Rechercher par nom de publication..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white text-gray-900"
            />
          </div>
          
          {/* Filtre par type */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white text-gray-900"
            >
              <option value="">Tous les types</option>
              <option value="Reparation">Réparation</option>
              <option value="Achat">Achat</option>
              <option value="Vente">Vente</option>
              <option value="exchange">Échange</option>
              <option value="donation">Donation</option>
            </select>
          </div>
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
        ) : filteredPublications.length === 0 ? (
          <Card className="col-span-2 text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-600 mb-4">
              Aucune publication trouvée avec les critères de recherche
            </p>
            {(typeFilter || searchQuery.trim()) && (
              <button
                onClick={() => {
                  setTypeFilter('');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
              >
                Réinitialiser les filtres
              </button>
            )}
          </Card>
        ) : (
          filteredPublications.map((publication) => (
            <Card key={publication.id} className="p-6">
              {/* Informations du propriétaire - EN HAUT */}
              {publication.utilisateurId && (
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Propriétaire:</p>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center cursor-pointer hover:bg-yellow-200 transition-colors overflow-hidden relative"
                      onClick={() => navigate(`/user/${publication.utilisateurId}`)}
                      title="Voir le profil"
                    >
                      {publication.utilisateurProfilePhoto ? (
                        <img
                          src={`http://localhost:9090${publication.utilisateurProfilePhoto}`}
                          alt={publication.utilisateurUsername || publication.utilisateurEmail || "Utilisateur"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : null}
                      <span 
                        className={`text-yellow-600 font-semibold text-sm absolute inset-0 flex items-center justify-center ${publication.utilisateurProfilePhoto ? 'hidden' : ''}`}
                      >
                        {(publication.utilisateurUsername || publication.utilisateurEmail || "U").charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p 
                        className="text-sm font-semibold text-gray-900 truncate cursor-pointer hover:text-yellow-600 hover:underline transition-colors"
                        onClick={() => navigate(`/user/${publication.utilisateurId}`)}
                        title="Cliquez pour voir le profil"
                      >
                        {publication.utilisateurUsername || publication.utilisateurEmail || `Utilisateur #${publication.utilisateurId}`}
                      </p>
                      {publication.utilisateurEmail && publication.utilisateurEmail !== publication.utilisateurUsername && (
                        <p 
                          className="text-xs text-gray-500 truncate cursor-pointer hover:text-yellow-600 hover:underline transition-colors"
                          onClick={() => navigate(`/user/${publication.utilisateurId}`)}
                          title="Cliquez pour voir le profil"
                        >
                          {publication.utilisateurEmail}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">ID: {publication.utilisateurId}</p>
                    </div>
                  </div>
                </div>
              )}

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
                {editingTitle === publication.id ? (
                  <div className="flex-1 flex items-center space-x-2">
                    <input
                      type="text"
                      value={editingTitleValue}
                      onChange={(e) => setEditingTitleValue(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      placeholder="Nouveau titre"
                      autoFocus
                    />
                    <button
                      onClick={() => handleTitleChange(publication.id, editingTitleValue)}
                      className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
                    >
                      ✓ Valider
                    </button>
                    <button
                      onClick={() => {
                        setEditingTitle(null);
                        setEditingTitleValue('');
                      }}
                      className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors text-sm"
                    >
                      Annuler
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center space-x-2">
                    <h3 className="text-xl font-bold text-gray-900 flex-1">{publication.title}</h3>
                    <button
                      onClick={() => {
                        setEditingTitle(publication.id);
                        setEditingTitleValue(publication.title);
                      }}
                      className="px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 rounded transition-colors"
                      title="Modifier le titre"
                    >
                      ✏️
                    </button>
                  </div>
                )}
                {editingType === publication.id ? (
                  <div className="flex items-center space-x-2">
                    <select
                      value={publication.type || 'Reparation'}
                      onChange={(e) => {
                        handleTypeChange(publication.id, e.target.value);
                      }}
                      className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-xs font-semibold"
                      autoFocus
                    >
                      <option value="Reparation">Reparation</option>
                      <option value="Achat">Achat</option>
                      <option value="Vente">Vente</option>
                      <option value="exchange">Exchange</option>
                      <option value="donation">Donation</option>
                    </select>
                    <button
                      onClick={() => setEditingType(null)}
                      className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(
                        publication.type
                      )}`}
                    >
                      {publication.type}
                    </span>
                    <button
                      onClick={() => setEditingType(publication.id)}
                      className="px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 rounded transition-colors"
                      title="Modifier le type"
                    >
                      ✏️
                    </button>
                  </div>
                )}
              </div>

              {editingDescription === publication.id ? (
                <div className="mb-4">
                  <textarea
                    value={editingDescriptionValue}
                    onChange={(e) => setEditingDescriptionValue(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 min-h-[100px]"
                    placeholder="Nouvelle description"
                    autoFocus
                  />
                  <div className="flex items-center space-x-2 mt-2">
                    <button
                      onClick={() => handleDescriptionChange(publication.id, editingDescriptionValue)}
                      className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
                    >
                      ✓ Valider
                    </button>
                    <button
                      onClick={() => {
                        setEditingDescription(null);
                        setEditingDescriptionValue('');
                      }}
                      className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors text-sm"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-4 flex items-start space-x-2">
                  <p className="text-gray-700 flex-1 line-clamp-3">{publication.description}</p>
                  <button
                    onClick={() => {
                      setEditingDescription(publication.id);
                      setEditingDescriptionValue(publication.description);
                    }}
                    className="px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 rounded transition-colors flex-shrink-0"
                    title="Modifier la description"
                  >
                    ✏️
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                {editingPrice === publication.id ? (
                  <div className="flex items-center space-x-2 flex-1">
                    <span className="text-lg font-semibold text-gray-700">Prix:</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={editingPriceValue}
                      onChange={(e) => setEditingPriceValue(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      placeholder="Nouveau prix"
                      autoFocus
                    />
                    <span className="text-lg font-semibold text-gray-700">€</span>
                    <button
                      onClick={() => handlePriceChange(publication.id, editingPriceValue)}
                      className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
                    >
                      ✓ Valider
                    </button>
                    <button
                      onClick={() => {
                        setEditingPrice(null);
                        setEditingPriceValue('');
                      }}
                      className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors text-sm"
                    >
                      Annuler
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 flex-1">
                    <span className="text-2xl font-bold text-yellow-600">{publication.price}€</span>
                    <button
                      onClick={() => {
                        setEditingPrice(publication.id);
                        setEditingPriceValue(publication.price.toString());
                      }}
                      className="px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 rounded transition-colors"
                      title="Modifier le prix"
                    >
                      ✏️ Modifier
                    </button>
                  </div>
                )}
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
                {publication.createdAt && (
                  <p className="mb-1"><strong>Créée le:</strong> {new Date(publication.createdAt).toLocaleDateString('fr-FR')}</p>
                )}
                {publication.verifiedAt && (
                  <p><strong>Vérifiée le:</strong> {new Date(publication.verifiedAt).toLocaleDateString('fr-FR')}</p>
                )}
              </div>

              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                {!publication.verified && (
                  <div className="mb-2">
                    <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">
                      ⚠️ Non vérifiée - Cliquez sur un bouton ci-dessous pour vérifier et placer
                    </span>
                  </div>
                )}
                <div className="flex flex-col space-y-2">
                  {/* Indicateurs d'état */}
                  {publication.verified && (
                    <div className="flex items-center gap-2 mb-2">
                      {publication.inCatalog && (
                        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                          📋 Catalogue
                        </span>
                      )}
                      {publication.inPublications && (
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          📄 Publications
                        </span>
                      )}
                      {!publication.inCatalog && !publication.inPublications && (
                        <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                          ⚠️ Vérifiée mais pas encore placée
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Boutons pour le catalogue */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleSetInCatalog(publication.id, !publication.inCatalog)}
                      className={`flex-1 px-4 py-2 rounded-lg transition-colors font-semibold ${
                        publication.inCatalog
                          ? 'bg-green-600 text-white'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                      title={publication.inCatalog ? "Retirer du catalogue" : "Mettre dans le catalogue - Visible sur /shop (vérifie automatiquement)"}
                    >
                      {publication.inCatalog ? '📋 Retirer du Catalogue' : '📋 Mettre au Catalogue'}
                    </button>
                    <button
                      onClick={() => handleSetInPublications(publication.id, !publication.inPublications)}
                      className={`flex-1 px-4 py-2 rounded-lg transition-colors font-semibold ${
                        publication.inPublications
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                      title={publication.inPublications ? "Retirer des publications" : "Mettre dans les publications - Visible sur /publications (vérifie automatiquement)"}
                    >
                      {publication.inPublications ? '📄 Retirer des Publications' : '📄 Mettre dans Publications'}
                    </button>
                  </div>
                  
                  {/* Bouton pour mettre dans les deux */}
                  {(!publication.inCatalog || !publication.inPublications) && (
                    <button
                      onClick={() => {
                        if (!publication.inCatalog) handleSetInCatalog(publication.id, true);
                        if (!publication.inPublications) handleSetInPublications(publication.id, true);
                      }}
                      className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors font-semibold"
                      title="Mettre dans le catalogue ET dans les publications (vérifie automatiquement)"
                    >
                      📋📄 Mettre dans les Deux
                    </button>
                  )}
                  
                  {publication.verified && (
                    <button
                      onClick={() => handleUnverify(publication.id)}
                      className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors font-semibold"
                      title="Retirer - La publication ne sera plus visible publiquement"
                    >
                      ✗ Retirer (Dévérifier)
                    </button>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(publication.id)}
                  className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
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

