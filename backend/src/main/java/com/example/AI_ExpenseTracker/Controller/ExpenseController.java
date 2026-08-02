package com.example.AI_ExpenseTracker.Controller;

import com.example.AI_ExpenseTracker.Entity.Expense;
import com.example.AI_ExpenseTracker.Service.ExpenseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "http://localhost:3000") // ✅ Allow React frontend

public class ExpenseController {

    private final ExpenseService expenseService;

    // ✅ Constructor Injection (Best Practice)
    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    // ✅ CREATE Expense
    @PostMapping
    public Expense addExpense(@RequestBody Expense expense) {
        System.out.println("TITLE: " + expense.getTitle());
        System.out.println("USER: " + expense.getUser());
        System.out.println("CATEGORY: " + expense.getCategory());
        return expenseService.addExpense(expense);
    }

    // ✅ GET All Expenses
    @GetMapping
    public List<Expense> getAllExpenses() {
        return expenseService.getAllExpenses();
    }

    // ✅ GET Expenses by User ID
    @GetMapping("/user/{userId}")
    public List<Expense> getExpensesByUser(@PathVariable Long userId) {
        return expenseService.getExpensesByUser(userId);
    }

    // ✅ DELETE Expense
    @DeleteMapping("/{id}")
    public String deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return "Deleted successfully";
    }
}