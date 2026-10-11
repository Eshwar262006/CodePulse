package com.codepulse.controller;

import com.codepulse.security.UserDetailsImpl;
import com.codepulse.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardData(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(analyticsService.getDashboardAnalytics(userDetails.getId()));
    }

    @GetMapping("/detailed")
    public ResponseEntity<Map<String, Object>> getDetailedAnalytics(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(analyticsService.getDetailedAnalytics(userDetails.getId()));
    }
}

