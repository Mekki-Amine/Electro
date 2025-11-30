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
        // Par défaut, les nouvelles publications ne sont pas vérifiées
        if (publication.getVerified() == null) {
            publication.setVerified(false);
        }
        
        // Debug: vérifier le statut avant sauvegarde
        System.out.println("=== SERVICE - Avant sauvegarde ===");
        System.out.println("Statut de la publication: " + publication.getStatus());
        
        Publication savedPublication = publicationRepository.save(publication);
        
        // Debug: vérifier le statut après sauvegarde
        System.out.println("=== SERVICE - Après sauvegarde ===");
        System.out.println("Statut sauvegardé: " + savedPublication.getStatus());
        
        // Tentative de vérification automatique si le service est disponible
        if (autoVerificationService != null && !savedPublication.getVerified()) {
            try {
                autoVerificationService.autoVerifyPublication(savedPublication);
                // Recharger la publication après vérification automatique
                savedPublication = publicationRepository.findById(savedPublication.getId())
                        .orElse(savedPublication);
            } catch (Exception e) {
                // Log l'erreur mais ne bloque pas la création de la publication
                System.err.println("Erreur lors de la vérification automatique: " + e.getMessage());
            }
        }
        
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
}
