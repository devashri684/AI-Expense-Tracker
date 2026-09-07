package com.example.AI_ExpenseTracker.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AiInsightsResponseDto {
    private String executiveSummary;
    private List<String> keyObservations;
    private List<String> actionableRecommendations;
    private String riskLevel; // LOW, MODERATE, HIGH
}