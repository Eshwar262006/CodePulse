package com.codepulse.controller;

import com.codepulse.service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/skills")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SkillController {

    @Autowired
    private SkillService skillService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getSkills() {
        return ResponseEntity.ok(skillService.getUserSkillAnalysis());
    }
}
