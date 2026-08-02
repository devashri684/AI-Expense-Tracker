package com.example.AI_ExpenseTracker.Dto;

public class ExpenseDto {

    private String title;
    private Double amount;
    private Long userId;
    private Long categoryId;

    // Default constructor
    public ExpenseDto() {}

    // Getters
    public String getTitle() {
        return title;
    }

    public Double getAmount() {
        return amount;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    // Setters
    public void setTitle(String title) {
        this.title = title;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }
}
