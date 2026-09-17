package com.finance.service;

import com.finance.dto.PendingTransactionDTO;
import com.finance.model.TransactionAuto;
import com.finance.repository.TransactionAutoRepository;
import com.finance.service.parser.PdfParser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.io.InputStream;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ImportService {

    private final List<PdfParser> parsers;
    private final TransactionAutoRepository transactionAutoRepository;

    public ImportService(List<PdfParser> parsers, TransactionAutoRepository transactionAutoRepository) {
        this.parsers = parsers;
        this.transactionAutoRepository = transactionAutoRepository;
    }

    public List<PendingTransactionDTO> parseStatement(InputStream fileStream, String sourceType) throws Exception {
        PdfParser parser = parsers.stream()
                .filter(p -> p.supports(sourceType))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unsupported source type: " + sourceType));

        return parser.parse(fileStream);
    }

    @Transactional
    public void saveTransactions(List<PendingTransactionDTO> pendingTransactions) {
        List<TransactionAuto> entities = pendingTransactions.stream().map(dto -> {
            TransactionAuto entity = new TransactionAuto();
            entity.setTxnMonth(dto.getTxnMonth());
            
            if (dto.getTxnMonth() != null) {
                entity.setTxnYear(dto.getTxnMonth().getYear());
                entity.setTxnMonthNum(dto.getTxnMonth().getMonthValue());
            }
            
            entity.setTxnType(dto.getTxnType());
            entity.setAmount(dto.getAmount());
            entity.setCategory(dto.getCategory());
            entity.setTopic(dto.getTopic());
            entity.setActor(dto.getActor());
            entity.setPaymentMethod(dto.getPaymentMethod());
            entity.setSourceName(dto.getSourceName());
            entity.setInstallments(dto.getInstallments());
            entity.setInstallmentNo(dto.getInstallmentNo());
            
            // Calculate remaining amount if needed or use from DTO
            if (dto.getRemainingAmount() != null) {
                entity.setRemainingAmount(dto.getRemainingAmount());
            } else if (dto.getInstallments() != null && dto.getInstallmentNo() != null && dto.getAmount() != null) {
                entity.setRemainingAmount(
                    dto.getAmount().multiply(new java.math.BigDecimal(dto.getInstallments() - dto.getInstallmentNo()))
                );
            }
            
            entity.setSheetName(dto.getSheetName());
            return entity;
        }).collect(Collectors.toList());

        transactionAutoRepository.saveAll(entities);
    }
}
