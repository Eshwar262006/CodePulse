package com.codepulse.service;

import com.codepulse.model.UserSkill;
import com.codepulse.repository.SubmissionRepository;
import com.codepulse.repository.UserSkillRepository;
import com.codepulse.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SkillService {

    private static final List<String> ALGORITHM_TOPICS = List.of(
            "Trees", "Graphs", "Dynamic Programming", "Recursion", "Greedy", "Sorting", "Searching"
    );
    private static final List<String> DATA_STRUCTURE_TOPICS = List.of(
            "Arrays", "Strings", "Linked Lists", "Stack", "Queue", "Hashing"
    );

    @Autowired
    private UserSkillRepository userSkillRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    public Map<String, Object> getUserSkillAnalysis() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userId = userDetails.getId();

        List<UserSkill> dbSkills = userSkillRepository.findByUserId(userId);

        Map<String, Integer> topicScores = new LinkedHashMap<>();
        for (UserSkill skill : dbSkills) {
            topicScores.put(skill.getTopic(), skill.getSkillScore());
        }

        long totalSubmissions = submissionRepository.countByUserId(userId);
        long acceptedSubmissions = submissionRepository.countByUserIdAndStatus(userId, "ACCEPTED");
        int successRate = totalSubmissions > 0
                ? (int) Math.round((acceptedSubmissions * 100.0) / totalSubmissions)
                : 0;

        int avgAlgorithm = averageForTopics(dbSkills, ALGORITHM_TOPICS);
        int avgDataStructures = averageForTopics(dbSkills, DATA_STRUCTURE_TOPICS);
        int overallTopicAvg = dbSkills.isEmpty() ? 0
                : (int) Math.round(dbSkills.stream()
                        .filter(s -> s.getProblemsAttempted() > 0)
                        .mapToInt(UserSkill::getSkillScore)
                        .average()
                        .orElse(0));

        Map<String, Integer> coreSkills = new LinkedHashMap<>();
        coreSkills.put("Problem Solving", successRate);
        coreSkills.put("Algorithms", avgAlgorithm);
        coreSkills.put("Data Structures", avgDataStructures);
        coreSkills.put("Optimization", Math.min(100, overallTopicAvg + (successRate > 70 ? 10 : 0)));
        coreSkills.put("Coding Speed", Math.min(100, (int) (acceptedSubmissions * 5)));
        coreSkills.put("Consistency", Math.min(100, dbSkills.stream()
                .mapToInt(UserSkill::getProblemsAttempted)
                .sum() * 3));

        List<String> strongTopics = dbSkills.stream()
                .filter(s -> s.getProblemsAttempted() > 0 && s.getSkillScore() >= 65)
                .sorted(Comparator.comparingInt(UserSkill::getSkillScore).reversed())
                .map(UserSkill::getTopic)
                .limit(4)
                .collect(Collectors.toList());

        List<String> weakTopics = dbSkills.stream()
                .filter(s -> s.getProblemsAttempted() > 0 && s.getSkillScore() < 65)
                .sorted(Comparator.comparingInt(UserSkill::getSkillScore))
                .map(UserSkill::getTopic)
                .limit(4)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("coreSkills", coreSkills);
        response.put("topicScores", topicScores);
        response.put("strongTopics", strongTopics);
        response.put("weakTopics", weakTopics);

        return response;
    }

    private int averageForTopics(List<UserSkill> skills, List<String> topics) {
        return (int) Math.round(skills.stream()
                .filter(s -> topics.contains(s.getTopic()) && s.getProblemsAttempted() > 0)
                .mapToInt(UserSkill::getSkillScore)
                .average()
                .orElse(0));
    }
}
