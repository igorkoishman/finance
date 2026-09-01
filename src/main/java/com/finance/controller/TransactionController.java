package com.finance.controller;

import com.finance.model.Transaction;
import com.finance.repository.TransactionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.web.bind.annotation.*;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/finance/transactions/v1")
public class TransactionController {

    private final TransactionRepository transactionRepository;

    public TransactionController(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @GetMapping
    public Page<Transaction> getTransactions(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) List<Integer> years,
            @RequestParam(required = false) List<Integer> months,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);

        Specification<Transaction> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (type != null && !type.isEmpty()) {
                predicates.add(cb.equal(root.get("txnType"), type));
            }

            if (years != null && !years.isEmpty()) {
                predicates.add(root.get("txnYear").in(years));
            }

            if (months != null && !months.isEmpty()) {
                predicates.add(root.get("txnMonthNum").in(months));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return transactionRepository.findAll(spec, pageable);
    }

    @GetMapping("/topics")
    public List<String> getUniqueTopics() {
        return transactionRepository.findDistinctTopics();
    }
}
