package com.codepulse.config;

import com.codepulse.model.*;
import com.codepulse.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private AchievementRepository achievementRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private UserSkillRepository userSkillRepository;

    @Autowired
    private UserAchievementRepository userAchievementRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
        seedAchievements();
        if (problemRepository.count() < 100) {
            seed100Problems();
        }
        seed50SolvedUser();
        seedLearnerUser();
    }

    private void seedLearnerUser() {
        User learner = userRepository.findByUsername("coder_sam").orElse(null);
        if (learner == null) {
            learner = new User(
                    "Sam Learner",
                    "coder_sam",
                    "sam@codepulse.com",
                    passwordEncoder.encode("sam123"),
                    "ROLE_STUDENT",
                    "Python"
            );
            learner.setXp(1450);
            learner.setCurrentStreak(5);
            learner.setLongestStreak(9);
            learner.setTotalCodingTimeMinutes(870);
            learner = userRepository.save(learner);
        }

        if (submissionRepository.countByUserId(learner.getId()) == 0) {
            List<Problem> problems = problemRepository.findAll();
            Random random = new Random(99);

            // 1. Solve 18 problems successfully (Accepted on first or second try)
            for (int i = 0; i < Math.min(18, problems.size()); i++) {
                Problem p = problems.get(i);

                // Add a preliminary WRONG_ANSWER submission on every second problem
                if (i % 2 == 0) {
                    Submission failSub = new Submission();
                    failSub.setUser(learner);
                    failSub.setProblem(p);
                    failSub.setLanguage("Python");
                    failSub.setCode("def solution():\n    # Attempt with bug\n    return -1");
                    failSub.setStatus("WRONG_ANSWER");
                    failSub.setExecutionTimeMs(45L);
                    failSub.setMemoryUsedMb(22.4);
                    failSub.setPassedTestCases(1);
                    failSub.setTotalTestCases(3);
                    failSub.setSubmittedAt(LocalDateTime.now().minusDays(20 - (i / 2)).minusHours(4));
                    submissionRepository.save(failSub);
                }

                // Accepted submission
                Submission passSub = new Submission();
                passSub.setUser(learner);
                passSub.setProblem(p);
                passSub.setLanguage("Python");
                passSub.setCode(p.getStarterCodePython() != null ? p.getStarterCodePython() : "def solution():\n    pass");
                passSub.setStatus("ACCEPTED");
                passSub.setExecutionTimeMs(28L + random.nextInt(40));
                passSub.setMemoryUsedMb(24.1 + (random.nextDouble() * 3.0));
                passSub.setPassedTestCases(3);
                passSub.setTotalTestCases(3);
                passSub.setSubmittedAt(LocalDateTime.now().minusDays(20 - (i / 2)));

                CodeAnalysis ca = new CodeAnalysis();
                ca.setSubmission(passSub);
                ca.setCorrectness("ACCEPTABLE");
                ca.setTimeComplexity(p.getOptimalTimeComplexity() != null ? p.getOptimalTimeComplexity() : "O(n)");
                ca.setSpaceComplexity(p.getOptimalSpaceComplexity() != null ? p.getOptimalSpaceComplexity() : "O(1)");
                ca.setTargetTimeComplexity(p.getOptimalTimeComplexity() != null ? p.getOptimalTimeComplexity() : "O(n)");
                ca.setTargetSpaceComplexity(p.getOptimalSpaceComplexity() != null ? p.getOptimalSpaceComplexity() : "O(1)");
                ca.setCodeQuality(76 + random.nextInt(15));
                ca.setOptimal(i % 3 == 0);
                ca.setExplanation("Solution is functional and passes all tests with slight room for memory optimization.");
                ca.setLearningTopic(p.getTopic());
                ca.setTradeoffs("Straightforward approach; can be optimized further with memoization/pointers.");

                passSub.setAnalysis(ca);
                submissionRepository.save(passSub);
            }

            // 2. Add 8 problems attempted but NOT solved yet (TLE, Wrong Answer, Compilation Error)
            for (int i = 18; i < Math.min(26, problems.size()); i++) {
                Problem p = problems.get(i);
                String status = (i % 3 == 0) ? "TIME_LIMIT_EXCEEDED" : (i % 3 == 1) ? "WRONG_ANSWER" : "COMPILATION_ERROR";

                Submission unSub = new Submission();
                unSub.setUser(learner);
                unSub.setProblem(p);
                unSub.setLanguage("Python");
                unSub.setCode("# Incomplete or brute force solution\ndef solve():\n    pass");
                unSub.setStatus(status);
                unSub.setExecutionTimeMs(status.equals("TIME_LIMIT_EXCEEDED") ? 2000L : 35L);
                unSub.setMemoryUsedMb(26.0);
                unSub.setPassedTestCases(status.equals("WRONG_ANSWER") ? 1 : 0);
                unSub.setTotalTestCases(3);
                unSub.setSubmittedAt(LocalDateTime.now().minusDays(26 - i).minusHours(2));
                submissionRepository.save(unSub);
            }

            // 3. UserSkills: Strong in Arrays, Strings; Moderate in Stack, Recursion; Weak in Dynamic Programming, Graphs
            userSkillRepository.save(new UserSkill(learner, "Arrays", 78, 8, 6, 75.0));
            userSkillRepository.save(new UserSkill(learner, "Strings", 74, 6, 5, 83.3));
            userSkillRepository.save(new UserSkill(learner, "Stack", 62, 5, 3, 60.0));
            userSkillRepository.save(new UserSkill(learner, "Recursion", 65, 4, 2, 50.0));
            userSkillRepository.save(new UserSkill(learner, "Dynamic Programming", 44, 6, 1, 16.7));
            userSkillRepository.save(new UserSkill(learner, "Graphs", 38, 5, 1, 20.0));
            userSkillRepository.save(new UserSkill(learner, "Trees", 52, 4, 2, 50.0));

            // 4. Achievements
            List<Achievement> achievements = achievementRepository.findAll();
            for (Achievement a : achievements) {
                if ("PROBLEMS_SOLVED".equals(a.getCriteriaType()) && a.getCriteriaValue() <= 10) {
                    userAchievementRepository.save(new UserAchievement(learner, a));
                } else if ("STREAK_DAYS".equals(a.getCriteriaType()) && a.getCriteriaValue() <= 5) {
                    userAchievementRepository.save(new UserAchievement(learner, a));
                }
            }
        }
    }

    private void seed50SolvedUser() {
        User proUser = userRepository.findByUsername("pro_coder").orElse(null);
        if (proUser == null) {
            proUser = new User(
                    "Alex Master",
                    "pro_coder",
                    "procoder@codepulse.com",
                    passwordEncoder.encode("coder123"),
                    "ROLE_STUDENT",
                    "Java"
            );
            proUser.setXp(3500);
            proUser.setCurrentStreak(14);
            proUser.setLongestStreak(21);
            proUser.setTotalCodingTimeMinutes(1980);
            proUser = userRepository.save(proUser);
        }

        if (submissionRepository.countByUserId(proUser.getId()) < 50) {
            List<Problem> problems = problemRepository.findAll();
            int count = Math.min(50, problems.size());
            Random random = new Random(42);

            for (int i = 0; i < count; i++) {
                Problem p = problems.get(i);

                Submission sub = new Submission();
                sub.setUser(proUser);
                sub.setProblem(p);
                sub.setLanguage("Java");
                sub.setCode(p.getStarterCodeJava() != null ? p.getStarterCodeJava() : "public class Solution {}");
                sub.setStatus("ACCEPTED");
                sub.setExecutionTimeMs(12L + random.nextInt(45));
                sub.setMemoryUsedMb(38.0 + (random.nextDouble() * 4.5));
                sub.setPassedTestCases(3);
                sub.setTotalTestCases(3);
                sub.setSubmittedAt(LocalDateTime.now().minusDays(50 - i).minusHours(random.nextInt(12)));

                CodeAnalysis ca = new CodeAnalysis();
                ca.setSubmission(sub);
                ca.setCorrectness("OPTIMAL");
                ca.setTimeComplexity(p.getOptimalTimeComplexity() != null ? p.getOptimalTimeComplexity() : "O(n)");
                ca.setSpaceComplexity(p.getOptimalSpaceComplexity() != null ? p.getOptimalSpaceComplexity() : "O(1)");
                ca.setTargetTimeComplexity(p.getOptimalTimeComplexity() != null ? p.getOptimalTimeComplexity() : "O(n)");
                ca.setTargetSpaceComplexity(p.getOptimalSpaceComplexity() != null ? p.getOptimalSpaceComplexity() : "O(1)");
                ca.setCodeQuality(90 + random.nextInt(10));
                ca.setOptimal(true);
                ca.setExplanation("Optimal algorithm implementation meeting time and space constraints.");
                ca.setLearningTopic(p.getTopic());
                ca.setTradeoffs("Optimal solution utilizing efficient data structures.");

                sub.setAnalysis(ca);
                submissionRepository.save(sub);
            }

            // Seed Skill proficiencies across DSA topics
            String[] topics = {"Arrays", "Strings", "Linked Lists", "Stack", "Queue", "Trees", "Graphs", "Sorting", "Searching", "Hashing", "Recursion", "Greedy", "Dynamic Programming"};
            for (String topic : topics) {
                if (userSkillRepository.findByUserIdAndTopic(proUser.getId(), topic).isEmpty()) {
                    int solved = 3 + random.nextInt(4);
                    int attempted = solved + (random.nextInt(2));
                    int score = 80 + random.nextInt(16);
                    double accuracy = Math.round(((double) solved / attempted * 100.0) * 10.0) / 10.0;
                    userSkillRepository.save(new UserSkill(proUser, topic, score, attempted, solved, accuracy));
                }
            }

            // Seed unlocked achievements
            List<Achievement> achievements = achievementRepository.findAll();
            for (Achievement a : achievements) {
                if (userAchievementRepository.findByUserIdAndAchievementId(proUser.getId(), a.getId()).isEmpty()) {
                    if ("PROBLEMS_SOLVED".equals(a.getCriteriaType()) && a.getCriteriaValue() <= 50) {
                        userAchievementRepository.save(new UserAchievement(proUser, a));
                    } else if ("STREAK_DAYS".equals(a.getCriteriaType()) && a.getCriteriaValue() <= 14) {
                        userAchievementRepository.save(new UserAchievement(proUser, a));
                    } else if ("OPTIMIZATION_COUNT".equals(a.getCriteriaType())) {
                        userAchievementRepository.save(new UserAchievement(proUser, a));
                    }
                }
            }
        }
    }

    private void seed100Problems() {
        List<Problem> allProblems = ProblemCatalog.getAll100Problems();
        for (Problem p : allProblems) {
            if (!problemRepository.existsByTitle(p.getTitle())) {
                problemRepository.save(p);
            }
        }
    }

    private void seedUsers() {
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User(
                    "System Admin",
                    "admin",
                    "admin@codepulse.com",
                    passwordEncoder.encode("admin123"),
                    "ROLE_ADMIN",
                    "Java"
            );
            userRepository.save(admin);
        }

        if (!userRepository.existsByUsername("student")) {
            User student = new User(
                    "Alex Student",
                    "student",
                    "student@codepulse.com",
                    passwordEncoder.encode("student123"),
                    "ROLE_STUDENT",
                    "Java"
            );
            userRepository.save(student);
        }
    }

    private void seedAchievements() {
        if (achievementRepository.count() == 0) {
            List<Achievement> achievements = Arrays.asList(
                new Achievement("First Problem", "Solved your first coding problem on CodePulse", "PROBLEMS_SOLVED", 1, "Zap"),
                new Achievement("10 Problems Solved", "Completed 10 programming challenges", "PROBLEMS_SOLVED", 10, "Award"),
                new Achievement("50 Problems Solved", "Reached half a century of coding mastery", "PROBLEMS_SOLVED", 50, "Trophy"),
                new Achievement("100 Problems Solved", "Achieved 100 solved problems milestone", "PROBLEMS_SOLVED", 100, "Crown"),
                new Achievement("7 Day Streak", "Maintained an active coding streak for 7 consecutive days", "STREAK_DAYS", 7, "Flame"),
                new Achievement("30 Day Streak", "Unstoppable! Solved problems for 30 consecutive days", "STREAK_DAYS", 30, "Fire"),
                new Achievement("Optimization Master", "Reduced O(n²) solution down to O(n) or O(1) space/time", "OPTIMIZATION_COUNT", 5, "Sparkles")
            );
            achievementRepository.saveAll(achievements);
        }
    }

    private void seed20Problems() {
        List<Problem> problems = new ArrayList<>();

        // 1. Two Sum (Arrays / Hashing)
        Problem p1 = new Problem();
        p1.setTitle("Two Sum");
        p1.setDescription("Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.");
        p1.setDifficulty("Easy");
        p1.setTopic("Arrays");
        p1.setOptimalTimeComplexity("O(n)");
        p1.setOptimalSpaceComplexity("O(n)");
        p1.setConstraints("2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9");
        p1.setInputFormat("First line contains target. Second line contains space-separated integers for nums array.");
        p1.setOutputFormat("Space-separated indices [i, j]");
        p1.setStarterCodeJava("public class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n        return new int[]{0, 1};\n    }\n}");
        p1.setStarterCodePython("def twoSum(nums, target):\n    # Your code here\n    return [0, 1]");
        p1.setStarterCodeCpp("vector<int> twoSum(vector<int>& nums, int target) {\n    // Your code here\n    return {0, 1};\n}");
        p1.setStarterCodeJs("function twoSum(nums, target) {\n    // Your code here\n    return [0, 1];\n}");
        p1.getTestCases().add(new TestCase(p1, "9\n2 7 11 15", "0 1", false));
        p1.getTestCases().add(new TestCase(p1, "6\n3 2 4", "1 2", false));
        p1.getTestCases().add(new TestCase(p1, "6\n3 3", "0 1", true));
        problems.add(p1);

        // 2. Valid Palindrome (Strings)
        Problem p2 = new Problem();
        p2.setTitle("Valid Palindrome");
        p2.setDescription("A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.");
        p2.setDifficulty("Easy");
        p2.setTopic("Strings");
        p2.setOptimalTimeComplexity("O(n)");
        p2.setOptimalSpaceComplexity("O(1)");
        p2.setStarterCodeJava("public class Solution {\n    public boolean isPalindrome(String s) {\n        // Code here\n        return true;\n    }\n}");
        p2.setStarterCodePython("def isPalindrome(s: str) -> bool:\n    # Code here\n    return True");
        p2.setStarterCodeCpp("bool isPalindrome(string s) {\n    return true;\n}");
        p2.setStarterCodeJs("function isPalindrome(s) {\n    return true;\n}");
        p2.getTestCases().add(new TestCase(p2, "A man, a plan, a canal: Panama", "true", false));
        p2.getTestCases().add(new TestCase(p2, "race a car", "false", false));
        problems.add(p2);

        // 3. Reverse Linked List (Linked Lists)
        Problem p3 = new Problem();
        p3.setTitle("Reverse Linked List");
        p3.setDescription("Given the head of a singly linked list, reverse the list, and return the reversed list.");
        p3.setDifficulty("Easy");
        p3.setTopic("Linked Lists");
        p3.setOptimalTimeComplexity("O(n)");
        p3.setOptimalSpaceComplexity("O(1)");
        p3.setStarterCodeJava("public class Solution {\n    public ListNode reverseList(ListNode head) {\n        // Your code here\n        return head;\n    }\n}");
        p3.setStarterCodePython("def reverseList(head):\n    # Code here\n    return head");
        p3.getTestCases().add(new TestCase(p3, "1 2 3 4 5", "5 4 3 2 1", false));
        p3.getTestCases().add(new TestCase(p3, "1 2", "2 1", false));
        problems.add(p3);

        // 4. Valid Parentheses (Stack)
        Problem p4 = new Problem();
        p4.setTitle("Valid Parentheses");
        p4.setDescription("Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.");
        p4.setDifficulty("Easy");
        p4.setTopic("Stack");
        p4.setOptimalTimeComplexity("O(n)");
        p4.setOptimalSpaceComplexity("O(n)");
        p4.setStarterCodeJava("public class Solution {\n    public boolean isValid(String s) {\n        return true;\n    }\n}");
        p4.getTestCases().add(new TestCase(p4, "()[]{}", "true", false));
        p4.getTestCases().add(new TestCase(p4, "(]", "false", false));
        problems.add(p4);

        // 5. Implement Queue using Stacks (Queue)
        Problem p5 = new Problem();
        p5.setTitle("Implement Queue using Stacks");
        p5.setDescription("Implement a first in first out (FIFO) queue using only two stacks.");
        p5.setDifficulty("Easy");
        p5.setTopic("Queue");
        p5.setOptimalTimeComplexity("O(1) amortized");
        p5.setOptimalSpaceComplexity("O(n)");
        p5.setStarterCodeJava("class MyQueue {\n    public MyQueue() {}\n    public void push(int x) {}\n    public int pop() { return 0; }\n}");
        p5.getTestCases().add(new TestCase(p5, "push 1, push 2, pop", "1", false));
        problems.add(p5);

        // 6. Maximum Depth of Binary Tree (Trees)
        Problem p6 = new Problem();
        p6.setTitle("Maximum Depth of Binary Tree");
        p6.setDescription("Given the root of a binary tree, return its maximum depth.");
        p6.setDifficulty("Easy");
        p6.setTopic("Trees");
        p6.setOptimalTimeComplexity("O(n)");
        p6.setOptimalSpaceComplexity("O(h)");
        p6.setStarterCodeJava("public class Solution {\n    public int maxDepth(TreeNode root) {\n        return 0;\n    }\n}");
        p6.getTestCases().add(new TestCase(p6, "3 9 20 null null 15 7", "3", false));
        problems.add(p6);

        // 7. Number of Islands (Graphs)
        Problem p7 = new Problem();
        p7.setTitle("Number of Islands");
        p7.setDescription("Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.");
        p7.setDifficulty("Medium");
        p7.setTopic("Graphs");
        p7.setOptimalTimeComplexity("O(m * n)");
        p7.setOptimalSpaceComplexity("O(m * n)");
        p7.setStarterCodeJava("public class Solution {\n    public int numIslands(char[][] grid) {\n        return 0;\n    }\n}");
        p7.getTestCases().add(new TestCase(p7, "4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0", "1", false));
        problems.add(p7);

        // 8. Merge Sort Array (Sorting)
        Problem p8 = new Problem();
        p8.setTitle("Merge Sorted Array");
        p8.setDescription("You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n. Merge nums1 and nums2 into a single sorted array.");
        p8.setDifficulty("Easy");
        p8.setTopic("Sorting");
        p8.setOptimalTimeComplexity("O(m + n)");
        p8.setOptimalSpaceComplexity("O(1)");
        p8.setStarterCodeJava("public class Solution {\n    public void merge(int[] nums1, int m, int[] nums2, int n) {}\n}");
        p8.getTestCases().add(new TestCase(p8, "1 2 3 0 0 0\n2 5 6", "1 2 2 3 5 6", false));
        problems.add(p8);

        // 9. Binary Search (Searching)
        Problem p9 = new Problem();
        p9.setTitle("Binary Search");
        p9.setDescription("Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums.");
        p9.setDifficulty("Easy");
        p9.setTopic("Searching");
        p9.setOptimalTimeComplexity("O(log n)");
        p9.setOptimalSpaceComplexity("O(1)");
        p9.setStarterCodeJava("public class Solution {\n    public int search(int[] nums, int target) {\n        return -1;\n    }\n}");
        p9.getTestCases().add(new TestCase(p9, "9\n-1 0 3 5 9 12", "4", false));
        problems.add(p9);

        // 10. Group Anagrams (Hashing)
        Problem p10 = new Problem();
        p10.setTitle("Group Anagrams");
        p10.setDescription("Given an array of strings strs, group the anagrams together. You can return the answer in any order.");
        p10.setDifficulty("Medium");
        p10.setTopic("Hashing");
        p10.setOptimalTimeComplexity("O(n * k log k)");
        p10.setOptimalSpaceComplexity("O(n * k)");
        p10.setStarterCodeJava("public class Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        return new ArrayList<>();\n    }\n}");
        p10.getTestCases().add(new TestCase(p10, "eat tea tan ate nat bat", "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]", false));
        problems.add(p10);

        // 11. Fibonnaci Number (Recursion)
        Problem p11 = new Problem();
        p11.setTitle("Fibonacci Number");
        p11.setDescription("The Fibonacci numbers form a sequence such that F(n) = F(n-1) + F(n-2). Given n, calculate F(n).");
        p11.setDifficulty("Easy");
        p11.setTopic("Recursion");
        p11.setOptimalTimeComplexity("O(n)");
        p11.setOptimalSpaceComplexity("O(1)");
        p11.setStarterCodeJava("public class Solution {\n    public int fib(int n) {\n        return 0;\n    }\n}");
        p11.getTestCases().add(new TestCase(p11, "4", "3", false));
        problems.add(p11);

        // 12. Jump Game (Greedy)
        Problem p12 = new Problem();
        p12.setTitle("Jump Game");
        p12.setDescription("You are given an integer array nums. You are initially positioned at the array's first index, and each element represents your maximum jump length. Return true if you can reach the last index.");
        p12.setDifficulty("Medium");
        p12.setTopic("Greedy");
        p12.setOptimalTimeComplexity("O(n)");
        p12.setOptimalSpaceComplexity("O(1)");
        p12.setStarterCodeJava("public class Solution {\n    public boolean canJump(int[] nums) {\n        return true;\n    }\n}");
        p12.getTestCases().add(new TestCase(p12, "2 3 1 1 4", "true", false));
        p12.getTestCases().add(new TestCase(p12, "3 2 1 0 4", "false", false));
        problems.add(p12);

        // 13. Longest Subarray With Sum K (Arrays + Hashing)
        Problem p13 = new Problem();
        p13.setTitle("Longest Subarray With Sum K");
        p13.setDescription("Given an array containing N integers and an integer K, find the length of the longest Sub-Array with the sum of elements equal to the given value K.");
        p13.setDifficulty("Medium");
        p13.setTopic("Arrays");
        p13.setOptimalTimeComplexity("O(n)");
        p13.setOptimalSpaceComplexity("O(n)");
        p13.setStarterCodeJava("public class Solution {\n    public int lenOfLongSubarr(int[] A, int N, int K) {\n        return 0;\n    }\n}");
        p13.getTestCases().add(new TestCase(p13, "10 5 2 7 1 9\n15", "4", false));
        problems.add(p13);

        // 14. Coin Change (Dynamic Programming)
        Problem p14 = new Problem();
        p14.setTitle("Coin Change");
        p14.setDescription("You are given an integer array coins representing coins of different denominations and an integer amount. Return the fewest number of coins that you need to make up that amount.");
        p14.setDifficulty("Medium");
        p14.setTopic("Dynamic Programming");
        p14.setOptimalTimeComplexity("O(amount * n)");
        p14.setOptimalSpaceComplexity("O(amount)");
        p14.setStarterCodeJava("public class Solution {\n    public int coinChange(int[] coins, int amount) {\n        return -1;\n    }\n}");
        p14.getTestCases().add(new TestCase(p14, "1 2 5\n11", "3", false));
        problems.add(p14);

        // 15. Longest Common Subsequence (Dynamic Programming)
        Problem p15 = new Problem();
        p15.setTitle("Longest Common Subsequence");
        p15.setDescription("Given two strings text1 and text2, return the length of their longest common subsequence.");
        p15.setDifficulty("Medium");
        p15.setTopic("Dynamic Programming");
        p15.setOptimalTimeComplexity("O(m * n)");
        p15.setOptimalSpaceComplexity("O(m * n)");
        p15.setStarterCodeJava("public class Solution {\n    public int longestCommonSubsequence(String text1, String text2) {\n        return 0;\n    }\n}");
        p15.getTestCases().add(new TestCase(p15, "abcde\nace", "3", false));
        problems.add(p15);

        // 16. Subtree of Another Tree (Trees)
        Problem p16 = new Problem();
        p16.setTitle("Subtree of Another Tree");
        p16.setDescription("Given the roots of two binary trees root and subRoot, return true if there is a subtree of root with the same structure and node values of subRoot.");
        p16.setDifficulty("Easy");
        p16.setTopic("Trees");
        p16.setOptimalTimeComplexity("O(m * n)");
        p16.setOptimalSpaceComplexity("O(h)");
        p16.setStarterCodeJava("public class Solution {\n    public boolean isSubtree(TreeNode root, TreeNode subRoot) {\n        return true;\n    }\n}");
        p16.getTestCases().add(new TestCase(p16, "3 4 5 1 2\n4 1 2", "true", false));
        problems.add(p16);

        // 17. Course Schedule (Graphs)
        Problem p17 = new Problem();
        p17.setTitle("Course Schedule");
        p17.setDescription("There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. Return true if you can finish all courses.");
        p17.setDifficulty("Medium");
        p17.setTopic("Graphs");
        p17.setOptimalTimeComplexity("O(V + E)");
        p17.setOptimalSpaceComplexity("O(V + E)");
        p17.setStarterCodeJava("public class Solution {\n    public boolean canFinish(int numCourses, int[][] prerequisites) {\n        return true;\n    }\n}");
        p17.getTestCases().add(new TestCase(p17, "2\n1 0", "true", false));
        problems.add(p17);

        // 18. Kth Largest Element in an Array (Sorting)
        Problem p18 = new Problem();
        p18.setTitle("Kth Largest Element");
        p18.setDescription("Given an integer array nums and an integer k, return the kth largest element in the array.");
        p18.setDifficulty("Medium");
        p18.setTopic("Sorting");
        p18.setOptimalTimeComplexity("O(n log k)");
        p18.setOptimalSpaceComplexity("O(k)");
        p18.setStarterCodeJava("public class Solution {\n    public int findKthLargest(int[] nums, int k) {\n        return 0;\n    }\n}");
        p18.getTestCases().add(new TestCase(p18, "3 2 1 5 6 4\n2", "5", false));
        problems.add(p18);

        // 19. Search a 2D Matrix (Searching)
        Problem p19 = new Problem();
        p19.setTitle("Search a 2D Matrix");
        p19.setDescription("You are given an m x n integer matrix matrix with the following two properties: Each row is sorted in non-decreasing order, and the first integer of each row is greater than the last integer of the previous row.");
        p19.setDifficulty("Medium");
        p19.setTopic("Searching");
        p19.setOptimalTimeComplexity("O(log(m * n))");
        p19.setOptimalSpaceComplexity("O(1)");
        p19.setStarterCodeJava("public class Solution {\n    public boolean searchMatrix(int[][] matrix, int target) {\n        return false;\n    }\n}");
        p19.getTestCases().add(new TestCase(p19, "3 4\n1 3 5 7\n10 11 16 20\n23 30 34 60\n3", "true", false));
        problems.add(p19);

        // 20. Edit Distance (Dynamic Programming)
        Problem p20 = new Problem();
        p20.setTitle("Edit Distance");
        p20.setDescription("Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.");
        p20.setDifficulty("Hard");
        p20.setTopic("Dynamic Programming");
        p20.setOptimalTimeComplexity("O(m * n)");
        p20.setOptimalSpaceComplexity("O(m * n)");
        p20.setStarterCodeJava("public class Solution {\n    public int minDistance(String word1, String word2) {\n        return 0;\n    }\n}");
        p20.getTestCases().add(new TestCase(p20, "horse\nros", "3", false));
        problems.add(p20);

        // 21. Container With Most Water (Arrays)
        Problem p21 = new Problem();
        p21.setTitle("Container With Most Water");
        p21.setDescription("You are given an integer array height of length n. Find two lines that together with the x-axis form a container, such that the container contains the most water.");
        p21.setDifficulty("Medium");
        p21.setTopic("Arrays");
        p21.setOptimalTimeComplexity("O(n)");
        p21.setOptimalSpaceComplexity("O(1)");
        p21.setStarterCodeJava("public class Solution {\n    public int maxArea(int[] height) {\n        return 0;\n    }\n}");
        p21.getTestCases().add(new TestCase(p21, "1 8 6 2 5 4 8 3 7", "49", false));
        problems.add(p21);

        // 22. 3Sum (Arrays)
        Problem p22 = new Problem();
        p22.setTitle("3Sum");
        p22.setDescription("Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.");
        p22.setDifficulty("Medium");
        p22.setTopic("Arrays");
        p22.setOptimalTimeComplexity("O(n²)");
        p22.setOptimalSpaceComplexity("O(1)");
        p22.setStarterCodeJava("public class Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        return new ArrayList<>();\n    }\n}");
        p22.getTestCases().add(new TestCase(p22, "-1 0 1 2 -1 -4", "[[-1,-1,2],[-1,0,1]]", false));
        problems.add(p22);

        // 23. Longest Substring Without Repeating Characters (Strings)
        Problem p23 = new Problem();
        p23.setTitle("Longest Substring Without Repeating Characters");
        p23.setDescription("Given a string s, find the length of the longest substring without duplicate characters.");
        p23.setDifficulty("Medium");
        p23.setTopic("Strings");
        p23.setOptimalTimeComplexity("O(n)");
        p23.setOptimalSpaceComplexity("O(min(m, n))");
        p23.setStarterCodeJava("public class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        return 0;\n    }\n}");
        p23.getTestCases().add(new TestCase(p23, "abcabcbb", "3", false));
        problems.add(p23);

        // 24. Search in Rotated Sorted Array (Searching)
        Problem p24 = new Problem();
        p24.setTitle("Search in Rotated Sorted Array");
        p24.setDescription("Given the array nums after possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.");
        p24.setDifficulty("Medium");
        p24.setTopic("Searching");
        p24.setOptimalTimeComplexity("O(log n)");
        p24.setOptimalSpaceComplexity("O(1)");
        p24.setStarterCodeJava("public class Solution {\n    public int search(int[] nums, int target) {\n        return -1;\n    }\n}");
        p24.getTestCases().add(new TestCase(p24, "4 5 6 7 0 1 2\n0", "4", false));
        problems.add(p24);

        // 25. Merge Intervals (Sorting)
        Problem p25 = new Problem();
        p25.setTitle("Merge Intervals");
        p25.setDescription("Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.");
        p25.setDifficulty("Medium");
        p25.setTopic("Sorting");
        p25.setOptimalTimeComplexity("O(n log n)");
        p25.setOptimalSpaceComplexity("O(n)");
        p25.setStarterCodeJava("public class Solution {\n    public int[][] merge(int[][] intervals) {\n        return intervals;\n    }\n}");
        p25.getTestCases().add(new TestCase(p25, "1 3 2 6 8 10 15 18", "[[1,6],[8,10],[15,18]]", false));
        problems.add(p25);

        // 26. Invert Binary Tree (Trees)
        Problem p26 = new Problem();
        p26.setTitle("Invert Binary Tree");
        p26.setDescription("Given the root of a binary tree, invert the tree, and return its root.");
        p26.setDifficulty("Easy");
        p26.setTopic("Trees");
        p26.setOptimalTimeComplexity("O(n)");
        p26.setOptimalSpaceComplexity("O(h)");
        p26.setStarterCodeJava("public class Solution {\n    public TreeNode invertTree(TreeNode root) {\n        return root;\n    }\n}");
        p26.getTestCases().add(new TestCase(p26, "4 2 7 1 3 6 9", "4 7 2 9 6 3 1", false));
        problems.add(p26);

        // 27. Binary Tree Level Order Traversal (Trees)
        Problem p27 = new Problem();
        p27.setTitle("Binary Tree Level Order Traversal");
        p27.setDescription("Given the root of a binary tree, return the level order traversal of its nodes' values.");
        p27.setDifficulty("Medium");
        p27.setTopic("Trees");
        p27.setOptimalTimeComplexity("O(n)");
        p27.setOptimalSpaceComplexity("O(n)");
        p27.setStarterCodeJava("public class Solution {\n    public List<List<Integer>> levelOrder(TreeNode root) {\n        return new ArrayList<>();\n    }\n}");
        p27.getTestCases().add(new TestCase(p27, "3 9 20 null null 15 7", "[[3],[9,20],[15,7]]", false));
        problems.add(p27);

        // 28. Climbing Stairs (Dynamic Programming)
        Problem p28 = new Problem();
        p28.setTitle("Climbing Stairs");
        p28.setDescription("You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?");
        p28.setDifficulty("Easy");
        p28.setTopic("Dynamic Programming");
        p28.setOptimalTimeComplexity("O(n)");
        p28.setOptimalSpaceComplexity("O(1)");
        p28.setStarterCodeJava("public class Solution {\n    public int climbStairs(int n) {\n        return 0;\n    }\n}");
        p28.getTestCases().add(new TestCase(p28, "3", "3", false));
        problems.add(p28);

        // 29. House Robber (Dynamic Programming)
        Problem p29 = new Problem();
        p29.setTitle("House Robber");
        p29.setDescription("You are a professional robber planning to rob houses along a street without triggering alarms (no two adjacent houses can be broken into). Return the maximum money you can rob.");
        p29.setDifficulty("Medium");
        p29.setTopic("Dynamic Programming");
        p29.setOptimalTimeComplexity("O(n)");
        p29.setOptimalSpaceComplexity("O(1)");
        p29.setStarterCodeJava("public class Solution {\n    public int rob(int[] nums) {\n        return 0;\n    }\n}");
        p29.getTestCases().add(new TestCase(p29, "2 7 9 3 1", "12", false));
        problems.add(p29);

        // 30. Trapping Rain Water (Arrays)
        Problem p30 = new Problem();
        p30.setTitle("Trapping Rain Water");
        p30.setDescription("Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.");
        p30.setDifficulty("Hard");
        p30.setTopic("Arrays");
        p30.setOptimalTimeComplexity("O(n)");
        p30.setOptimalSpaceComplexity("O(1)");
        p30.setStarterCodeJava("public class Solution {\n    public int trap(int[] height) {\n        return 0;\n    }\n}");
        p30.getTestCases().add(new TestCase(p30, "0 1 0 2 1 0 1 3 2 1 2 1", "6", false));
        problems.add(p30);

        // 31. Valid Anagram (Hashing)
        Problem p31 = new Problem();
        p31.setTitle("Valid Anagram");
        p31.setDescription("Given two strings s and t, return true if t is an anagram of s, and false otherwise.");
        p31.setDifficulty("Easy");
        p31.setTopic("Hashing");
        p31.setOptimalTimeComplexity("O(n)");
        p31.setOptimalSpaceComplexity("O(1)");
        p31.setStarterCodeJava("public class Solution {\n    public boolean isAnagram(String s, String t) {\n        return true;\n    }\n}");
        p31.getTestCases().add(new TestCase(p31, "anagram\nnagaram", "true", false));
        problems.add(p31);

        // 32. Maximum Subarray (Arrays)
        Problem p32 = new Problem();
        p32.setTitle("Maximum Subarray");
        p32.setDescription("Given an integer array nums, find the subarray with the largest sum, and return its sum (Kadane's Algorithm).");
        p32.setDifficulty("Medium");
        p32.setTopic("Arrays");
        p32.setOptimalTimeComplexity("O(n)");
        p32.setOptimalSpaceComplexity("O(1)");
        p32.setStarterCodeJava("public class Solution {\n    public int maxSubArray(int[] nums) {\n        return 0;\n    }\n}");
        p32.getTestCases().add(new TestCase(p32, "-2 1 -3 4 -1 2 1 -5 4", "6", false));
        problems.add(p32);

        // 33. Word Search (Backtracking)
        Problem p33 = new Problem();
        p33.setTitle("Word Search");
        p33.setDescription("Given an m x n grid of characters board and a string word, return true if word exists in the grid using horizontally or vertically adjacent cells.");
        p33.setDifficulty("Medium");
        p33.setTopic("Recursion");
        p33.setOptimalTimeComplexity("O(n * 3^L)");
        p33.setOptimalSpaceComplexity("O(L)");
        p33.setStarterCodeJava("public class Solution {\n    public boolean exist(char[][] board, String word) {\n        return true;\n    }\n}");
        p33.getTestCases().add(new TestCase(p33, "A B C E\nS F C S\nA D E E\nABCCED", "true", false));
        problems.add(p33);

        // 34. Find Minimum in Rotated Sorted Array (Searching)
        Problem p34 = new Problem();
        p34.setTitle("Find Minimum in Rotated Sorted Array");
        p34.setDescription("Given the sorted rotated array nums of unique elements, return the minimum element of this array in O(log n) time.");
        p34.setDifficulty("Medium");
        p34.setTopic("Searching");
        p34.setOptimalTimeComplexity("O(log n)");
        p34.setOptimalSpaceComplexity("O(1)");
        p34.setStarterCodeJava("public class Solution {\n    public int findMin(int[] nums) {\n        return 0;\n    }\n}");
        p34.getTestCases().add(new TestCase(p34, "3 4 5 1 2", "1", false));
        problems.add(p34);

        // 35. Lowest Common Ancestor of BST (Trees)
        Problem p35 = new Problem();
        p35.setTitle("Lowest Common Ancestor of BST");
        p35.setDescription("Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.");
        p35.setDifficulty("Easy");
        p35.setTopic("Trees");
        p35.setOptimalTimeComplexity("O(h)");
        p35.setOptimalSpaceComplexity("O(1)");
        p35.setStarterCodeJava("public class Solution {\n    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {\n        return root;\n    }\n}");
        p35.getTestCases().add(new TestCase(p35, "6 2 8 0 4 7 9\n2 8", "6", false));
        problems.add(p35);

        for (Problem p : problems) {
            if (!problemRepository.existsByTitle(p.getTitle())) {
                problemRepository.save(p);
            }
        }
    }
}
