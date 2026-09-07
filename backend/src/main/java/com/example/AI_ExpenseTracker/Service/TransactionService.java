package com.example.AI_ExpenseTracker.Service;

import com.example.AI_ExpenseTracker.Dto.DashboardSummaryDTO;
import com.example.AI_ExpenseTracker.Entity.Transaction;
import com.example.AI_ExpenseTracker.Entity.TransactionType;
import com.example.AI_ExpenseTracker.Repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository repository;

    public Transaction saveTransaction(Transaction transaction) {
        if (transaction.getCategory() == null || transaction.getCategory().isEmpty()) {
            transaction.setCategory("General");
        }
        if (transaction.getDate() == null) {
            transaction.setDate(LocalDate.now());
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
        LocalDate today = LocalDate.now();

        BigDecimal income = transactions.stream()
                .filter(t -> t.getType() == TransactionType.INCOME)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal expenses = transactions.stream()
                .filter(t -> t.getType() == TransactionType.EXPENSE || t.getType() == null)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal balance = income.subtract(expenses);

        BigDecimal netSavings = income.compareTo(BigDecimal.ZERO) > 0
                ? income.subtract(expenses)
                .divide(income, 4, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100"))
                .setScale(2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        Double savingsRate = netSavings.doubleValue();

        // Build rolling 7-day expense buckets
        List<DashboardSummaryDTO.DailyExpenseDTO> weeklyExpenses = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate currentDay = today.minusDays(i);
            String dayLabel = (i == 0) ? "Today" : currentDay.getDayOfWeek().toString().substring(0, 3);

            BigDecimal daySum = transactions.stream()
                    .filter(t -> t.getType() == TransactionType.EXPENSE || t.getType() == null)
                    .filter(t -> t.getDate() != null && t.getDate().isEqual(currentDay))
                    .map(Transaction::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            weeklyExpenses.add(new DashboardSummaryDTO.DailyExpenseDTO(dayLabel, currentDay.toString(), daySum));
        }

        // Build category breakdown
        Map<String, BigDecimal> categoryMap = transactions.stream()
                .filter(t -> t.getType() == TransactionType.EXPENSE || t.getType() == null)
                .collect(Collectors.groupingBy(
                        t -> (t.getCategory() != null && !t.getCategory().isBlank()) ? t.getCategory() : "General",
                        Collectors.reducing(BigDecimal.ZERO, Transaction::getAmount, BigDecimal::add)
                ));

        List<DashboardSummaryDTO.CategoryExpenseDTO> categoryBreakdown = categoryMap.entrySet().stream()
                .map(entry -> new DashboardSummaryDTO.CategoryExpenseDTO(entry.getKey(), entry.getValue()))
                .toList();

        return DashboardSummaryDTO.builder()
                .totalBalance(balance)
                .totalIncome(income)
                .totalExpenses(expenses)
                .netSavings(netSavings)
                .savingsRate(savingsRate)
                .weeklyExpenses(weeklyExpenses)
                .categoryBreakdown(categoryBreakdown)
                .build();
    }
}