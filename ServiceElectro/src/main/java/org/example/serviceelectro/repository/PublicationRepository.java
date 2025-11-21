package org.example.serviceelectro.repository;

import org.example.serviceelectro.entities.Publication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PublicationRepository extends JpaRepository<Publication, Long> {
    List<Publication> findByUtilisateurId(Long utilisateurId);
    List<Publication> findByStatus(String status);
    List<Publication> findByType(String type);
    List<Publication> findByVerifiedTrue();
    List<Publication> findByVerifiedFalse();
    List<Publication> findByVerifiedAndStatus(Boolean verified, String status);
    public Publication getPublicationId(int id) ;
}
