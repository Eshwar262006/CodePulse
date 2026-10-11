package com.codepulse.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_achievements")
public class UserAchievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "achievement_id", nullable = false)
    private Achievement achievement;

    @Column(name = "earned_at")
    private LocalDateTime earnedAt = LocalDateTime.now();

    public UserAchievement() {}

    public UserAchievement(User user, Achievement achievement) {
        this.user = user;
        this.achievement = achievement;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Achievement getAchievement() { return achievement; }
    public void setAchievement(Achievement achievement) { this.achievement = achievement; }

    public LocalDateTime getEarnedAt() { return earnedAt; }
    public void setEarnedAt(LocalDateTime earnedAt) { this.earnedAt = earnedAt; }
}
