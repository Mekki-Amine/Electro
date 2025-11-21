package org.example.serviceelectro.mapper;

import org.example.serviceelectro.dto.UtilisateurDTO;
import org.example.serviceelectro.entities.Utilisateur;
import org.springframework.stereotype.Component;

@Component
public class UtilisateurMapper {

    public UtilisateurDTO toDTO(Utilisateur utilisateur) {
        if (utilisateur == null) {
            return null;
        }
        return UtilisateurDTO.builder()
                .id(utilisateur.getId())
                .username(utilisateur.getUsername())
                .email(utilisateur.getEmail())
                .role(utilisateur.getRole())
                .build();
    }

    public Utilisateur toEntity(UtilisateurDTO dto) {
        if (dto == null) {
            return null;
        }
        return Utilisateur.builder()
                .id(dto.getId())
                .username(dto.getUsername())
                .email(dto.getEmail())
                .password(dto.getPassword())
                .role(dto.getRole() != null ? dto.getRole() : "USER")
                .build();
    }
}


