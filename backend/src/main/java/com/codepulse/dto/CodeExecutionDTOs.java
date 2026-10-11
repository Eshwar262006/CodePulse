package com.codepulse.dto;

import java.util.List;

public class CodeExecutionDTOs {

    public static class ExecutionRequest {
        private Long problemId;
        private String language;
        private String code;

        public Long getProblemId() { return problemId; }
        public void setProblemId(Long problemId) { this.problemId = problemId; }

        public String getLanguage() { return language; }
        public void setLanguage(String language) { this.language = language; }

        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
    }

    public static class TestCaseResult {
        private int testCaseIndex;
        private boolean passed;
        private String input;
        private String expectedOutput;
        private String actualOutput;
        private String error;

        public TestCaseResult() {}

        public TestCaseResult(int testCaseIndex, boolean passed, String input, String expectedOutput, String actualOutput, String error) {
            this.testCaseIndex = testCaseIndex;
            this.passed = passed;
            this.input = input;
            this.expectedOutput = expectedOutput;
            this.actualOutput = actualOutput;
            this.error = error;
        }

        public int getTestCaseIndex() { return testCaseIndex; }
        public boolean isPassed() { return passed; }
        public String getInput() { return input; }
        public String getExpectedOutput() { return expectedOutput; }
        public String getActualOutput() { return actualOutput; }
        public String getError() { return error; }
    }

    public static class ExecutionResult {
        private String status; // ACCEPTED, WRONG_ANSWER, COMPILATION_ERROR, RUNTIME_ERROR, TIME_LIMIT_EXCEEDED
        private int passedTestCases;
        private int totalTestCases;
        private Long executionTimeMs;
        private Double memoryUsedMb;
        private String outputLog;
        private List<TestCaseResult> testResults;
        private Long submissionId;

        public ExecutionResult() {}

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public int getPassedTestCases() { return passedTestCases; }
        public void setPassedTestCases(int passedTestCases) { this.passedTestCases = passedTestCases; }

        public int getTotalTestCases() { return totalTestCases; }
        public void setTotalTestCases(int totalTestCases) { this.totalTestCases = totalTestCases; }

        public Long getExecutionTimeMs() { return executionTimeMs; }
        public void setExecutionTimeMs(Long executionTimeMs) { this.executionTimeMs = executionTimeMs; }

        public Double getMemoryUsedMb() { return memoryUsedMb; }
        public void setMemoryUsedMb(Double memoryUsedMb) { this.memoryUsedMb = memoryUsedMb; }

        public String getOutputLog() { return outputLog; }
        public void setOutputLog(String outputLog) { this.outputLog = outputLog; }

        public List<TestCaseResult> getTestResults() { return testResults; }
        public void setTestResults(List<TestCaseResult> testResults) { this.testResults = testResults; }

        public Long getSubmissionId() { return submissionId; }
        public void setSubmissionId(Long submissionId) { this.submissionId = submissionId; }
    }
}
