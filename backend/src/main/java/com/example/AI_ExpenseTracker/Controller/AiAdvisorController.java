package com.example.AI_ExpenseTracker.Controller;

import com.example.AI_ExpenseTracker.Dto.AiInsightsResponseDto;
import com.example.AI_ExpenseTracker.Service.AiAdvisorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.AI_ExpenseTracker.Dto.AiChatRequestDto;
import com.example.AI_ExpenseTracker.Dto.AiChatResponseDto;

@RestController
@RequestMapping("/api/expenses/ai") // Matches baseURL (/api/expenses) + /ai/insights
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"}, allowedHeaders = "*")
public class AiAdvisorController {

    private final AiAdvisorService aiAdvisorService;

    public AiAdvisorController(AiAdvisorService aiAdvisorService) {
        this.aiAdvisorService = aiAdvisorService;
    }

    @GetMapping("/insights")
    public ResponseEntity<AiInsightsResponseDto> getInsights() {
        return ResponseEntity.ok(aiAdvisorService.generateFinancialAdvice());
    }
    // Add inside AiAdvisorController class:
    @PostMapping("/chat")
    public ResponseEntity<AiChatResponseDto> chatWithAdvisor(@RequestBody AiChatRequestDto request) {
        if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new AiChatResponseDto("Please ask a valid question."));
        }
        return ResponseEntity.ok(aiAdvisorService.askCopilot(request.getMessage().trim()));
    }
}