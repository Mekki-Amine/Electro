package org.example.serviceelectro.servicees;

import org.example.serviceelectro.entities.Recommendation;

public interface IRecommendation {
    Recommendation saveRecommendation(Long userId, Integer rating);
    Recommendation getUserRecommendation(Long userId);
    Double getAverageRating();
    Long getTotalRecommendations();
}

