# Data Model: File Import Dashboard

## Entities

### `PendingTransactionDTO`
Transient object used to transfer parsed PDF data to the frontend, and verified data back to the backend.

**Fields**:
- `id` (String/UUID): Temporary ID for React/ag-grid rendering and updates.
- `txnMonth` (LocalDate): Parsed to the 1st of the relevant month (e.g., `2026-08-01`).
- `txnType` (String): Typically "Expense".
- `amount` (BigDecimal): Extracted charge amount.
- `category` (String): Extracted merchant name / description.
- `topic` (String): Categorization topic (selected by user from existing topics, default null).
- `actor` (String): Person responsible (selected globally by user, default null).
- `paymentMethod` (String): Defaulted to "אשראי".
- `sourceName` (String): Selected from UI (e.g., "אשראי יהב").
- `installments` (Integer): Total installments, parsed from "מידע נוסף", default null.
- `installmentNo` (Integer): Current installment number, parsed from "מידע נוסף", default null.
- `remainingAmount` (BigDecimal): Calculated as `(installments - installmentNo) * amount`, default null.
- `sheetName` (String): Month name (e.g., "אוגוסט").

**Validation Rules**:
- `amount` must not be null.
- `category` must not be empty.
- When committing to DB, `topic` and `actor` should be populated (can be enforced on frontend).

### `TransactionAuto`
Persistent entity mapped to the new `transaction_auto` MySQL table. This table receives all imported transactions.

**Relevance**:
Finalized `PendingTransactionDTO` objects will be mapped into `TransactionAuto` entities and saved using `TransactionAutoRepository.saveAll()`. The original `transactions` table remains completely read-only for the application.
