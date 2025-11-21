package org.example.serviceelectro.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO {
    private Long id;

    @NotBlank(message = "Le contenu du commentaire est requis")
    private String content;

    @NotNull(message = "L'ID de la publication est requis")
    private Long publicationId;

    private Long utilisateurId;
}


