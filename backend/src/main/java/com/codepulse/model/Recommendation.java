package com.codepulse.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "recommendations")
public class Recommendation {

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
    private String reason;

    private int priority = 1;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Recommendation() {}

    public Recommendation(User user, Problem problem, String reason, int priority) {
        this.user = user;
        this.problem = problem;
        this.reason = reason;
        this.priority = priority;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Problem getProblem() { return problem; }
    public void setProblem(Problem problem) { this.problem = problem; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public int getPriority() { return priority; }
    public void setPriority(int priority) { this.priority = priority; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
