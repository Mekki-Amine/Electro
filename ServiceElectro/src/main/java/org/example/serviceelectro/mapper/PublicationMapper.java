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
        return PublicationDTO.builder()
                .id(publication.getId())
                .title(publication.getTitle())
                .description(publication.getDescription())
                .type(publication.getType())
                .price(publication.getPrice())
                .status(publication.getStatus())
                .verified(publication.getVerified())
                .verifiedBy(publication.getVerifiedBy())
                .verifiedAt(publication.getVerifiedAt())
                .fileUrl(publication.getFileUrl())
                .fileName(publication.getFileName())
                .fileType(publication.getFileType())
                .fileSize(publication.getFileSize())
                .utilisateurId(publication.getUtilisateur() != null ? publication.getUtilisateur().getId() : null)
                .build();
    }

    public Publication toEntity(PublicationDTO dto, Utilisateur utilisateur) {
        if (dto == null) {
            return null;
        }
        return Publication.builder()
                .id(dto.getId())
                .title(dto.getTitle())
                .description(dto.getDescription())
                .type(dto.getType())
                .price(dto.getPrice())
                .status(dto.getStatus())
                .verified(dto.getVerified() != null ? dto.getVerified() : false)
                .verifiedBy(dto.getVerifiedBy())
                .verifiedAt(dto.getVerifiedAt())
                .fileUrl(dto.getFileUrl())
                .fileName(dto.getFileName())
                .fileType(dto.getFileType())
                .fileSize(dto.getFileSize())
                .utilisateur(utilisateur)
                .build();
    }
}


