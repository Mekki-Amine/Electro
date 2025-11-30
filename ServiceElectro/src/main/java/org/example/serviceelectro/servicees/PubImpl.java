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


    @Override
    public List<Publication> getAllPublications() {
        // Retourne uniquement les publications vérifiées pour le public
        return publicationRepository.findByVerifiedTrue();
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

        return publicationRepository.save(publication);
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

    public List<Publication> findByStatus(String status) {
        return publicationRepository.findByStatus(status);
    }
}
