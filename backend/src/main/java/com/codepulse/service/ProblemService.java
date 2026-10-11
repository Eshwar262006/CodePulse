package com.codepulse.service;

import com.codepulse.model.Problem;
import com.codepulse.repository.ProblemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProblemService {

    @Autowired
    private ProblemRepository problemRepository;

    public List<Problem> getAllProblems() {
        return problemRepository.findAll();
    }

    public Optional<Problem> getProblemById(Long id) {
        return problemRepository.findById(id);
    }

    public List<Problem> filterProblems(String difficulty, String topic, String search) {
        if (search != null && !search.trim().isEmpty()) {
            return problemRepository.searchProblems(search.trim());
        }
        if (difficulty != null && !difficulty.equalsIgnoreCase("All") && topic != null && !topic.equalsIgnoreCase("All")) {
            return problemRepository.findByDifficultyAndTopic(difficulty, topic);
        }
        if (difficulty != null && !difficulty.equalsIgnoreCase("All")) {
            return problemRepository.findByDifficulty(difficulty);
        }
        if (topic != null && !topic.equalsIgnoreCase("All")) {
            return problemRepository.findByTopic(topic);
        }
        return problemRepository.findAll();
    }

    public Problem saveProblem(Problem problem) {
        return problemRepository.save(problem);
    }

    public void deleteProblem(Long id) {
        problemRepository.deleteById(id);
    }
}
