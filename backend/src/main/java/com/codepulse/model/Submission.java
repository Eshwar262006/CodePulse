package com.codepulse.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "submissions")
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    @Column(nullable = false)
    private String language; // Java, Python, C++, JavaScript

    @Column(columnDefinition = "TEXT", nullable = false)
    private String code;

    @Column(nullable = false)
    private String status; // ACCEPTED, WRONG_ANSWER, COMPILATION_ERROR, RUNTIME_ERROR, TIME_LIMIT_EXCEEDED

    @Column(name = "execution_time_ms")
    private Long executionTimeMs = 0L;

    @Column(name = "memory_used_mb")
    private Double memoryUsedMb = 0.0;

    @Column(name = "passed_test_cases")
    private int passedTestCases = 0;

    @Column(name = "total_test_cases")
    private int totalTestCases = 0;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt = LocalDateTime.now();

    @OneToOne(mappedBy = "submission", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private CodeAnalysis analysis;

    public Submission() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Problem getProblem() { return problem; }
    public void setProblem(Problem problem) { this.problem = problem; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getExecutionTimeMs() { return executionTimeMs; }
    public void setExecutionTimeMs(Long executionTimeMs) { this.executionTimeMs = executionTimeMs; }

    public Double getMemoryUsedMb() { return memoryUsedMb; }
    public void setMemoryUsedMb(Double memoryUsedMb) { this.memoryUsedMb = memoryUsedMb; }

    public int getPassedTestCases() { return passedTestCases; }
    public void setPassedTestCases(int passedTestCases) { this.passedTestCases = passedTestCases; }

    public int getTotalTestCases() { return totalTestCases; }
    public void setTotalTestCases(int totalTestCases) { this.totalTestCases = totalTestCases; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }

    public CodeAnalysis getAnalysis() { return analysis; }
    public void setAnalysis(CodeAnalysis analysis) { this.analysis = analysis; }
}
