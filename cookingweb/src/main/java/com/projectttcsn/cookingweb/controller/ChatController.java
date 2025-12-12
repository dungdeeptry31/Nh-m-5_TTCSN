package com.projectttcsn.cookingweb.controller;

import com.projectttcsn.cookingweb.dto.ChatRequest;
import com.projectttcsn.cookingweb.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping
    public ResponseEntity<?> chatWithAI(@RequestBody ChatRequest request) {
        String aiResponse = chatService.getChatResponse(request.getPrompt());
        
        // Trả về JSON
        Map<String, String> response = new HashMap<>();
        response.put("response", aiResponse);
        
        return ResponseEntity.ok(response);
    }
}