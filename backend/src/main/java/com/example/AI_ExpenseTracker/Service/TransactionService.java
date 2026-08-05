package com.example.AI_ExpenseTracker.Service;

import com.example.AI_ExpenseTracker.Dto.DashboardSummaryDTO;
import com.example.AI_ExpenseTracker.Entity.Transaction;
import com.example.AI_ExpenseTracker.Entity.TransactionType;
import com.example.AI_ExpenseTracker.Repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository repository;

    public Transaction saveTransaction(Transaction transaction) {
        if (transaction.getCategory() == null || transaction.getCategory().isEmpty()) {
            transaction.setCategory("General");
        }
        if (transaction.getDate() == null) {
            transaction.setDate(java.time.LocalDate.now());
        }
        return repository.save(transaction);
    }

    public List<Transaction> getAllTransactions() {
        return repository.findAllByOrderByDateDesc();
    }

    public void deleteTransaction(Long id) {
        repository.deleteById(id);
    }

    public DashboardSummaryDTO getSummary() {
        List<Transaction> transactions = repository.findAll();

        BigDecimal income = transactions.stream()
                .filter(t -> t.getType() == TransactionType.INCOME)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal expenses = transactions.stream()
                .filter(t -> t.getType() == TransactionType.EXPENSE)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal balance = income.subtract(expenses);

        return new DashboardSummaryDTO(balance, income, expenses, balance);
    }
}