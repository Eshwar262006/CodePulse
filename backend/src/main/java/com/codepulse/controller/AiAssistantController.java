package com.codepulse.controller;

import com.codepulse.dto.AiAssistantDTOs.ChatRequest;
import com.codepulse.dto.AiAssistantDTOs.ChatResponse;
import com.codepulse.service.ai.AiAssistantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AiAssistantController {

    @Autowired
    private AiAssistantService aiAssistantService;

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chatWithAiAssistant(@RequestBody ChatRequest request) {
        ChatResponse response = aiAssistantService.processChat(request);
        return ResponseEntity.ok(response);
    }
}
