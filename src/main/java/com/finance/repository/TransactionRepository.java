package com.finance.repository;

import com.finance.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long>, JpaSpecificationExecutor<Transaction> {
    
    @Query("SELECT DISTINCT t.topic FROM Transaction t WHERE t.topic IS NOT NULL")
    List<String> findDistinctTopics();

    @Query("SELECT DISTINCT t.paymentMethod FROM Transaction t WHERE t.paymentMethod IS NOT NULL")
    List<String> findDistinctPaymentMethods();
}
