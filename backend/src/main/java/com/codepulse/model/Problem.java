package com.codepulse.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "problems")
public class Problem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(nullable = false)
    private String difficulty; // Easy, Medium, Hard

    @Column(nullable = false)
    private String topic; // Arrays, Strings, Linked Lists, Stack, Queue, Trees, Graphs, Sorting, Searching, Hashing, Recursion, Greedy, Dynamic Programming

    @Column(columnDefinition = "TEXT")
    private String constraints;

    @Column(name = "input_format", columnDefinition = "TEXT")
    private String inputFormat;

    @Column(name = "output_format", columnDefinition = "TEXT")
    private String outputFormat;

    // Supported Languages Starter Code
    @Column(name = "starter_code_java", columnDefinition = "TEXT")
    private String starterCodeJava;

    @Column(name = "starter_code_python", columnDefinition = "TEXT")
    private String starterCodePython;

    @Column(name = "starter_code_cpp", columnDefinition = "TEXT")
    private String starterCodeCpp;

    @Column(name = "starter_code_js", columnDefinition = "TEXT")
    private String starterCodeJs;

    @Column(name = "starter_code_ts", columnDefinition = "TEXT")
    private String starterCodeTs;

    @Column(name = "starter_code_go", columnDefinition = "TEXT")
    private String starterCodeGo;

    @Column(name = "starter_code_rust", columnDefinition = "TEXT")
    private String starterCodeRust;

    @Column(name = "starter_code_csharp", columnDefinition = "TEXT")
    private String starterCodeCsharp;

    @Column(name = "starter_code_c", columnDefinition = "TEXT")
    private String starterCodeC;

    @Column(name = "starter_code_php", columnDefinition = "TEXT")
    private String starterCodePhp;

    @Column(name = "starter_code_ruby", columnDefinition = "TEXT")
    private String starterCodeRuby;

    @Column(name = "starter_code_swift", columnDefinition = "TEXT")
    private String starterCodeSwift;

    @Column(name = "starter_code_kotlin", columnDefinition = "TEXT")
    private String starterCodeKotlin;

    @Column(name = "starter_code_sql", columnDefinition = "TEXT")
    private String starterCodeSql;

    @Column(name = "optimal_time_complexity")
    private String optimalTimeComplexity = "O(n)";

    @Column(name = "optimal_space_complexity")
    private String optimalSpaceComplexity = "O(1)";

    @OneToMany(mappedBy = "problem", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<TestCase> testCases = new ArrayList<>();

    public Problem() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public String getConstraints() { return constraints; }
    public void setConstraints(String constraints) { this.constraints = constraints; }

    public String getInputFormat() { return inputFormat; }
    public void setInputFormat(String inputFormat) { this.inputFormat = inputFormat; }

    public String getOutputFormat() { return outputFormat; }
    public void setOutputFormat(String outputFormat) { this.outputFormat = outputFormat; }

    public String getStarterCodeJava() { return starterCodeJava; }
    public void setStarterCodeJava(String starterCodeJava) { this.starterCodeJava = starterCodeJava; }

    public String getStarterCodePython() { return starterCodePython; }
    public void setStarterCodePython(String starterCodePython) { this.starterCodePython = starterCodePython; }

    public String getStarterCodeCpp() { return starterCodeCpp; }
    public void setStarterCodeCpp(String starterCodeCpp) { this.starterCodeCpp = starterCodeCpp; }

    public String getStarterCodeJs() { return starterCodeJs; }
    public void setStarterCodeJs(String starterCodeJs) { this.starterCodeJs = starterCodeJs; }

    public String getStarterCodeTs() { return starterCodeTs; }
    public void setStarterCodeTs(String starterCodeTs) { this.starterCodeTs = starterCodeTs; }

    public String getStarterCodeGo() { return starterCodeGo; }
    public void setStarterCodeGo(String starterCodeGo) { this.starterCodeGo = starterCodeGo; }

    public String getStarterCodeRust() { return starterCodeRust; }
    public void setStarterCodeRust(String starterCodeRust) { this.starterCodeRust = starterCodeRust; }

    public String getStarterCodeCsharp() { return starterCodeCsharp; }
    public void setStarterCodeCsharp(String starterCodeCsharp) { this.starterCodeCsharp = starterCodeCsharp; }

    public String getStarterCodeC() { return starterCodeC; }
    public void setStarterCodeC(String starterCodeC) { this.starterCodeC = starterCodeC; }

    public String getStarterCodePhp() { return starterCodePhp; }
    public void setStarterCodePhp(String starterCodePhp) { this.starterCodePhp = starterCodePhp; }

    public String getStarterCodeRuby() { return starterCodeRuby; }
    public void setStarterCodeRuby(String starterCodeRuby) { this.starterCodeRuby = starterCodeRuby; }

    public String getStarterCodeSwift() { return starterCodeSwift; }
    public void setStarterCodeSwift(String starterCodeSwift) { this.starterCodeSwift = starterCodeSwift; }

    public String getStarterCodeKotlin() { return starterCodeKotlin; }
    public void setStarterCodeKotlin(String starterCodeKotlin) { this.starterCodeKotlin = starterCodeKotlin; }

    public String getStarterCodeSql() { return starterCodeSql; }
    public void setStarterCodeSql(String starterCodeSql) { this.starterCodeSql = starterCodeSql; }

    public String getOptimalTimeComplexity() { return optimalTimeComplexity; }
    public void setOptimalTimeComplexity(String optimalTimeComplexity) { this.optimalTimeComplexity = optimalTimeComplexity; }

    public String getOptimalSpaceComplexity() { return optimalSpaceComplexity; }
    public void setOptimalSpaceComplexity(String optimalSpaceComplexity) { this.optimalSpaceComplexity = optimalSpaceComplexity; }

    public List<TestCase> getTestCases() { return testCases; }
    public void setTestCases(List<TestCase> testCases) { this.testCases = testCases; }
}
