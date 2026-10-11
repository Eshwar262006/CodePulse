package com.codepulse.service;

import com.codepulse.model.Problem;
import com.codepulse.model.UserSkill;
import com.codepulse.repository.ProblemRepository;
import com.codepulse.repository.SubmissionRepository;
import com.codepulse.repository.UserSkillRepository;
import com.codepulse.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private UserSkillRepository userSkillRepository;

    public List<Map<String, Object>> getPersonalizedRecommendations() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userId = userDetails.getId();

        Set<Long> solvedIds = new HashSet<>(submissionRepository.findSolvedProblemIdsByUserId(userId));

        List<String> weakTopics = userSkillRepository.findByUserId(userId).stream()
                .filter(s -> s.getProblemsAttempted() > 0 && s.getSkillScore() < 65)
                .sorted(Comparator.comparingInt(UserSkill::getSkillScore))
                .map(UserSkill::getTopic)
                .collect(Collectors.toList());

        List<Problem> candidates = problemRepository.findAll().stream()
                .filter(p -> !solvedIds.contains(p.getId()))
                .sorted((a, b) -> {
                    int aWeak = weakTopics.contains(a.getTopic()) ? 0 : 1;
                    int bWeak = weakTopics.contains(b.getTopic()) ? 0 : 1;
                    if (aWeak != bWeak) return aWeak - bWeak;
                    return a.getId().compareTo(b.getId());
                })
                .limit(5)
                .collect(Collectors.toList());

        List<Map<String, Object>> recommendations = new ArrayList<>();
        int priority = 5;
        for (Problem p : candidates) {
            Map<String, Object> rec = new HashMap<>();
            rec.put("id", p.getId());
            rec.put("problem", p);
            rec.put("title", p.getTitle());
            rec.put("difficulty", p.getDifficulty());
            rec.put("topic", p.getTopic());
            rec.put("reason", buildReason(p, weakTopics));
            rec.put("priority", priority--);
            recommendations.add(rec);
        }

        return recommendations;
    }

    private String buildReason(Problem problem, List<String> weakTopics) {
        if (weakTopics.contains(problem.getTopic())) {
            return "Target weak area: " + problem.getTopic() + " — strengthen this topic with practice";
        }
        return "Recommended next step: " + problem.getDifficulty() + " " + problem.getTopic() + " problem";
    }
}
