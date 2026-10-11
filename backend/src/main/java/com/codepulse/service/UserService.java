package com.codepulse.service;

import com.codepulse.model.User;
import com.codepulse.repository.UserRepository;
import com.codepulse.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User getCurrentUserProfile() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateProfile(Map<String, String> updates) {
        User user = getCurrentUserProfile();
        if (updates.containsKey("name")) user.setName(updates.get("name"));
        if (updates.containsKey("preferredLanguage")) user.setPreferredLanguage(updates.get("preferredLanguage"));
        return userRepository.save(user);
    }
}
