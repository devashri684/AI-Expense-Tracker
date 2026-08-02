package com.example.AI_ExpenseTracker.Repository;

import com.example.AI_ExpenseTracker.Entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUserId(Long userId);

    List<Expense> findByCategoryId(Long categoryId);
}