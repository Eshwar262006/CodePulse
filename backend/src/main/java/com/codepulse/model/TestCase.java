package com.codepulse.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "test_cases")
public class TestCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    @JsonIgnore
    private Problem problem;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String input;

    @Column(name = "expected_output", columnDefinition = "TEXT", nullable = false)
    private String expectedOutput;

    @Column(name = "is_hidden")
    private boolean isHidden = false;

    public TestCase() {}

    public TestCase(Problem problem, String input, String expectedOutput, boolean isHidden) {
        this.problem = problem;
        this.input = input;
        this.expectedOutput = expectedOutput;
        this.isHidden = isHidden;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Problem getProblem() { return problem; }
    public void setProblem(Problem problem) { this.problem = problem; }

    public String getInput() { return input; }
    public void setInput(String input) { this.input = input; }

    public String getExpectedOutput() { return expectedOutput; }
    public void setExpectedOutput(String expectedOutput) { this.expectedOutput = expectedOutput; }

    public boolean isHidden() { return isHidden; }
    public void setHidden(boolean hidden) { isHidden = hidden; }
}
