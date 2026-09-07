package com.example.AI_ExpenseTracker.Controller;

import com.example.AI_ExpenseTracker.Dto.ReceiptScanResponseDto;
import com.example.AI_ExpenseTracker.Entity.Expense;
import com.example.AI_ExpenseTracker.Service.ExpenseService;
import com.example.AI_ExpenseTracker.Service.ReceiptScannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowedHeaders = "*")
public class ExpenseController {

    private final ExpenseService expenseService;

    @Autowired
    private ReceiptScannerService receiptScannerService;

    // Constructor Injection
    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    // CREATE Expense
    @PostMapping
    public Expense addExpense(@RequestBody Expense expense) {
        return expenseService.addExpense(expense);
    }

    // GET All Expenses
    @GetMapping
    public List<Expense> getAllExpenses() {
        return expenseService.getAllExpenses();
    }

    // GET Expenses by User ID
    @GetMapping("/user/{userId}")
    public List<Expense> getExpensesByUser(@PathVariable Long userId) {
        return expenseService.getExpensesByUser(userId);
    }

    // DELETE Expense
    @DeleteMapping("/{id}")
    public String deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return "Deleted successfully";
    }

    // AI RECEIPT SCANNER
    @PostMapping("/scan-receipt")
    public ResponseEntity<?> scanReceipt(@RequestParam("receipt") MultipartFile receipt) {
        try {
            if (receipt.isEmpty()) {
                return ResponseEntity.badRequest().body("Uploaded file is empty.");
            }
            ReceiptScanResponseDto result = receiptScannerService.scanReceipt(receipt);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to parse receipt: " + e.getMessage());
        }
    }
}