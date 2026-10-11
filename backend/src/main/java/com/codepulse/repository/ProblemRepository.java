package com.codepulse.repository;

import com.codepulse.model.Problem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {
    List<Problem> findByDifficulty(String difficulty);
    List<Problem> findByTopic(String topic);
    List<Problem> findByDifficultyAndTopic(String difficulty, String topic);
    boolean existsByTitle(String title);

    @Query("SELECT p FROM Problem p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.topic) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Problem> searchProblems(@Param("keyword") String keyword);
}
