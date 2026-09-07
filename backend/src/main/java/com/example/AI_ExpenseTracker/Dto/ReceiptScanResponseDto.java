package com.example.AI_ExpenseTracker.Dto;

public class ReceiptScanResponseDto {
    private String merchant;
    private Double amount;
    private String category;
    private String date;

    public ReceiptScanResponseDto() {}

    public ReceiptScanResponseDto(String merchant, Double amount, String category, String date) {
        this.merchant = merchant;
        this.amount = amount;
        this.category = category;
        this.date = date;
    }

    public String getMerchant() {
        return merchant;
    }

    public void setMerchant(String merchant) {
        this.merchant = merchant;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
}