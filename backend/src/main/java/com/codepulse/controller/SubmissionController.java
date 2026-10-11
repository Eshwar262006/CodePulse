package com.codepulse.controller;

import com.codepulse.dto.CodeExecutionDTOs.*;
import com.codepulse.model.Submission;
import com.codepulse.security.UserDetailsImpl;
import com.codepulse.service.SubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SubmissionController {

    @Autowired
    private SubmissionService submissionService;

    @PostMapping("/run")
    public ResponseEntity<ExecutionResult> runCode(@RequestBody ExecutionRequest request) {
        ExecutionResult result = submissionService.runCode(request);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/submit")
    public ResponseEntity<ExecutionResult> submitCode(@RequestBody ExecutionRequest request) {
        ExecutionResult result = submissionService.submitCode(request);
        return ResponseEntity.ok(result);
    }

    @GetMapping
    public ResponseEntity<List<Submission>> getUserSubmissions() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<Submission> submissions = submissionService.getUserSubmissions(userDetails.getId());
        return ResponseEntity.ok(submissions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSubmissionById(@PathVariable Long id) {
        return submissionService.getSubmissionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
