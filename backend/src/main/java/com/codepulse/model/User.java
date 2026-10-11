package com.codepulse.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role; // ROLE_STUDENT, ROLE_ADMIN

    @Column(name = "preferred_language")
    private String preferredLanguage = "Java"; // Java, Python, C++, JavaScript

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    private int xp = 0;

    @Column(name = "current_streak")
    private int currentStreak = 0;

    @Column(name = "longest_streak")
    private int longestStreak = 0;

    @Column(name = "total_coding_time_minutes")
    private int totalCodingTimeMinutes = 0;

    public User() {}

    public User(String name, String username, String email, String password, String role, String preferredLanguage) {
        this.name = name;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.preferredLanguage = preferredLanguage;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getPreferredLanguage() { return preferredLanguage; }
    public void setPreferredLanguage(String preferredLanguage) { this.preferredLanguage = preferredLanguage; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public int getXp() { return xp; }
    public void setXp(int xp) { this.xp = xp; }

    public int getCurrentStreak() { return currentStreak; }
    public void setCurrentStreak(int currentStreak) { this.currentStreak = currentStreak; }

    public int getLongestStreak() { return longestStreak; }
    public void setLongestStreak(int longestStreak) { this.longestStreak = longestStreak; }

    public int getTotalCodingTimeMinutes() { return totalCodingTimeMinutes; }
    public void setTotalCodingTimeMinutes(int totalCodingTimeMinutes) { this.totalCodingTimeMinutes = totalCodingTimeMinutes; }
}
