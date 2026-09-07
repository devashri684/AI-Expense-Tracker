package com.example.AI_ExpenseTracker.Service;

import com.example.AI_ExpenseTracker.Dto.AiChatResponseDto;
import com.example.AI_ExpenseTracker.Dto.AiInsightsResponseDto;
import com.example.AI_ExpenseTracker.Entity.Expense;
import com.example.AI_ExpenseTracker.Repository.ExpenseRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AiAdvisorService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final ExpenseRepository expenseRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Stable production models with independent rate limits
    private static final List<String> CANDIDATE_MODELS = List.of(
            "gemini-3.6-flash",
            "gemini-2.5-flash",
            "gemini-1.5-flash"
    );

    public AiAdvisorService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public AiInsightsResponseDto generateFinancialAdvice() {
        List<Expense> expenses = expenseRepository.findAll();

        if (expenses.isEmpty()) {
            return new AiInsightsResponseDto(
                    "No transactions recorded yet. Add entries or scan receipts to unlock AI analysis.",
                    List.of("Zero transactions found in the database."),
                    List.of("Log your daily expenses and income entries."),
                    "LOW"
            );
        }

        // 1. Aggregate income and expense totals
        double totalIncome = 0.0;
        double totalExpenses = 0.0;

        for (Expense e : expenses) {
            String typeStr = e.getType() != null ? e.getType().toString().toUpperCase() : "EXPENSE";
            double amt = e.getAmount();

            if ("INCOME".equals(typeStr)) {
                totalIncome += amt;
            } else {
                totalExpenses += amt;
            }
        }

        // 2. Category Breakdown
        Map<String, Double> categoryTotals = new HashMap<>();
        for (Expense exp : expenses) {
            String typeStr = exp.getType() != null ? exp.getType().toString().toUpperCase() : "EXPENSE";
            if (!"INCOME".equals(typeStr)) {
                String catName = (exp.getCategory() != null && exp.getCategory().getName() != null)
                        ? exp.getCategory().getName()
                        : "General";
                double amt = exp.getAmount();
                categoryTotals.put(catName, categoryTotals.getOrDefault(catName, 0.0) + amt);
            }
        }

        double netSavings = totalIncome - totalExpenses;

        String prompt = String.format(
                "You are an expert personal financial advisor. Analyze this real financial profile in Indian Rupees (INR):\n" +
                        "- Total Income: ₹%.2f\n" +
                        "- Total Expenses: ₹%.2f\n" +
                        "- Net Savings: ₹%.2f\n" +
                        "- Category Breakdown: %s\n\n" +
                        "Provide realistic, high-value financial observations and savings recommendations tailored to this budget.\n" +
                        "Respond ONLY with a valid JSON object matching this schema:\n" +
                        "{\n" +
                        "  \"executiveSummary\": \"2-3 concise sentences summarizing their financial posture and health.\",\n" +
                        "  \"keyObservations\": [\"point 1\", \"point 2\", \"point 3\"],\n" +
                        "  \"actionableRecommendations\": [\"action 1\", \"action 2\", \"action 3\"],\n" +
                        "  \"riskLevel\": \"LOW | MODERATE | HIGH\"\n" +
                        "}\n" +
                        "Do NOT include markdown formatting or backticks.",
                totalIncome, totalExpenses, netSavings, categoryTotals
        );

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt)))),
                "generationConfig", Map.of("response_mime_type", "application/json")
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        for (String model : CANDIDATE_MODELS) {
            try {
                String url = String.format(
                        "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s",
                        model, apiKey != null ? apiKey.trim() : ""
                );

                ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
                JsonNode rootNode = objectMapper.readTree(response.getBody());

                String extractedJson = rootNode
                        .path("candidates").get(0)
                        .path("content")
                        .path("parts").get(0)
                        .path("text").asText().trim();

                extractedJson = cleanMarkdown(extractedJson);
                return objectMapper.readValue(extractedJson, AiInsightsResponseDto.class);
            } catch (HttpStatusCodeException ex) {
                System.err.println("Gemini [" + model + "] failed: HTTP " + ex.getStatusCode() + " - " + ex.getResponseBodyAsString());
            } catch (Exception ex) {
                System.err.println("Gemini [" + model + "] error: " + ex.getMessage());
            }
        }

        // Offline contingency calculation with accurate dynamic numbers
        String risk = netSavings < 0 ? "HIGH" : (totalExpenses > totalIncome * 0.7 ? "MODERATE" : "LOW");

        return new AiInsightsResponseDto(
                String.format("You have saved ₹%.2f from an income of ₹%.2f. AI analysis is currently running in offline contingency mode.", netSavings, totalIncome),
                List.of(
                        String.format("Total expenses recorded: ₹%.2f", totalExpenses),
                        String.format("Total income recorded: ₹%.2f", totalIncome),
                        String.format("Net surplus remaining: ₹%.2f", netSavings)
                ),
                List.of(
                        "Review your highest category expenditures to find direct cutback areas.",
                        "Aim to maintain at least a 20% savings buffer each month."
                ),
                risk
        );
    }

    public AiChatResponseDto askCopilot(String userMessage) {
        List<Expense> expenses = expenseRepository.findAll();

        double totalIncome = 0.0;
        double totalExpenses = 0.0;

        for (Expense e : expenses) {
            String typeStr = e.getType() != null ? e.getType().toString().toUpperCase() : "EXPENSE";
            double amt = e.getAmount();

            if ("INCOME".equals(typeStr)) {
                totalIncome += amt;
            } else {
                totalExpenses += amt;
            }
        }

        double netSavings = totalIncome - totalExpenses;

        Map<String, Double> categoryTotals = new HashMap<>();
        for (Expense exp : expenses) {
            String typeStr = exp.getType() != null ? exp.getType().toString().toUpperCase() : "EXPENSE";
            if (!"INCOME".equals(typeStr)) {
                String catName = (exp.getCategory() != null && exp.getCategory().getName() != null)
                        ? exp.getCategory().getName()
                        : "General";
                double amt = exp.getAmount();
                categoryTotals.put(catName, categoryTotals.getOrDefault(catName, 0.0) + amt);
            }
        }

        String prompt = String.format(
                "You are an intuitive, direct personal financial AI assistant. Analyze this real financial ledger in INR (₹):\n" +
                        "- Total Recorded Income: ₹%.2f\n" +
                        "- Total Recorded Expenses: ₹%.2f\n" +
                        "- Current Net Savings Surplus: ₹%.2f\n" +
                        "- Spending Breakdown: %s\n\n" +
                        "User Question: \"%s\"\n\n" +
                        "Provide a concise, direct, helpful, and realistic response (3-5 sentences maximum). " +
                        "If they ask whether they can afford a purchase, compare it against their current net surplus, monthly cashflow, and safety margin. " +
                        "Do NOT use markdown headers or codeblocks; keep it clean conversational prose.",
                totalIncome, totalExpenses, netSavings, categoryTotals, userMessage
        );

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt))))
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        for (String model : CANDIDATE_MODELS) {
            try {
                String url = String.format(
                        "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s",
                        model, apiKey != null ? apiKey.trim() : ""
                );

                ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
                JsonNode rootNode = objectMapper.readTree(response.getBody());

                String reply = rootNode
                        .path("candidates").get(0)
                        .path("content")
                        .path("parts").get(0)
                        .path("text").asText().trim();

                return new AiChatResponseDto(cleanMarkdown(reply));
            } catch (HttpStatusCodeException ex) {
                System.err.println("Copilot [" + model + "] failed: HTTP " + ex.getStatusCode() + " - " + ex.getResponseBodyAsString());
            } catch (Exception ex) {
                System.err.println("Copilot [" + model + "] error: " + ex.getMessage());
            }
        }

        return new AiChatResponseDto(
                String.format("Based on your recorded net savings of ₹%.2f, ensure major purchases do not exceed your monthly discretionary cushion.", netSavings)
        );
    }

    private String cleanMarkdown(String text) {
        if (text == null) return "";
        String cleaned = text.trim();
        if (cleaned.startsWith("```json")) cleaned = cleaned.substring(7);
        if (cleaned.startsWith("```")) cleaned = cleaned.substring(3);
        if (cleaned.endsWith("```")) cleaned = cleaned.substring(0, cleaned.length() - 3);
        return cleaned.trim();
    }
}