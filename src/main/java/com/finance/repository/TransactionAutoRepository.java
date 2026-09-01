package com.finance.repository;

import com.finance.model.TransactionAuto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionAutoRepository extends JpaRepository<TransactionAuto, Long> {
}
