package com.codepulse.controller;

import com.codepulse.model.User;
import com.codepulse.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile() {
        return ResponseEntity.ok(userService.getCurrentUserProfile());
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@RequestBody Map<String, String> updates) {
        return ResponseEntity.ok(userService.updateProfile(updates));
    }
}
