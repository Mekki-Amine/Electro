package org.example.serviceelectro.mapper;

import org.example.serviceelectro.dto.PublicationDTO;
import org.example.serviceelectro.entities.Publication;
import org.example.serviceelectro.entities.Utilisateur;
import org.springframework.stereotype.Component;

@Component
public class PublicationMapper {

    public PublicationDTO toDTO(Publication publication) {
        if (publication == null) {
            return null;
        }
        PublicationDTO dto = new PublicationDTO();
        dto.setId(publication.getId());
        dto.setTitle(publication.getTitle());
        dto.setDescription(publication.getDescription());
        dto.setType(publication.getType());
        dto.setPrice(publication.getPrice());
        dto.setStatus(publication.getStatus());
        dto.setVerified(publication.getVerified());
        dto.setVerifiedBy(publication.getVerifiedBy());
        dto.setVerifiedAt(publication.getVerifiedAt());
        dto.setFileUrl(publication.getFileUrl());
        dto.setFileName(publication.getFileName());
        dto.setFileType(publication.getFileType());
        dto.setFileSize(publication.getFileSize());
        dto.setUtilisateurId(publication.getUtilisateur() != null ? publication.getUtilisateur().getId() : null);
        return dto;
    }

    public Publication toEntity(PublicationDTO dto, Utilisateur utilisateur) {
        if (dto == null) {
            return null;
        }
        Publication publication = new Publication();
        publication.setId(dto.getId());
        publication.setTitle(dto.getTitle());
        publication.setDescription(dto.getDescription());
        publication.setType(dto.getType());
        publication.setPrice(dto.getPrice());
        String status = dto.getStatus() != null ? dto.getStatus() : "non traité";
        publication.setStatus(status);
        System.out.println("=== MAPPER ===");
        System.out.println("Statut DTO: " + dto.getStatus());
        System.out.println("Statut final dans entité: " + status);
        publication.setVerified(dto.getVerified() != null ? dto.getVerified() : false);
        publication.setVerifiedBy(dto.getVerifiedBy());
        publication.setVerifiedAt(dto.getVerifiedAt());
        publication.setFileUrl(dto.getFileUrl());
        publication.setFileName(dto.getFileName());
        publication.setFileType(dto.getFileType());
        publication.setFileSize(dto.getFileSize());
        publication.setUtilisateur(utilisateur);
        return publication;
    }
}