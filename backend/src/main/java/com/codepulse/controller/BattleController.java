package com.codepulse.controller;

import com.codepulse.security.UserDetailsImpl;
import com.codepulse.service.BattleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/battles")
@CrossOrigin(origins = "*", maxAge = 3600)
public class BattleController {

    @Autowired
    private BattleService battleService;

    @PostMapping("/matchmake")
    public ResponseEntity<?> matchmake(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody(required = false) Map<String, String> body
    ) {
        String mode = body != null ? body.get("mode") : "RANKED";
        return ResponseEntity.ok(battleService.createMatch(userDetails.getId(), mode));
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitBattleCode(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody Map<String, Object> payload
    ) {
        String battleId = (String) payload.get("battleId");
        Long problemId = Long.valueOf(payload.get("problemId").toString());
        String code = (String) payload.get("code");
        String language = (String) payload.getOrDefault("language", "Java");

        return ResponseEntity.ok(battleService.processBattleSubmission(userDetails.getId(), battleId, problemId, code, language));
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getBattleStats(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(battleService.getBattleStats(userDetails.getId()));
    }
}
