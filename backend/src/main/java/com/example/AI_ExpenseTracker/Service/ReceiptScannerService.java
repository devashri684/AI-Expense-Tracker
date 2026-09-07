package com.example.AI_ExpenseTracker.Service;

import com.example.AI_ExpenseTracker.Dto.ReceiptScanResponseDto;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
public class ReceiptScannerService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ReceiptScanResponseDto scanReceipt(MultipartFile file) throws IOException {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            throw new IllegalStateException("gemini.api.key is missing in application.properties");
        }

        String mimeType = file.getContentType();
        if (mimeType == null || !mimeType.startsWith("image/")) {
            mimeType = "image/jpeg";
        }

        String base64Image = Base64.getEncoder().encodeToString(file.getBytes());

        // Use gemini-2.0-flash or gemini-1.5-flash
        // Update the model string to gemini-3.6-flash
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=" + apiKey.trim();
        String prompt = "You are a receipt parser. Return ONLY a single JSON object with these keys: " +
                "\"merchant\" (string), \"amount\" (number), \"category\" (one of: Food, Transport, Groceries, Shopping, Bills, Other), \"date\" (YYYY-MM-DD). Do not include markdown code ticks.";

        Map<String, Object> textPart = Map.of("text", prompt);
        Map<String, Object> inlineData = Map.of("mime_type", mimeType, "data", base64Image);
        Map<String, Object> imagePart = Map.of("inline_data", inlineData);

        Map<String, Object> content = Map.of("parts", List.of(textPart, imagePart));
        Map<String, Object> requestBody = Map.of(
                "contents", List.of(content),
                "generationConfig", Map.of("response_mime_type", "application/json")
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

            JsonNode rootNode = objectMapper.readTree(response.getBody());
            String extractedJsonText = rootNode
                    .path("candidates").get(0)
                    .path("content")
                    .path("parts").get(0)
                    .path("text").asText().trim();

            if (extractedJsonText.startsWith("```json")) {
                extractedJsonText = extractedJsonText.substring(7);
            }
            if (extractedJsonText.startsWith("```")) {
                extractedJsonText = extractedJsonText.substring(3);
            }
            if (extractedJsonText.endsWith("```")) {
                extractedJsonText = extractedJsonText.substring(0, extractedJsonText.length() - 3);
            }

            return objectMapper.readValue(extractedJsonText.trim(), ReceiptScanResponseDto.class);

        } catch (HttpStatusCodeException ex) {
            System.err.println("=== GEMINI API REJECTION ===");
            System.err.println("Status: " + ex.getStatusCode());
            System.err.println("Body: " + ex.getResponseBodyAsString());
            throw new RuntimeException("Gemini API Error: " + ex.getResponseBodyAsString(), ex);
        }
    }
}