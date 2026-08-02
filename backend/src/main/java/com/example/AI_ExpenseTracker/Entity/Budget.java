package com.example.AI_ExpenseTracker.Entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "budgets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double monthlyLimit;

    private String month;

    // Many budgets → one user
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}