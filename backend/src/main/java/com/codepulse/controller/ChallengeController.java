package com.codepulse.controller;

import com.codepulse.model.DailyChallenge;
import com.codepulse.service.ChallengeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/challenges")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ChallengeController {

    @Autowired
    private ChallengeService challengeService;

    @GetMapping("/daily")
    public ResponseEntity<DailyChallenge> getDailyChallenge() {
        return ResponseEntity.ok(challengeService.getDailyChallenge());
    }
}
