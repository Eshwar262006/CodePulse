package com.codepulse.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "code_analyses")
public class CodeAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id", nullable = false)
    @JsonIgnore
    private Submission submission;

    private String correctness;

    @Column(name = "time_complexity")
    private String timeComplexity;

    @Column(name = "space_complexity")
    private String spaceComplexity;

    @Column(name = "target_time_complexity")
    private String targetTimeComplexity;

    @Column(name = "target_space_complexity")
    private String targetSpaceComplexity;

    @Column(name = "code_quality")
    private int codeQuality = 85;

    @Column(name = "is_optimal")
    private boolean isOptimal = false;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Column(name = "optimized_code", columnDefinition = "TEXT")
    private String optimizedCode;

    @Column(name = "learning_recommendation")
    private String learningRecommendation;

    @Column(name = "learning_topic")
    private String learningTopic;

    @Column(columnDefinition = "TEXT")
    private String tradeoffs;

    public CodeAnalysis() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Submission getSubmission() { return submission; }
    public void setSubmission(Submission submission) { this.submission = submission; }

    public String getCorrectness() { return correctness; }
    public void setCorrectness(String correctness) { this.correctness = correctness; }

    public String getTimeComplexity() { return timeComplexity; }
    public void setTimeComplexity(String timeComplexity) { this.timeComplexity = timeComplexity; }

    public String getSpaceComplexity() { return spaceComplexity; }
    public void setSpaceComplexity(String spaceComplexity) { this.spaceComplexity = spaceComplexity; }

    public String getTargetTimeComplexity() { return targetTimeComplexity; }
    public void setTargetTimeComplexity(String targetTimeComplexity) { this.targetTimeComplexity = targetTimeComplexity; }

    public String getTargetSpaceComplexity() { return targetSpaceComplexity; }
    public void setTargetSpaceComplexity(String targetSpaceComplexity) { this.targetSpaceComplexity = targetSpaceComplexity; }

    public int getCodeQuality() { return codeQuality; }
    public void setCodeQuality(int codeQuality) { this.codeQuality = codeQuality; }

    public boolean isOptimal() { return isOptimal; }
    public void setOptimal(boolean optimal) { isOptimal = optimal; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public String getOptimizedCode() { return optimizedCode; }
    public void setOptimizedCode(String optimizedCode) { this.optimizedCode = optimizedCode; }

    public String getLearningRecommendation() { return learningRecommendation; }
    public void setLearningRecommendation(String learningRecommendation) { this.learningRecommendation = learningRecommendation; }

    public String getLearningTopic() { return learningTopic; }
    public void setLearningTopic(String learningTopic) { this.learningTopic = learningTopic; }

    public String getTradeoffs() { return tradeoffs; }
    public void setTradeoffs(String tradeoffs) { this.tradeoffs = tradeoffs; }
}
