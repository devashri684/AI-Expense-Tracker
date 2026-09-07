package com.example.AI_ExpenseTracker.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardSummaryDTO {
    private BigDecimal totalBalance;
    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal netSavings;
    private Double savingsRate;

    // Aggregations for dashboard charts
    private List<DailyExpenseDTO> weeklyExpenses;
    private List<CategoryExpenseDTO> categoryBreakdown;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DailyExpenseDTO {
        private String day;        // e.g. "Mon", "Tue", "Today"
        private String dateKey;    // e.g. "2026-09-04"
        private BigDecimal amount;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CategoryExpenseDTO {
        private String category;
        private BigDecimal amount;
    }
}