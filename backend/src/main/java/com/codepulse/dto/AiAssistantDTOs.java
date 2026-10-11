package com.codepulse.dto;

public class AiAssistantDTOs {

    public static class ChatRequest {
        private String message;
        private Long problemId;
        private String problemTitle;
        private String language;
        private String code;
        private String executionStatus;
        private String errorLog;

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public Long getProblemId() { return problemId; }
        public void setProblemId(Long problemId) { this.problemId = problemId; }

        public String getProblemTitle() { return problemTitle; }
        public void setProblemTitle(String problemTitle) { this.problemTitle = problemTitle; }

        public String getLanguage() { return language; }
        public void setLanguage(String language) { this.language = language; }

        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }

        public String getExecutionStatus() { return executionStatus; }
        public void setExecutionStatus(String executionStatus) { this.executionStatus = executionStatus; }

        public String getErrorLog() { return errorLog; }
        public void setErrorLog(String errorLog) { this.errorLog = errorLog; }
    }

    public static class ChatResponse {
        private String reply;
        private String topic;
        private String codeSnippet;
        private String hint;

        public ChatResponse() {}

        public ChatResponse(String reply, String topic, String codeSnippet, String hint) {
            this.reply = reply;
            this.topic = topic;
            this.codeSnippet = codeSnippet;
            this.hint = hint;
        }

        public String getReply() { return reply; }
        public void setReply(String reply) { this.reply = reply; }

        public String getTopic() { return topic; }
        public void setTopic(String topic) { this.topic = topic; }

        public String getCodeSnippet() { return codeSnippet; }
        public void setCodeSnippet(String codeSnippet) { this.codeSnippet = codeSnippet; }

        public String getHint() { return hint; }
        public void setHint(String hint) { this.hint = hint; }
    }
}
