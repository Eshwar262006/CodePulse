package com.codepulse.repository;

import com.codepulse.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByUserIdOrderBySubmittedAtDesc(Long userId);
    List<Submission> findByUserIdAndProblemIdOrderBySubmittedAtDesc(Long userId, Long problemId);
    
    @Query("SELECT COUNT(DISTINCT s.problem.id) FROM Submission s WHERE s.user.id = :userId AND s.status = 'ACCEPTED'")
    Long countDistinctSolvedProblemsByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(DISTINCT s.problem.id) FROM Submission s WHERE s.user.id = :userId")
    Long countDistinctAttemptedProblemsByUserId(@Param("userId") Long userId);

    @Query("SELECT s FROM Submission s WHERE s.user.id = :userId AND s.status = 'ACCEPTED' AND s.problem.id = :problemId")
    List<Submission> findAcceptedSubmissionsByUserAndProblem(@Param("userId") Long userId, @Param("problemId") Long problemId);
    
    Long countByUserId(Long userId);
    Long countByUserIdAndStatus(Long userId, String status);

    List<Submission> findByUserIdAndSubmittedAtAfterOrderBySubmittedAtAsc(Long userId, java.time.LocalDateTime after);

    @Query("SELECT s.status, COUNT(s) FROM Submission s WHERE s.user.id = :userId GROUP BY s.status")
    List<Object[]> countGroupByStatusForUser(@Param("userId") Long userId);

    @Query("SELECT p.difficulty, COUNT(DISTINCT s.problem.id) FROM Submission s JOIN s.problem p " +
           "WHERE s.user.id = :userId AND s.status = 'ACCEPTED' GROUP BY p.difficulty")
    List<Object[]> countSolvedByDifficultyForUser(@Param("userId") Long userId);

    @Query("SELECT DISTINCT s.problem.id FROM Submission s WHERE s.user.id = :userId AND s.status = 'ACCEPTED'")
    List<Long> findSolvedProblemIdsByUserId(@Param("userId") Long userId);

    List<Submission> findTop100ByOrderBySubmittedAtDesc();
}
