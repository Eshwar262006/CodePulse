package com.codepulse.service;

import com.codepulse.dto.CodeExecutionDTOs.*;
import com.codepulse.model.*;
import com.codepulse.repository.*;
import com.codepulse.security.UserDetailsImpl;
import com.codepulse.service.ai.AiCodeAnalysisService;
import com.codepulse.service.execution.CodeExecutionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SubmissionService {

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CodeAnalysisRepository codeAnalysisRepository;

    @Autowired
    private UserSkillRepository userSkillRepository;

    @Autowired
    private CodeExecutionService codeExecutionService;

    @Autowired
    private AiCodeAnalysisService aiCodeAnalysisService;

    public ExecutionResult runCode(ExecutionRequest request) {
        Problem problem = problemRepository.findById(request.getProblemId())
                .orElseThrow(() -> new RuntimeException("Problem not found"));
        return codeExecutionService.executeCode(problem, request.getLanguage(), request.getCode(), true);
    }

    @Transactional
    public ExecutionResult submitCode(ExecutionRequest request) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Problem problem = problemRepository.findById(request.getProblemId())
                .orElseThrow(() -> new RuntimeException("Problem not found"));

        // Execute code against all test cases
        ExecutionResult execResult = codeExecutionService.executeCode(problem, request.getLanguage(), request.getCode(), false);

        // Save submission entity
        Submission submission = new Submission();
        submission.setUser(user);
        submission.setProblem(problem);
        submission.setLanguage(request.getLanguage());
        submission.setCode(request.getCode());
        submission.setStatus(execResult.getStatus());
        submission.setExecutionTimeMs(execResult.getExecutionTimeMs());
        submission.setMemoryUsedMb(execResult.getMemoryUsedMb());
        submission.setPassedTestCases(execResult.getPassedTestCases());
        submission.setTotalTestCases(execResult.getTotalTestCases());
        submission.setSubmittedAt(LocalDateTime.now());

        Submission savedSubmission = submissionRepository.save(submission);

        // AI Intelligent Code Improvement Analysis
        CodeAnalysis analysis = aiCodeAnalysisService.analyzeSubmission(savedSubmission);
        codeAnalysisRepository.save(analysis);

        savedSubmission.setAnalysis(analysis);
        execResult.setSubmissionId(savedSubmission.getId());

        // Update user stats & skill score
        updateUserSkillAndStats(user, problem, execResult.getStatus());

        return execResult;
    }

    private void updateUserSkillAndStats(User user, Problem problem, String status) {
        boolean isAccepted = "ACCEPTED".equalsIgnoreCase(status);
        if (isAccepted) {
            user.setXp(user.getXp() + 25);
            user.setCurrentStreak(user.getCurrentStreak() + 1);
            if (user.getCurrentStreak() > user.getLongestStreak()) {
                user.setLongestStreak(user.getCurrentStreak());
            }
        }
        user.setTotalCodingTimeMinutes(user.getTotalCodingTimeMinutes() + 5);
        userRepository.save(user);

        // Topic skill score calculation
        String topic = problem.getTopic();
        Optional<UserSkill> skillOpt = userSkillRepository.findByUserIdAndTopic(user.getId(), topic);
        UserSkill skill = skillOpt.orElseGet(() -> new UserSkill(user, topic, 50, 0, 0, 0.0));

        skill.setProblemsAttempted(skill.getProblemsAttempted() + 1);
        if (isAccepted) {
            skill.setProblemsSolved(skill.getProblemsSolved() + 1);
        }
        double accuracy = Math.round(((double) skill.getProblemsSolved() / skill.getProblemsAttempted()) * 100.0);
        skill.setAccuracy(accuracy);
        
        int newScore = (int) Math.min(100, Math.max(10, 40 + (skill.getProblemsSolved() * 10) + (accuracy * 0.4)));
        skill.setSkillScore(newScore);

        userSkillRepository.save(skill);
    }

    public List<Submission> getUserSubmissions(Long userId) {
        return submissionRepository.findByUserIdOrderBySubmittedAtDesc(userId);
    }

    public Optional<Submission> getSubmissionById(Long id) {
        return submissionRepository.findById(id);
    }
}
