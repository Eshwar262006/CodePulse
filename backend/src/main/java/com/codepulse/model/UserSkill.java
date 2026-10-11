package com.codepulse.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "user_skills")
public class UserSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(nullable = false)
    private String topic; // Arrays, Strings, Hashing, Trees, etc.

    @Column(name = "skill_score")
    private int skillScore = 50;

    @Column(name = "problems_attempted")
    private int problemsAttempted = 0;

    @Column(name = "problems_solved")
    private int problemsSolved = 0;

    private double accuracy = 0.0;

    public UserSkill() {}

    public UserSkill(User user, String topic, int skillScore, int problemsAttempted, int problemsSolved, double accuracy) {
        this.user = user;
        this.topic = topic;
        this.skillScore = skillScore;
        this.problemsAttempted = problemsAttempted;
        this.problemsSolved = problemsSolved;
        this.accuracy = accuracy;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public int getSkillScore() { return skillScore; }
    public void setSkillScore(int skillScore) { this.skillScore = skillScore; }

    public int getProblemsAttempted() { return problemsAttempted; }
    public void setProblemsAttempted(int problemsAttempted) { this.problemsAttempted = problemsAttempted; }

    public int getProblemsSolved() { return problemsSolved; }
    public void setProblemsSolved(int problemsSolved) { this.problemsSolved = problemsSolved; }

    public double getAccuracy() { return accuracy; }
    public void setAccuracy(double accuracy) { this.accuracy = accuracy; }
}
