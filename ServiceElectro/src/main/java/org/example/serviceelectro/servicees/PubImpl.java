package org.example.serviceelectro.servicees;

import org.example.serviceelectro.entities.Publication;
import org.example.serviceelectro.repository.PublicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PubImpl implements Ipub {
    @Autowired
    private PublicationRepository publicationRepository;

    @Autowired(required = false)
    private AutoVerificationService autoVerificationService;

    @Autowired(required = false)
    private INotification notificationService;


    @Override
    public List<Publication> getAllPublications() {
        // Retourne uniquement les publications vérifiées ET dans le catalogue pour /shop
        return publicationRepository.findByVerifiedTrueAndInCatalogTrue();
    }

    public List<Publication> getPublicationsForPublicationsPage() {
        // Retourne les publications vérifiées ET dans les publications pour /publications
        return publicationRepository.findByVerifiedTrueAndInPublicationsTrue();
    }

    public List<Publication> getAllPublicationsIncludingUnverified() {
        // Retourne toutes les publications (pour les admins)
        return publicationRepository.findAll();
    }

    @Override
    public Publication savePublication(Publication publication) {
        // L'utilisateur est maintenant optionnel - les publications peuvent être créées sans utilisateur
        // IMPORTANT: Toutes les nouvelles publications sont non vérifiées par défaut
        // Si c'est une nouvelle publication (pas d'ID), forcer verified à false
        if (publication.getId() == null) {
            publication.setVerified(false);
        } else if (publication.getVerified() == null) {
            // Pour les publications existantes, si verified est null, le mettre à false
            publication.setVerified(false);
        }
        
        // Debug: vérifier le statut avant sauvegarde
        System.out.println("=== SERVICE - Avant sauvegarde ===");
        System.out.println("Statut de la publication: " + publication.getStatus());
        
        Publication savedPublication = publicationRepository.save(publication);
        
        // Debug: vérifier le statut après sauvegarde
        System.out.println("=== SERVICE - Après sauvegarde ===");
        System.out.println("Statut sauvegardé: " + savedPublication.getStatus());
        System.out.println("Vérifiée: " + savedPublication.getVerified());
        
        // IMPORTANT: Les publications sont créées non vérifiées par défaut
        // La vérification doit être faite manuellement par un administrateur
        // Désactivation de la vérification automatique lors de la création
        
        return savedPublication;
    }

    @Override
    public Publication getPublicationId(int id) {
        return null;
    }

    public Optional<Publication> findById(Long id) {
        return publicationRepository.findById(id);
    }

    public void deletePublication(Long id) {
        Optional<Publication> publicationOpt = publicationRepository.findById(id);
        if (publicationOpt.isPresent()) {
            Publication publication = publicationOpt.get();

            }

        publicationRepository.deleteById(id);
    }

    public List<Publication> findByUtilisateurId(Long utilisateurId) {
        return publicationRepository.findByUtilisateurId(utilisateurId);
    }

    public List<Publication> findUnverifiedPublications() {
        return publicationRepository.findByVerifiedFalse();
    }

    public Publication verifyPublication(Long publicationId, Long adminId) {
        Publication publication = publicationRepository.findById(publicationId)
                .orElseThrow(() -> new IllegalArgumentException("Publication non trouvée"));

        if (publication.getVerified()) {
            throw new IllegalArgumentException("Cette publication est déjà vérifiée");
        }

        publication.setVerified(true);
        publication.setVerifiedBy(adminId);
        publication.setVerifiedAt(LocalDateTime.now());

        Publication savedPublication = publicationRepository.save(publication);

        // Créer une notification pour l'utilisateur propriétaire de la publication
        if (notificationService != null && savedPublication.getUtilisateur() != null) {
            try {
                String message = String.format("Votre publication \"%s\" a été approuvée et est maintenant visible sur le site.", 
                    savedPublication.getTitle());
                notificationService.createNotification(
                    savedPublication.getUtilisateur().getId(),
                    message,
                    "PUBLICATION_APPROVED",
                    savedPublication.getId()
                );
            } catch (Exception e) {
                // Ne pas faire échouer la vérification si la notification échoue
                System.err.println("Erreur lors de la création de la notification: " + e.getMessage());
            }
        }

        return savedPublication;
    }

    public Publication setPublicationInCatalog(Long publicationId, Boolean inCatalog) {
        Publication publication = publicationRepository.findById(publicationId)
                .orElseThrow(() -> new IllegalArgumentException("Publication non trouvée"));

        // Si la publication n'est pas vérifiée, la vérifier d'abord
        if (!publication.getVerified()) {
            publication.setVerified(true);
            publication.setVerifiedBy(null); // Vérification automatique
            publication.setVerifiedAt(LocalDateTime.now());
        }

        boolean wasInCatalog = publication.getInCatalog() != null && publication.getInCatalog();
        publication.setInCatalog(inCatalog);
        Publication savedPublication = publicationRepository.save(publication);

        // Créer une notification si la publication est mise au catalogue (changement d'état de false à true)
        if (notificationService != null && savedPublication.getUtilisateur() != null && inCatalog && !wasInCatalog) {
            try {
                String message = String.format("Votre publication \"%s\" a été ajoutée au catalogue et est maintenant visible sur la page du catalogue.", 
                    savedPublication.getTitle());
                notificationService.createNotification(
                    savedPublication.getUtilisateur().getId(),
                    message,
                    "PUBLICATION_IN_CATALOG",
                    savedPublication.getId()
                );
            } catch (Exception e) {
                System.err.println("Erreur lors de la création de la notification: " + e.getMessage());
            }
        }

        return savedPublication;
    }

    public Publication setPublicationInPublications(Long publicationId, Boolean inPublications) {
        Publication publication = publicationRepository.findById(publicationId)
                .orElseThrow(() -> new IllegalArgumentException("Publication non trouvée"));

        // Si la publication n'est pas vérifiée, la vérifier d'abord
        if (!publication.getVerified()) {
            publication.setVerified(true);
            publication.setVerifiedBy(null); // Vérification automatique
            publication.setVerifiedAt(LocalDateTime.now());
        }

        boolean wasInPublications = publication.getInPublications() != null && publication.getInPublications();
        publication.setInPublications(inPublications);
        Publication savedPublication = publicationRepository.save(publication);

        // Créer une notification si la publication est mise dans les publications (changement d'état de false à true)
        if (notificationService != null && savedPublication.getUtilisateur() != null && inPublications && !wasInPublications) {
            try {
                String message = String.format("Votre publication \"%s\" a été ajoutée à la page des publications et est maintenant visible sur la page /publications.", 
                    savedPublication.getTitle());
                notificationService.createNotification(
                    savedPublication.getUtilisateur().getId(),
                    message,
                    "PUBLICATION_IN_PUBLICATIONS",
                    savedPublication.getId()
                );
            } catch (Exception e) {
                System.err.println("Erreur lors de la création de la notification: " + e.getMessage());
            }
        }

        return savedPublication;
    }

    public Publication unverifyPublication(Long publicationId) {
        Publication publication = publicationRepository.findById(publicationId)
                .orElseThrow(() -> new IllegalArgumentException("Publication non trouvée"));

        publication.setVerified(false);
        publication.setVerifiedBy(null);
        publication.setVerifiedAt(null);

        return publicationRepository.save(publication);
    }

    public Publication updatePublicationStatus(Long publicationId, String status) {
        Publication publication = publicationRepository.findById(publicationId)
                .orElseThrow(() -> new IllegalArgumentException("Publication non trouvée"));

        if (status == null || status.trim().isEmpty()) {
            throw new IllegalArgumentException("Le statut ne peut pas être vide");
        }

        publication.setStatus(status.trim());
        return publicationRepository.save(publication);
    }

    public Publication updatePublicationPrice(Long publicationId, Double price) {
        Publication publication = publicationRepository.findById(publicationId)
                .orElseThrow(() -> new IllegalArgumentException("Publication non trouvée"));

        if (price == null || price <= 0) {
            throw new IllegalArgumentException("Le prix doit être positif");
        }

        publication.setPrice(price);
        return publicationRepository.save(publication);
    }

    public Publication updatePublicationType(Long publicationId, String type) {
        Publication publication = publicationRepository.findById(publicationId)
                .orElseThrow(() -> new IllegalArgumentException("Publication non trouvée"));

        if (type == null || type.trim().isEmpty()) {
            throw new IllegalArgumentException("Le type ne peut pas être vide");
        }

        publication.setType(type.trim());
        return publicationRepository.save(publication);
    }

    public Publication updatePublicationTitle(Long publicationId, String title) {
        Publication publication = publicationRepository.findById(publicationId)
                .orElseThrow(() -> new IllegalArgumentException("Publication non trouvée"));

        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Le titre ne peut pas être vide");
        }

        publication.setTitle(title.trim());
        return publicationRepository.save(publication);
    }

    public Publication updatePublicationDescription(Long publicationId, String description) {
        Publication publication = publicationRepository.findById(publicationId)
                .orElseThrow(() -> new IllegalArgumentException("Publication non trouvée"));

        if (description == null || description.trim().isEmpty()) {
            throw new IllegalArgumentException("La description ne peut pas être vide");
        }

        publication.setDescription(description.trim());
        return publicationRepository.save(publication);
    }

    public List<Publication> findByStatus(String status) {
        return publicationRepository.findByStatus(status);
    }
}
