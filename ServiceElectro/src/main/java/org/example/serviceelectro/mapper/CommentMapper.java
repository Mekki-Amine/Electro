package org.example.serviceelectro.mapper;

import org.example.serviceelectro.dto.CommentDTO;
import org.example.serviceelectro.entities.Comment;
import org.example.serviceelectro.entities.Publication;
import org.example.serviceelectro.entities.Utilisateur;
import org.springframework.stereotype.Component;

@Component
public class CommentMapper {

    public CommentDTO toDTO(Comment comment) {
        if (comment == null) {
            return null;
        }
        return CommentDTO.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .publicationId(comment.getPublication() != null ? comment.getPublication().getId() : null)
                .utilisateurId(comment.getUtilisateur() != null ? comment.getUtilisateur().getId() : null)
                .build();
    }

    public Comment toEntity(CommentDTO dto, Publication publication, Utilisateur utilisateur) {
        if (dto == null) {
            return null;
        }
        return Comment.builder()
                .id(dto.getId())
                .content(dto.getContent())
                .publication(publication)
                .utilisateur(utilisateur)
                .build();
    }
}


