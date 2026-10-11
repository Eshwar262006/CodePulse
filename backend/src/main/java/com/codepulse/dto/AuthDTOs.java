package com.codepulse.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthDTOs {

    public static class LoginRequest {
        @NotBlank
        private String username;

        @NotBlank
        private String password;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class RegisterRequest {
        @NotBlank
        private String name;

        @NotBlank
        @Size(min = 3, max = 30)
        private String username;

        @NotBlank
        @Email
        private String email;

        @NotBlank
        @Size(min = 6, max = 40)
        private String password;

        private String preferredLanguage = "Java";

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getPreferredLanguage() { return preferredLanguage; }
        public void setPreferredLanguage(String preferredLanguage) { this.preferredLanguage = preferredLanguage; }
    }

    public static class JwtResponse {
        private String token;
        private Long id;
        private String username;
        private String email;
        private String name;
        private String role;
        private String preferredLanguage;

        public JwtResponse(String token, Long id, String username, String email, String name, String role, String preferredLanguage) {
            this.token = token;
            this.id = id;
            this.username = username;
            this.email = email;
            this.name = name;
            this.role = role;
            this.preferredLanguage = preferredLanguage;
        }

        public String getToken() { return token; }
        public Long getId() { return id; }
        public String getUsername() { return username; }
        public String getEmail() { return email; }
        public String getName() { return name; }
        public String getRole() { return role; }
        public String getPreferredLanguage() { return preferredLanguage; }
    }

    public static class MessageResponse {
        private String message;
        public MessageResponse(String message) { this.message = message; }
        public String getMessage() { return message; }
    }
}
