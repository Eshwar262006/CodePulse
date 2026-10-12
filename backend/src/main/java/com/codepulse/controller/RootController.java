package com.codepulse.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class RootController {

    @GetMapping("/")
    public ResponseEntity<?> root() {
        return ResponseEntity.ok(Map.of(
            "status", "ONLINE",
            "service", "CodePulse Backend API",
            "message", "Backend is healthy and connected to MySQL database.",
            "frontend", "https://frontend-khaki-one-61.vercel.app",
            "endpoints", "/api/problems, /api/auth/login, /api/auth/register"
        ));
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of("status", "UP"));
    }
}
