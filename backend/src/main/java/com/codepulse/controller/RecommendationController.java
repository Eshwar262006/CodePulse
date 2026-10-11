package com.codepulse.controller;

import com.codepulse.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "*", maxAge = 3600)
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getRecommendations() {
        return ResponseEntity.ok(recommendationService.getPersonalizedRecommendations());
    }
}
