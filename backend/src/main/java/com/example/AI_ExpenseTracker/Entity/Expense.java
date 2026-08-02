package com.example.AI_ExpenseTracker.Entity;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double amount;
    private String title;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"expenses"})   // 🔥 ADD THIS
    private User user;

    @ManyToOne
    @JoinColumn(name = "category_id")
    @JsonIgnoreProperties({"expenses"})   // 🔥 ADD THIS
    private Category category;
}