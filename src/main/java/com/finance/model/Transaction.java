package com.finance.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "txn_month")
    private LocalDate txnMonth;

    @Column(name = "txn_year", insertable = false, updatable = false)
    private Integer txnYear;

    @Column(name = "txn_month_num", insertable = false, updatable = false)
    private Integer txnMonthNum;

    @Column(name = "txn_type")
    private String txnType;

    private BigDecimal amount;
    private String category;
    private String topic;
    private String actor;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "source_name")
    private String sourceName;

    private Integer installments;

    @Column(name = "installment_no")
    private Integer installmentNo;

    @Column(name = "remaining_amount")
    private BigDecimal remainingAmount;

    @Column(name = "sheet_name")
    private String sheetName;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDate getTxnMonth() { return txnMonth; }
    public void setTxnMonth(LocalDate txnMonth) { this.txnMonth = txnMonth; }
    public Integer getTxnYear() { return txnYear; }
    public void setTxnYear(Integer txnYear) { this.txnYear = txnYear; }
    public Integer getTxnMonthNum() { return txnMonthNum; }
    public void setTxnMonthNum(Integer txnMonthNum) { this.txnMonthNum = txnMonthNum; }
    public String getTxnType() { return txnType; }
    public void setTxnType(String txnType) { this.txnType = txnType; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }
    public String getActor() { return actor; }
    public void setActor(String actor) { this.actor = actor; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getSourceName() { return sourceName; }
    public void setSourceName(String sourceName) { this.sourceName = sourceName; }
    public Integer getInstallments() { return installments; }
    public void setInstallments(Integer installments) { this.installments = installments; }
    public Integer getInstallmentNo() { return installmentNo; }
    public void setInstallmentNo(Integer installmentNo) { this.installmentNo = installmentNo; }
    public BigDecimal getRemainingAmount() { return remainingAmount; }
    public void setRemainingAmount(BigDecimal remainingAmount) { this.remainingAmount = remainingAmount; }
    public String getSheetName() { return sheetName; }
    public void setSheetName(String sheetName) { this.sheetName = sheetName; }
}
