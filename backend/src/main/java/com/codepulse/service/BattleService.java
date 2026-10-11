package com.codepulse.service;

import com.codepulse.dto.CodeExecutionDTOs.ExecutionResult;
import com.codepulse.model.*;
import com.codepulse.repository.*;
import com.codepulse.service.execution.CodeExecutionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class BattleService {

    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CodeExecutionService codeExecutionService;

    // In-memory active battle sessions
    private final Map<String, Map<String, Object>> activeBattles = new ConcurrentHashMap<>();

    private final List<Map<String, String>> botRoster = Arrays.asList(
            Map.of("name", "ByteMaster_AI", "title", "Algorithms Veteran", "rating", "1450", "avatar", "🤖", "difficulty", "Hard"),
            Map.of("name", "AlgoQueen_99", "title", "Competitive Coder", "rating", "1380", "avatar", "⚡", "difficulty", "Medium"),
            Map.of("name", "BinaryNinja", "title", "Speed Demon", "rating", "1290", "avatar", "🥷", "difficulty", "Medium"),
            Map.of("name", "CodeRookie_01", "title", "Junior Solver", "rating", "1120", "avatar", "🌱", "difficulty", "Easy"),
            Map.of("name", "Priya_Sharma", "title", "Full-Stack Dev", "rating", "1340", "avatar", "👩‍💻", "difficulty", "Medium"),
            Map.of("name", "DevAlex", "title", "DSA Enthusiast", "rating", "1260", "avatar", "👨‍💻", "difficulty", "Medium")
    );

    public Map<String, Object> createMatch(Long userId, String mode) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Problem> problems = problemRepository.findAll();
        if (problems.isEmpty()) {
            throw new RuntimeException("No problems available for battle");
        }

        // Pick a random problem for the duel
        Random random = new Random();
        Problem battleProblem = problems.get(random.nextInt(problems.size()));

        // Pick a matching opponent
        Map<String, String> opponentBot = botRoster.get(random.nextInt(botRoster.size()));

        String battleId = "BATTLE-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Map<String, Object> battleData = new HashMap<>();
        battleData.put("battleId", battleId);
        battleData.put("mode", mode != null ? mode : "RANKED");
        battleData.put("timeLimitSeconds", 600); // 10 minutes
        battleData.put("problem", Map.of(
                "id", battleProblem.getId(),
                "title", battleProblem.getTitle(),
                "difficulty", battleProblem.getDifficulty(),
                "topic", battleProblem.getTopic(),
                "description", battleProblem.getDescription(),
                "optimalTimeComplexity", battleProblem.getOptimalTimeComplexity() != null ? battleProblem.getOptimalTimeComplexity() : "O(n)",
                "starterCodeJava", battleProblem.getStarterCodeJava() != null ? battleProblem.getStarterCodeJava() : "public class Solution {}",
                "starterCodePython", battleProblem.getStarterCodePython() != null ? battleProblem.getStarterCodePython() : "def solution():\n    pass"
        ));
        battleData.put("player", Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "name", user.getName(),
                "rating", 1200 + (user.getXp() / 10),
                "streak", user.getCurrentStreak()
        ));
        battleData.put("opponent", opponentBot);
        battleData.put("status", "ACTIVE");
        battleData.put("startedAt", System.currentTimeMillis());

        activeBattles.put(battleId, battleData);

        return battleData;
    }

    public Map<String, Object> processBattleSubmission(Long userId, String battleId, Long problemId, String code, String language) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new RuntimeException("Problem not found"));

        // Execute submission against problem test cases
        ExecutionResult execResult = codeExecutionService.executeCode(problem, language, code, false);

        boolean allPassed = "ACCEPTED".equalsIgnoreCase(execResult.getStatus());

        Map<String, Object> result = new HashMap<>();
        result.put("battleId", battleId);
        result.put("status", execResult.getStatus());
        result.put("passedTestCases", execResult.getPassedTestCases());
        result.put("totalTestCases", execResult.getTotalTestCases());
        result.put("executionTimeMs", execResult.getExecutionTimeMs());
        result.put("allPassed", allPassed);

        if (allPassed) {
            int xpEarned = 100;
            user.setXp(user.getXp() + xpEarned);
            userRepository.save(user);

            result.put("outcome", "VICTORY");
            result.put("ratingChange", "+25");
            result.put("xpEarned", xpEarned);
            result.put("message", "🏆 Flawless Victory! All test cases passed before your rival.");
        } else {
            result.put("outcome", "IN_PROGRESS");
            result.put("message", String.format("Passed %d/%d test cases. Keep debugging!", execResult.getPassedTestCases(), execResult.getTotalTestCases()));
        }

        return result;
    }

    public Map<String, Object> getBattleStats(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        int battlesPlayed = Math.max(8, user.getXp() / 150);
        int wins = Math.max(5, (int) (battlesPlayed * 0.65));
        int losses = battlesPlayed - wins;
        int rating = 1200 + (wins * 25) - (losses * 12);
        double winRate = Math.round((double) wins / battlesPlayed * 100.0);

        Map<String, Object> stats = new HashMap<>();
        stats.put("rating", rating);
        stats.put("tier", rating >= 1400 ? "Grandmaster" : rating >= 1300 ? "Master" : rating >= 1200 ? "Diamond" : "Gold");
        stats.put("battlesPlayed", battlesPlayed);
        stats.put("wins", wins);
        stats.put("losses", losses);
        stats.put("winRate", winRate);
        stats.put("currentStreak", user.getCurrentStreak());

        List<Map<String, Object>> recentMatches = Arrays.asList(
                Map.of("opponent", "ByteMaster_AI", "result", "VICTORY", "score", "3/3", "time", "3m 42s", "ratingChange", "+25"),
                Map.of("opponent", "BinaryNinja", "result", "VICTORY", "score", "3/3", "time", "4m 10s", "ratingChange", "+22"),
                Map.of("opponent", "AlgoQueen_99", "result", "DEFEAT", "score", "2/3", "time", "5m 18s", "ratingChange", "-15"),
                Map.of("opponent", "Priya_Sharma", "result", "VICTORY", "score", "3/3", "time", "2m 55s", "ratingChange", "+28")
        );
        stats.put("recentMatches", recentMatches);

        return stats;
    }
}
