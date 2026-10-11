package com.codepulse.repository;

import com.codepulse.model.CodeAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CodeAnalysisRepository extends JpaRepository<CodeAnalysis, Long> {
    Optional<CodeAnalysis> findBySubmissionId(Long submissionId);
}
