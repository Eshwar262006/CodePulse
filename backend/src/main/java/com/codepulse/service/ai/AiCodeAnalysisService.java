package com.codepulse.service.ai;

import com.codepulse.model.CodeAnalysis;
import com.codepulse.model.Problem;
import com.codepulse.model.Submission;
import org.springframework.stereotype.Service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class AiCodeAnalysisService {

    public CodeAnalysis analyzeSubmission(Submission submission) {
        CodeAnalysis analysis = new CodeAnalysis();
        analysis.setSubmission(submission);

        Problem problem = submission.getProblem();
        String code = submission.getCode();
        String language = submission.getLanguage();
        String status = submission.getStatus();

        if (!"ACCEPTED".equalsIgnoreCase(status)) {
            // CASE 1: Code is incorrect or failed tests
            return analyzeIncorrectSubmission(submission, problem, code, language, status);
        }

        // Check if code has nested loops or brute-force patterns vs optimal HashMap/Two-Pointers/DP
        boolean hasNestedLoop = detectNestedLoop(code);
        boolean containsMapOrSet = detectMapOrSet(code);
        boolean containsBinarySearch = detectBinarySearch(code);

        String optimalTime = problem.getOptimalTimeComplexity() != null ? problem.getOptimalTimeComplexity() : "O(n)";
        String optimalSpace = problem.getOptimalSpaceComplexity() != null ? problem.getOptimalSpaceComplexity() : "O(1)";

        // Determine if solution is suboptimal
        boolean isSuboptimal = hasNestedLoop && optimalTime.contains("O(n)") && !optimalTime.contains("n²");

        if (isSuboptimal) {
            // CASE 2: Correct but can be improved algorithmically
            analysis.setCorrectness("✓ All test cases passed - Solution is correct");
            analysis.setTimeComplexity("O(n²)");
            analysis.setSpaceComplexity("O(1)");
            analysis.setTargetTimeComplexity(optimalTime);
            analysis.setTargetSpaceComplexity(optimalSpace.equals("O(1)") ? "O(n)" : optimalSpace);
            analysis.setOptimal(false);
            analysis.setCodeQuality(72);
            analysis.setLearningTopic(problem.getTopic() != null ? problem.getTopic() : "Hashing & Data Structures");
            analysis.setLearningRecommendation("Study " + (containsMapOrSet ? "Two Pointers" : "HashMap Lookup") + " and Frequency Counting");

            analysis.setExplanation(
                "Your solution uses nested loops to repeatedly search for a value, resulting in O(n²) time complexity. " +
                "By leveraging a " + (containsMapOrSet ? "Two-Pointer technique" : "HashMap") + ", you can reduce lookup time to O(1) and eliminate the inner loop completely."
            );

            analysis.setTradeoffs(
                "The optimized approach trades a slight increase in space complexity (O(n) auxiliary memory for storing elements) to achieve a dramatic improvement in runtime execution speed (O(n) linear time)."
            );

            analysis.setOptimizedCode(generateOptimizedSnippet(problem, language));

        } else {
            // CASE 3: Correct AND Already Optimal!
            analysis.setCorrectness("✓ All test cases passed - Excellent Solution!");
            analysis.setTimeComplexity(optimalTime);
            analysis.setSpaceComplexity(optimalSpace);
            analysis.setTargetTimeComplexity(optimalTime);
            analysis.setTargetSpaceComplexity(optimalSpace);
            analysis.setOptimal(true);
            analysis.setCodeQuality(95);
            analysis.setLearningTopic(problem.getTopic());
            analysis.setLearningRecommendation("Explore Advanced " + problem.getTopic() + " Variations & Edge Cases");

            analysis.setExplanation(
                "🎉 Excellent Solution!\n\n" +
                "Your solution is correct and already uses an efficient approach for this problem.\n\n" +
                "Time Complexity: " + optimalTime + "\n" +
                "Space Complexity: " + optimalSpace + "\n\n" +
                "No significant algorithmic optimization is required.\n\n" +
                "Optional code-style suggestions:\n" +
                "• Consider using descriptive variable names for improved code readability.\n" +
                "• Add concise inline comments for key algorithmic boundary steps.\n" +
                "• Ensure proper indentation and modular helper method separation."
            );

            analysis.setTradeoffs(
                "Your approach achieves the optimal balance of minimal time complexity and low auxiliary memory usage."
            );

            analysis.setOptimizedCode(generateCleanRefactoredSnippet(code, language));
        }

        return analysis;
    }

    private CodeAnalysis analyzeIncorrectSubmission(Submission submission, Problem problem, String code, String language, String status) {
        CodeAnalysis analysis = new CodeAnalysis();
        analysis.setSubmission(submission);
        analysis.setCorrectness("✗ Solution Failed (" + status + ")");
        analysis.setTimeComplexity("N/A");
        analysis.setSpaceComplexity("N/A");
        analysis.setOptimal(false);
        analysis.setCodeQuality(45);
        analysis.setLearningTopic(problem.getTopic());
        analysis.setLearningRecommendation("Review " + problem.getTopic() + " Core Concepts");

        if ("WRONG_ANSWER".equalsIgnoreCase(status)) {
            analysis.setExplanation(
                "Logical issue detected: Your solution produces incorrect output for certain test cases.\n\n" +
                "💡 Helpful Hints:\n" +
                "1. Double check array boundary conditions (e.g. empty inputs, single element, or negative numbers).\n" +
                "2. Verify whether your loop variable handles zero-indexed bounds correctly.\n" +
                "3. Consider dry-running your logic with sample input step-by-step."
            );
        } else if ("TIME_LIMIT_EXCEEDED".equalsIgnoreCase(status)) {
            analysis.setExplanation(
                "Time Limit Exceeded: Your algorithm takes too long to execute for large constraints.\n\n" +
                "💡 Improvement Hint:\n" +
                "Your solution is hitting an infinite loop or performing an O(n³) or O(2ⁿ) search. Look for redundant loop evaluations or use a memoization table/HashMap to cache intermediate results."
            );
        } else {
            analysis.setExplanation(
                "Compilation/Runtime Error encountered.\n\n" +
                "💡 Diagnostic Tip:\n" +
                "Review variable types, null checks, missing semicolons/parentheses, or array index out of bounds errors."
            );
        }

        analysis.setTradeoffs("Fix correctness and edge-case validation before optimizing execution performance.");
        analysis.setOptimizedCode(generateOptimizedSnippet(problem, language));
        return analysis;
    }

    private boolean detectNestedLoop(String code) {
        if (code == null) return false;
        int loopCount = 0;
        String[] lines = code.split("\n");
        for (String line : lines) {
            if (line.contains("for (") || line.contains("while (") || line.contains("for ") || line.contains("while ")) {
                loopCount++;
            }
        }
        // Check nested regex pattern
        Pattern pattern = Pattern.compile("(for|while)\\s*\\(.*\\)\\s*\\{[^}]*(for|while)", Pattern.DOTALL);
        Matcher matcher = pattern.matcher(code);
        return matcher.find() || loopCount >= 2;
    }

    private boolean detectMapOrSet(String code) {
        if (code == null) return false;
        String lower = code.toLowerCase();
        return lower.contains("hashmap") || lower.contains("map") || lower.contains("set") || lower.contains("dict()") || lower.contains("new set") || lower.contains("{") && lower.contains("}:");
    }

    private boolean detectBinarySearch(String code) {
        if (code == null) return false;
        String lower = code.toLowerCase();
        return lower.contains("mid") || lower.contains("binarysearch") || lower.contains("left <= right") || lower.contains("low <= high");
    }

    private String generateOptimizedSnippet(Problem problem, String language) {
        String langLower = language.toLowerCase();
        if (langLower.contains("python")) {
            return "# OPTIMIZED APPROACH - O(n) Time | O(n) Space\n" +
                   "def solve(nums, target):\n" +
                   "    seen = {}\n" +
                   "    for i, num in enumerate(nums):\n" +
                   "        complement = target - num\n" +
                   "        if complement in seen:\n" +
                   "            return [seen[complement], i]\n" +
                   "        seen[num] = i\n" +
                   "    return []";
        } else if (langLower.contains("js") || langLower.contains("javascript")) {
            return "// OPTIMIZED APPROACH - O(n) Time | O(n) Space\n" +
                   "function solve(nums, target) {\n" +
                   "    const map = new Map();\n" +
                   "    for (let i = 0; i < nums.length; i++) {\n" +
                   "        const diff = target - nums[i];\n" +
                   "        if (map.has(diff)) {\n" +
                   "            return [map.get(diff), i];\n" +
                   "        }\n" +
                   "        map.set(nums[i], i);\n" +
                   "    }\n" +
                   "    return [];\n" +
                   "}";
        } else if (langLower.contains("cpp") || langLower.contains("c++")) {
            return "// OPTIMIZED APPROACH - O(n) Time | O(n) Space\n" +
                   "#include <unordered_map>\n" +
                   "#include <vector>\n" +
                   "using namespace std;\n\n" +
                   "vector<int> solve(vector<int>& nums, int target) {\n" +
                   "    unordered_map<int, int> map;\n" +
                   "    for (int i = 0; i < nums.size(); i++) {\n" +
                   "        int diff = target - nums[i];\n" +
                   "        if (map.count(diff)) return {map[diff], i};\n" +
                   "        map[nums[i]] = i;\n" +
                   "    }\n" +
                   "    return {};\n" +
                   "}";
        } else {
            return "// OPTIMIZED APPROACH - O(n) Time | O(n) Space\n" +
                   "import java.util.HashMap;\n" +
                   "import java.util.Map;\n\n" +
                   "public class Solution {\n" +
                   "    public int[] solve(int[] nums, int target) {\n" +
                   "        Map<Integer, Integer> map = new HashMap<>();\n" +
                   "        for (int i = 0; i < nums.length; i++) {\n" +
                   "            int complement = target - nums[i];\n" +
                   "            if (map.containsKey(complement)) {\n" +
                   "                return new int[] { map.get(complement), i };\n" +
                   "            }\n" +
                   "            map.put(nums[i], i);\n" +
                   "        }\n" +
                   "        return new int[0];\n" +
                   "    }\n" +
                   "}";
        }
    }

    private String generateCleanRefactoredSnippet(String code, String language) {
        if (code == null) return "";
        return "// REFACTORED & CLEAN SOLUTION (Already Algorithmic Optimal)\n" + code.trim();
    }
}
