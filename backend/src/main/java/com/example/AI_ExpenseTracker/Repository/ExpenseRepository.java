package com.example.AI_ExpenseTracker.Repository;

import com.example.AI_ExpenseTracker.Entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.AI_ExpenseTracker.Entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUserId(Long userId);

    List<Expense> findByCategoryId(Long categoryId);
    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.type = 'INCOME' AND e.user.id = :userId")
    Double getTotalIncomeByUserId(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.type = 'EXPENSE' AND e.user.id = :userId")
    Double getTotalExpensesByUserId(@Param("userId") Long userId);
}