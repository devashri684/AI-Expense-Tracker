package com.example.AI_ExpenseTracker.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Maps to the "Title" field in your UI
    @Column(nullable = false)
    private String title;

    // Maps to the "Amount" field in your UI
    @Column(nullable = false)
    private BigDecimal amount;

    // Maps to the "Type" dropdown in your UI
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;

    // Needed for the "Category Breakdown" chart and "Filter by Category" UI
    @Column(nullable = false)
    private String category = "General";

    // Needed for the "Weekly Expenses" chart and date filtering
    @Column(nullable = false)
    private LocalDate date = LocalDate.now();
}