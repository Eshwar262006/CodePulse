package com.codepulse.service;

import com.codepulse.model.*;
import com.codepulse.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private UserSkillRepository userSkillRepository;

    @Autowired
    private ProblemRepository problemRepository;

    public Map<String, Object> getDashboardAnalytics(Long userId) {
        User user = getUserById(userId);

        Long solvedCount = submissionRepository.countDistinctSolvedProblemsByUserId(userId);
        Long attemptedCount = submissionRepository.countDistinctAttemptedProblemsByUserId(userId);
        Long totalSubmissions = submissionRepository.countByUserId(userId);
        Long acceptedSubmissions = submissionRepository.countByUserIdAndStatus(userId, "ACCEPTED");

        double successRate = totalSubmissions > 0
                ? Math.round(((double) acceptedSubmissions / totalSubmissions) * 100.0)
                : 0.0;

        List<UserSkill> skills = userSkillRepository.findByUserId(userId);
        int skillScore = calculateOverallSkillScore(skills);

        List<String> weakAreas = skills.stream()
                .filter(s -> s.getProblemsAttempted() > 0 && (s.getSkillScore() < 65 || s.getAccuracy() < 60.0))
                .sorted(Comparator.comparingInt(UserSkill::getSkillScore))
                .map(UserSkill::getTopic)
                .limit(5)
                .collect(Collectors.toList());

        List<String> strongAreas = skills.stream()
                .filter(s -> s.getProblemsAttempted() > 0 && s.getSkillScore() >= 65)
                .sorted(Comparator.comparingInt(UserSkill::getSkillScore).reversed())
                .map(UserSkill::getTopic)
                .limit(3)
                .collect(Collectors.toList());

        List<Problem> recommendedProblems = getRecommendedProblems(userId, weakAreas);

        Map<String, Object> data = new HashMap<>();
        data.put("problemsSolved", solvedCount);
        data.put("problemsAttempted", attemptedCount);
        data.put("successRate", successRate);
        data.put("currentStreak", user.getCurrentStreak());
        data.put("longestStreak", user.getLongestStreak());
        data.put("codingTimeHours", Math.round(user.getTotalCodingTimeMinutes() / 60.0 * 10.0) / 10.0);
        data.put("skillScore", skillScore);
        data.put("weakAreas", weakAreas);
        data.put("strongAreas", strongAreas);
        data.put("recommendedPractice", recommendedProblems);
        data.put("xp", user.getXp());

        return data;
    }

    public Map<String, Object> getDetailedAnalytics(Long userId) {
        List<UserSkill> skills = userSkillRepository.findByUserId(userId);
        int currentSkillScore = calculateOverallSkillScore(skills);

        Map<String, Object> data = new HashMap<>();
        data.put("skillScore", currentSkillScore);
        data.put("solvedTrend", buildSolvedTrend(userId));
        data.put("accuracyBreakdown", buildAccuracyBreakdown(userId));
        data.put("difficultyBreakdown", buildDifficultyBreakdown(userId));
        data.put("skillImprovement", estimateSkillImprovement(skills, currentSkillScore));
        data.put("focusSuggestions", generateTopicFocusSuggestions(userId, skills));

        return data;
    }

    public List<Map<String, Object>> generateTopicFocusSuggestions(Long userId, List<UserSkill> skills) {
        List<Long> solvedIds = submissionRepository.findSolvedProblemIdsByUserId(userId);
        Set<Long> solvedSet = new HashSet<>(solvedIds);
        List<Problem> allProblems = problemRepository.findAll();

        Map<String, UserSkill> skillMap = skills.stream()
                .collect(Collectors.toMap(UserSkill::getTopic, s -> s, (a, b) -> a));

        List<String> coreTopics = Arrays.asList(
                "Dynamic Programming", "Graphs", "Trees", "Recursion", "Stack", 
                "Linked Lists", "Arrays", "Strings", "Searching", "Sorting", "Greedy", "Queue", "Hashing"
        );

        List<Map<String, Object>> suggestions = new ArrayList<>();

        for (String topic : coreTopics) {
            UserSkill skill = skillMap.get(topic);
            int score = skill != null ? skill.getSkillScore() : 50;
            int attempted = skill != null ? skill.getProblemsAttempted() : 0;
            int solved = skill != null ? skill.getProblemsSolved() : 0;
            double accuracy = skill != null ? skill.getAccuracy() : 0.0;

            String priority;
            String priorityLabel;
            String diagnosis;
            List<String> keyConcepts;
            String actionItem;

            if (attempted > 0 && (score < 60 || accuracy < 50.0)) {
                priority = "HIGH";
                priorityLabel = "Urgent Focus";
                diagnosis = String.format("Current accuracy is only %.1f%% (%d/%d solved). Frequent errors indicate struggle with core patterns and edge cases in %s.", accuracy, solved, attempted, topic);
                keyConcepts = getKeyConceptsForTopic(topic);
                actionItem = String.format("Review fundamental %s patterns and start with Easy/Medium problems before attempting Hard.", topic);
            } else if (attempted == 0) {
                priority = "MEDIUM";
                priorityLabel = "Unexplored Topic";
                diagnosis = String.format("You haven't attempted %s problems yet. This topic is heavily tested in technical interviews.", topic);
                keyConcepts = getKeyConceptsForTopic(topic);
                actionItem = String.format("Start with 2-3 foundational %s challenges to build basic intuition.", topic);
            } else if (score < 75 || accuracy < 75.0) {
                priority = "MEDIUM";
                priorityLabel = "Needs Polish";
                diagnosis = String.format("Moderate performance (%d/%d solved, %.1f%% accuracy). Ready to graduate from basic to advanced %s patterns.", solved, attempted, accuracy, topic);
                keyConcepts = getKeyConceptsForTopic(topic);
                actionItem = String.format("Practice time-constrained Medium %s problems to enhance speed.", topic);
            } else {
                priority = "LOW";
                priorityLabel = "Strong Mastery";
                diagnosis = String.format("Strong command (%d/%d solved, %.1f%% accuracy). Keep sharp with advanced optimization techniques.", solved, attempted, accuracy);
                keyConcepts = getKeyConceptsForTopic(topic);
                actionItem = String.format("Tackle Hard %s problems and analyze O(1) space optimization tradeoffs.", topic);
            }

            // Find recommended unsolved problems for this topic
            List<Map<String, Object>> recommendedProblems = allProblems.stream()
                    .filter(p -> topic.equalsIgnoreCase(p.getTopic()) && !solvedSet.contains(p.getId()))
                    .limit(3)
                    .map(p -> {
                        Map<String, Object> pm = new HashMap<>();
                        pm.put("id", p.getId());
                        pm.put("title", p.getTitle());
                        pm.put("difficulty", p.getDifficulty());
                        pm.put("topic", p.getTopic());
                        pm.put("optimalTimeComplexity", p.getOptimalTimeComplexity());
                        return pm;
                    })
                    .collect(Collectors.toList());

            Map<String, Object> suggestion = new HashMap<>();
            suggestion.put("topic", topic);
            suggestion.put("priority", priority);
            suggestion.put("priorityLabel", priorityLabel);
            suggestion.put("skillScore", score);
            suggestion.put("accuracy", accuracy);
            suggestion.put("problemsSolved", solved);
            suggestion.put("problemsAttempted", attempted);
            suggestion.put("diagnosis", diagnosis);
            suggestion.put("keyConcepts", keyConcepts);
            suggestion.put("actionItem", actionItem);
            suggestion.put("recommendedProblems", recommendedProblems);

            suggestions.add(suggestion);
        }

        // Sort by priority (HIGH -> MEDIUM -> LOW), then by lowest score
        suggestions.sort((a, b) -> {
            int p1 = "HIGH".equals(a.get("priority")) ? 0 : "MEDIUM".equals(a.get("priority")) ? 1 : 2;
            int p2 = "HIGH".equals(b.get("priority")) ? 0 : "MEDIUM".equals(b.get("priority")) ? 1 : 2;
            if (p1 != p2) return Integer.compare(p1, p2);
            return Integer.compare((Integer) a.get("skillScore"), (Integer) b.get("skillScore"));
        });

        return suggestions;
    }

    private List<String> getKeyConceptsForTopic(String topic) {
        switch (topic) {
            case "Dynamic Programming":
                return Arrays.asList("1D/2D Memoization Tables", "State Transition Functions", "Optimal Substructure", "Space Compression");
            case "Graphs":
                return Arrays.asList("BFS Shortest Path", "DFS Cycle Detection", "Topological Sort", "Disjoint Set (Union-Find)");
            case "Trees":
                return Arrays.asList("Tree Traversals (In/Pre/Post/Level)", "BST Invariant Properties", "Lowest Common Ancestor", "Tree Depth / Height");
            case "Stack":
                return Arrays.asList("Monotonic Stack", "Matching Parentheses", "Postfix Expression Evaluation", "Next Greater Element");
            case "Linked Lists":
                return Arrays.asList("Fast & Slow Pointers", "In-place Reversal", "Dummy Head Nodes", "Cycle Detection (Floyd's)");
            case "Recursion":
                return Arrays.asList("Base Case Identification", "Backtracking State Reversion", "Permutations & Subsets", "Call Stack Management");
            case "Arrays":
                return Arrays.asList("Two Pointers Technique", "Sliding Window", "Prefix Sum Arrays", "Kadane's Algorithm");
            case "Strings":
                return Arrays.asList("Character Frequency Tables", "Palindrome Pointers", "String Hashing / Rolling Hash", "Substring Windows");
            case "Searching":
                return Arrays.asList("Binary Search Boundaries", "Search in Rotated Space", "Bit Manipulation / Masking", "Predicate Search");
            case "Sorting":
                return Arrays.asList("Interval Merging", "Custom Comparators", "Quickselect for Kth Element", "Bucket / Counting Sort");
            case "Greedy":
                return Arrays.asList("Greedy Choice Property", "Interval Scheduling", "Optimal Caching / Frequency", "Jump Game / Interval Elimination");
            default:
                return Arrays.asList("Time Complexity Bounds", "Space Optimization", "Edge Case Handling", "Optimal Data Structures");
        }
    }

    private User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }

    private int calculateOverallSkillScore(List<UserSkill> skills) {
        if (skills.isEmpty()) return 0;
        return (int) Math.round(skills.stream()
                .filter(s -> s.getProblemsAttempted() > 0)
                .mapToInt(UserSkill::getSkillScore)
                .average()
                .orElse(0));
    }

    private List<Problem> getRecommendedProblems(Long userId, List<String> weakAreas) {
        List<Long> solvedIds = submissionRepository.findSolvedProblemIdsByUserId(userId);
        Set<Long> solvedSet = new HashSet<>(solvedIds);

        List<Problem> unsolved = problemRepository.findAll().stream()
                .filter(p -> !solvedSet.contains(p.getId()))
                .collect(Collectors.toList());

        if (unsolved.isEmpty()) {
            return Collections.emptyList();
        }

        List<Problem> fromWeakAreas = unsolved.stream()
                .filter(p -> weakAreas.contains(p.getTopic()))
                .limit(4)
                .collect(Collectors.toList());

        if (!fromWeakAreas.isEmpty()) {
            return fromWeakAreas;
        }

        return unsolved.stream().limit(4).collect(Collectors.toList());
    }

    private List<Map<String, Object>> buildSolvedTrend(Long userId) {
        LocalDateTime weekStart = LocalDate.now()
                .with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
                .atStartOfDay();

        List<Submission> recentAccepted = submissionRepository
                .findByUserIdAndSubmittedAtAfterOrderBySubmittedAtAsc(userId, weekStart)
                .stream()
                .filter(s -> "ACCEPTED".equalsIgnoreCase(s.getStatus()))
                .collect(Collectors.toList());

        Map<LocalDate, Long> solvedByDay = recentAccepted.stream()
                .collect(Collectors.groupingBy(
                        s -> s.getSubmittedAt().toLocalDate(),
                        Collectors.counting()
                ));

        List<Map<String, Object>> trend = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            LocalDate day = weekStart.toLocalDate().plusDays(i);
            String label = day.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            trend.add(Map.of(
                    "date", label,
                    "solved", solvedByDay.getOrDefault(day, 0L)
            ));
        }
        return trend;
    }

    private List<Map<String, Object>> buildAccuracyBreakdown(Long userId) {
        List<Object[]> rows = submissionRepository.countGroupByStatusForUser(userId);
        if (rows.isEmpty()) {
            return Collections.emptyList();
        }

        Map<String, String> colors = Map.of(
                "ACCEPTED", "#10b981",
                "WRONG_ANSWER", "#f43f5e",
                "TIME_LIMIT_EXCEEDED", "#f59e0b",
                "RUNTIME_ERROR", "#8b5cf6",
                "COMPILATION_ERROR", "#6366f1"
        );

        Map<String, String> labels = Map.of(
                "ACCEPTED", "Accepted",
                "WRONG_ANSWER", "Wrong Answer",
                "TIME_LIMIT_EXCEEDED", "Time Limit",
                "RUNTIME_ERROR", "Runtime Error",
                "COMPILATION_ERROR", "Compilation Error"
        );

        long total = rows.stream().mapToLong(r -> (Long) r[1]).sum();

        return rows.stream()
                .map(r -> {
                    String status = (String) r[0];
                    long count = (Long) r[1];
                    int pct = total > 0 ? (int) Math.round((count * 100.0) / total) : 0;
                    Map<String, Object> item = new HashMap<>();
                    item.put("name", labels.getOrDefault(status, status));
                    item.put("value", pct);
                    item.put("color", colors.getOrDefault(status, "#94a3b8"));
                    return item;
                })
                .collect(Collectors.toList());
    }

    private List<Map<String, Object>> buildDifficultyBreakdown(Long userId) {
        List<Object[]> rows = submissionRepository.countSolvedByDifficultyForUser(userId);
        return rows.stream()
                .map(r -> Map.<String, Object>of(
                        "difficulty", r[0],
                        "count", r[1]
                ))
                .collect(Collectors.toList());
    }

    private Map<String, Object> estimateSkillImprovement(List<UserSkill> skills, int currentScore) {
        int attemptedTopics = (int) skills.stream().filter(s -> s.getProblemsAttempted() > 0).count();
        int previousScore = Math.max(0, currentScore - Math.min(attemptedTopics * 3, 15));
        int improvement = currentScore - previousScore;
        double improvementPct = previousScore > 0
                ? Math.round((improvement * 100.0 / previousScore) * 10.0) / 10.0
                : (currentScore > 0 ? 100.0 : 0.0);

        Map<String, Object> result = new HashMap<>();
        result.put("previousScore", previousScore);
        result.put("currentScore", currentScore);
        result.put("improvement", improvement);
        result.put("improvementPct", improvementPct);
        return result;
    }
}
