package com.example.AI_ExpenseTracker.Repository;

import com.example.AI_ExpenseTracker.Entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    // Fetch all expenses globally sorted newest first (by date, then ID)
    List<Expense> findAllByOrderByDateDescIdDesc();

    // Fetch expenses for a specific user, sorted newest first
    List<Expense> findByUserIdOrderByDateDescIdDesc(Long userId);

    // Fetch expenses for a specific category, sorted newest first
    List<Expense> findByCategoryIdOrderByDateDescIdDesc(Long categoryId);

    // Retained for backward compatibility
    List<Expense> findByUserId(Long userId);

    List<Expense> findByCategoryId(Long categoryId);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.type = 'INCOME' AND e.user.id = :userId")
    Double getTotalIncomeByUserId(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.type = 'EXPENSE' AND e.user.id = :userId")
    Double getTotalExpensesByUserId(@Param("userId") Long userId);
}