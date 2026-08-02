package com.example.AI_ExpenseTracker.Repository;


import com.example.AI_ExpenseTracker.Entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}