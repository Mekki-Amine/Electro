package org.example.serviceelectro.mapper;

import org.example.serviceelectro.dto.RecommendationDTO;
import org.example.serviceelectro.entities.Recommendation;
import org.springframework.stereotype.Component;

@Component
public class RecommendationMapper {

    public RecommendationDTO toDTO(Recommendation recommendation) {
        if (recommendation == null) {
            return null;
        }

        RecommendationDTO dto = new RecommendationDTO();
        dto.setId(recommendation.getId());
        dto.setRating(recommendation.getRating());
        dto.setCreatedAt(recommendation.getCreatedAt());

        if (recommendation.getUser() != null) {
            dto.setUserId(recommendation.getUser().getId());
        }

        return dto;
    }
}

