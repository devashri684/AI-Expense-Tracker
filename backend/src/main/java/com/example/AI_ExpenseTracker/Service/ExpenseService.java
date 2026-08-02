package com.example.AI_ExpenseTracker.Service;

import com.example.AI_ExpenseTracker.Entity.Expense;

import java.util.List;

public interface ExpenseService {

    Expense addExpense(Expense expense);

    List<Expense> getAllExpenses();
                                                             //he sagal method override karaych in imppll
    List<Expense> getExpensesByUser(Long userId);

    void deleteExpense(Long id);
}