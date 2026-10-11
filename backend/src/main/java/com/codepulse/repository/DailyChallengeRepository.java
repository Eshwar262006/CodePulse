package com.codepulse.repository;

import com.codepulse.model.DailyChallenge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.List;

@Repository
public interface DailyChallengeRepository extends JpaRepository<DailyChallenge, Long> {
    Optional<DailyChallenge> findByUserIdAndChallengeDate(Long userId, LocalDate challengeDate);
    List<DailyChallenge> findByUserIdOrderByChallengeDateDesc(Long userId);
}
