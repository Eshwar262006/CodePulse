package com.codepulse.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "daily_challenges")
public class DailyChallenge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    @Column(name = "challenge_date", nullable = false)
    private LocalDate challengeDate;

    @Column(nullable = false)
    private String status = "PENDING"; // PENDING, COMPLETED

    @Column(name = "xp_reward")
    private int xpReward = 50;

    @Column(columnDefinition = "TEXT")
    private String reason;

    public DailyChallenge() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Problem getProblem() { return problem; }
    public void setProblem(Problem problem) { this.problem = problem; }

    public LocalDate getChallengeDate() { return challengeDate; }
    public void setChallengeDate(LocalDate challengeDate) { this.challengeDate = challengeDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getXpReward() { return xpReward; }
    public void setXpReward(int xpReward) { this.xpReward = xpReward; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
