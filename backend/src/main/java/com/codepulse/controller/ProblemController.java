package com.codepulse.controller;

import com.codepulse.model.Problem;
import com.codepulse.service.ProblemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/problems")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProblemController {

    @Autowired
    private ProblemService problemService;

    @GetMapping
    public ResponseEntity<List<Problem>> getAllProblems(
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String topic,
            @RequestParam(required = false) String search) {
        List<Problem> problems = problemService.filterProblems(difficulty, topic, search);
        return ResponseEntity.ok(problems);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProblemById(@PathVariable Long id) {
        return problemService.getProblemById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
