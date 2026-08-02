package com.example.AI_ExpenseTracker.Service;

import com.example.AI_ExpenseTracker.Entity.*;
import com.example.AI_ExpenseTracker.Repository.*;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Service
public class ExpenseServiceImpl implements ExpenseService {

    @Autowired
    private final ExpenseRepository expenseRepository;
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final CategoryRepository categoryRepository;

    public ExpenseServiceImpl(
            ExpenseRepository expenseRepository,
            UserRepository userRepository,                   //i can use @RequiredArgsConstructor insted of these
            CategoryRepository categoryRepository
    ) {
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public Expense addExpense(Expense expense) {

        // 🔥 FETCH REAL USER & CATEGORY FROM DB
        User user = userRepository.findById(expense.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Category category = categoryRepository.findById(expense.getCategory().getId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // 🔥 SET VALUES PROPERLY
        expense.setUser(user);
        expense.setCategory(category);

        return expenseRepository.save(expense);
    }

    @Override
    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    @Override
    public List<Expense> getExpensesByUser(Long userId) {
        return expenseRepository.findAll(); // improve later
    }

    @Override
    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }
}