package com.example.AI_ExpenseTracker.Repository;


import com.example.AI_ExpenseTracker.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

}