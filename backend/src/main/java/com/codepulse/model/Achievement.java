package com.codepulse.model;

import jakarta.persistence.*;

@Entity
@Table(name = "achievements")
public class Achievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "criteria_type")
    private String criteriaType; // PROBLEMS_SOLVED, STREAK_DAYS, OPTIMIZATION_COUNT

    @Column(name = "criteria_value")
    private int criteriaValue;

    private String icon; // Icon identifier or name

    public Achievement() {}

    public Achievement(String name, String description, String criteriaType, int criteriaValue, String icon) {
        this.name = name;
        this.description = description;
        this.criteriaType = criteriaType;
        this.criteriaValue = criteriaValue;
        this.icon = icon;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCriteriaType() { return criteriaType; }
    public void setCriteriaType(String criteriaType) { this.criteriaType = criteriaType; }

    public int getCriteriaValue() { return criteriaValue; }
    public void setCriteriaValue(int criteriaValue) { this.criteriaValue = criteriaValue; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
}
