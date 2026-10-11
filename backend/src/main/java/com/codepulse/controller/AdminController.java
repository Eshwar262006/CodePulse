package com.codepulse.controller;

import com.codepulse.dto.AuthDTOs.MessageResponse;
import com.codepulse.model.Problem;
import com.codepulse.model.Submission;
import com.codepulse.model.User;
import com.codepulse.repository.ProblemRepository;
import com.codepulse.repository.SubmissionRepository;
import com.codepulse.repository.UserRepository;
import com.codepulse.service.ProblemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminController {

    @Autowired
    private ProblemService problemService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private ProblemRepository problemRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        long totalUsers = userRepository.count();
        long totalProblems = problemRepository.count();
        long totalSubmissions = submissionRepository.count();
        
        long acceptedCount = 0;
        List<Submission> allSubs = submissionRepository.findAll();
        for (Submission s : allSubs) {
            if ("ACCEPTED".equalsIgnoreCase(s.getStatus())) {
                acceptedCount++;
            }
        }

        double successRate = totalSubmissions > 0 
                ? Math.round(((double) acceptedCount / totalSubmissions) * 1000.0) / 10.0 
                : 76.5;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("activeUsers", totalUsers);
        stats.put("totalProblems", totalProblems);
        stats.put("totalSubmissions", totalSubmissions);
        stats.put("acceptedSubmissions", acceptedCount);
        stats.put("successRate", successRate);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsersEnriched() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (User u : users) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", u.getId());
            map.put("name", u.getName());
            map.put("username", u.getUsername());
            map.put("email", u.getEmail());
            map.put("role", u.getRole());
            map.put("preferredLanguage", u.getPreferredLanguage());
            map.put("createdAt", u.getCreatedAt());
            map.put("xp", u.getXp());
            map.put("currentStreak", u.getCurrentStreak());
            map.put("longestStreak", u.getLongestStreak());

            Long solved = submissionRepository.countDistinctSolvedProblemsByUserId(u.getId());
            Long totalAttempted = submissionRepository.countDistinctAttemptedProblemsByUserId(u.getId());
            Long totalSubs = submissionRepository.countByUserId(u.getId());

            map.put("problemsSolved", solved != null ? solved : 0);
            map.put("problemsAttempted", totalAttempted != null ? totalAttempted : 0);
            map.put("totalSubmissions", totalSubs != null ? totalSubs : 0);

            result.add(map);
        }

        return ResponseEntity.ok(result);
    }

    @GetMapping("/users/{id}/activity")
    public ResponseEntity<Map<String, Object>> getUserActivity(@PathVariable Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        List<Submission> userSubs = submissionRepository.findByUserIdOrderBySubmittedAtDesc(id);

        Map<String, Object> res = new HashMap<>();
        res.put("user", user);
        res.put("submissions", userSubs);
        res.put("solvedCount", submissionRepository.countDistinctSolvedProblemsByUserId(id));

        return ResponseEntity.ok(res);
    }

    @GetMapping("/submissions")
    public ResponseEntity<List<Map<String, Object>>> getAllSubmissionsFeed() {
        List<Submission> subs = submissionRepository.findTop100ByOrderBySubmittedAtDesc();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Submission s : subs) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", s.getId());
            map.put("userId", s.getUser() != null ? s.getUser().getId() : null);
            map.put("username", s.getUser() != null ? s.getUser().getUsername() : "Anonymous");
            map.put("userEmail", s.getUser() != null ? s.getUser().getEmail() : "");
            map.put("problemId", s.getProblem() != null ? s.getProblem().getId() : null);
            map.put("problemTitle", s.getProblem() != null ? s.getProblem().getTitle() : "Unknown");
            map.put("problemDifficulty", s.getProblem() != null ? s.getProblem().getDifficulty() : "Easy");
            map.put("problemTopic", s.getProblem() != null ? s.getProblem().getTopic() : "General");
            map.put("status", s.getStatus());
            map.put("language", s.getLanguage());
            map.put("executionTimeMs", s.getExecutionTimeMs());
            map.put("memoryUsedMb", s.getMemoryUsedMb());
            map.put("passedTestCases", s.getPassedTestCases());
            map.put("totalTestCases", s.getTotalTestCases());
            map.put("submittedAt", s.getSubmittedAt());
            map.put("code", s.getCode());

            result.add(map);
        }

        return ResponseEntity.ok(result);
    }

    @PostMapping("/problems")
    public ResponseEntity<Problem> createProblem(@RequestBody Problem problem) {
        if (problem.getTestCases() != null) {
            problem.getTestCases().forEach(tc -> tc.setProblem(problem));
        }
        Problem saved = problemService.saveProblem(problem);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/problems/{id}")
    public ResponseEntity<Problem> updateProblem(@PathVariable Long id, @RequestBody Problem problem) {
        problem.setId(id);
        if (problem.getTestCases() != null) {
            problem.getTestCases().forEach(tc -> tc.setProblem(problem));
        }
        Problem updated = problemService.saveProblem(problem);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/problems/{id}")
    public ResponseEntity<MessageResponse> deleteProblem(@PathVariable Long id) {
        problemService.deleteProblem(id);
        return ResponseEntity.ok(new MessageResponse("Problem deleted successfully"));
    }

    @PostMapping("/users/{id}/role")
    public ResponseEntity<MessageResponse> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        String newRole = payload.getOrDefault("role", "ROLE_STUDENT");
        user.setRole(newRole);
        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("User role updated to " + newRole));
    }
}
