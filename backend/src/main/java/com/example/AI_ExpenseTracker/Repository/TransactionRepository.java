package com.example.AI_ExpenseTracker.Repository;



import com.example.AI_ExpenseTracker.Entity.Transaction; // Make sure this points to Entity.Transaction
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByDateBetweenOrderByDateDesc(LocalDate startDate, LocalDate endDate);
    List<Transaction> findAllByOrderByDateDesc();
}