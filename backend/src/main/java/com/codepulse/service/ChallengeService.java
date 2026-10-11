package com.codepulse.service;

import com.codepulse.model.DailyChallenge;
import com.codepulse.model.Problem;
import com.codepulse.model.User;
import com.codepulse.model.UserSkill;
import com.codepulse.repository.DailyChallengeRepository;
import com.codepulse.repository.ProblemRepository;
import com.codepulse.repository.SubmissionRepository;
import com.codepulse.repository.UserRepository;
import com.codepulse.repository.UserSkillRepository;
import com.codepulse.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ChallengeService {

    @Autowired
    private DailyChallengeRepository dailyChallengeRepository;

    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private UserSkillRepository userSkillRepository;

    public DailyChallenge getDailyChallenge() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDate today = LocalDate.now();
        return dailyChallengeRepository.findByUserIdAndChallengeDate(user.getId(), today)
                .orElseGet(() -> createDailyChallenge(user, today));
    }

    private DailyChallenge createDailyChallenge(User user, LocalDate today) {
        Problem challengeProblem = selectPersonalizedProblem(user, today);

        DailyChallenge challenge = new DailyChallenge();
        challenge.setUser(user);
        challenge.setProblem(challengeProblem);
        challenge.setChallengeDate(today);
        challenge.setStatus("PENDING");
        challenge.setXpReward(50);
        challenge.setReason(buildPersonalizedReason(user, challengeProblem));

        return dailyChallengeRepository.save(challenge);
    }

    private Problem selectPersonalizedProblem(User user, LocalDate today) {
        List<Problem> allProblems = problemRepository.findAll();
        if (allProblems.isEmpty()) {
            throw new RuntimeException("No problems available for daily challenge");
        }

        Set<Long> solvedIds = new HashSet<>(submissionRepository.findSolvedProblemIdsByUserId(user.getId()));

        List<String> weakTopics = userSkillRepository.findByUserId(user.getId()).stream()
                .filter(s -> s.getProblemsAttempted() > 0 && s.getSkillScore() < 65)
                .sorted(Comparator.comparingInt(UserSkill::getSkillScore))
                .map(UserSkill::getTopic)
                .collect(Collectors.toList());

        List<Problem> candidates = allProblems.stream()
                .filter(p -> !solvedIds.contains(p.getId()))
                .filter(p -> weakTopics.isEmpty() || weakTopics.contains(p.getTopic()))
                .collect(Collectors.toList());

        if (candidates.isEmpty()) {
            candidates = allProblems.stream()
                    .filter(p -> !solvedIds.contains(p.getId()))
                    .collect(Collectors.toList());
        }

        if (candidates.isEmpty()) {
            candidates = allProblems;
        }

        int index = Math.floorMod(
                Objects.hash(user.getId(), today.getDayOfYear(), today.getYear()),
                candidates.size()
        );
        return candidates.get(index);
    }

    private String buildPersonalizedReason(User user, Problem problem) {
        Optional<UserSkill> skillOpt = userSkillRepository.findByUserIdAndTopic(user.getId(), problem.getTopic());
        if (skillOpt.isPresent() && skillOpt.get().getSkillScore() < 65) {
            return "Your " + problem.getTopic() + " skill score is "
                    + skillOpt.get().getSkillScore()
                    + "/100. This challenge targets that weak area.";
        }
        if (submissionRepository.findSolvedProblemIdsByUserId(user.getId()).contains(problem.getId())) {
            return "Revisit this " + problem.getDifficulty().toLowerCase()
                    + " " + problem.getTopic() + " problem to sharpen your skills.";
        }
        return "A new " + problem.getDifficulty().toLowerCase()
                + " challenge in " + problem.getTopic() + " picked for your learning path.";
    }
}
