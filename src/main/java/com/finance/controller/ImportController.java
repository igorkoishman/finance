package com.finance.controller;

import com.finance.dto.PendingTransactionDTO;
import com.finance.service.ImportService;
import com.finance.repository.TransactionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/finance/api/v1/import")
public class ImportController {

    private final ImportService importService;
    private final TransactionRepository transactionRepository;

    public ImportController(ImportService importService, TransactionRepository transactionRepository) {
        this.importService = importService;
        this.transactionRepository = transactionRepository;
    }

    @PostMapping("/upload")
    public ResponseEntity<List<PendingTransactionDTO>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("sourceType") String sourceType) {
        try {
            List<PendingTransactionDTO> dtos = importService.parseStatement(file.getInputStream(), sourceType);
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/topics")
    public ResponseEntity<List<String>> getTopics() {
        return ResponseEntity.ok(transactionRepository.findDistinctTopics());
    }

    @GetMapping("/payment-methods")
    public ResponseEntity<List<String>> getPaymentMethods() {
        return ResponseEntity.ok(transactionRepository.findDistinctPaymentMethods());
    }

    @PostMapping("/save")
    public ResponseEntity<Map<String, String>> saveTransactions(@RequestBody List<PendingTransactionDTO> transactions) {
        importService.saveTransactions(transactions);
        return ResponseEntity.ok(Map.of("message", "Successfully saved " + transactions.size() + " transactions."));
    }
}
