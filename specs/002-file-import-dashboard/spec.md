# Feature Specification: File Import Dashboard

**Feature Branch**: `002-file-import-dashboard`

**Created**: 2026-09-01

**Status**: Draft

**Input**: User description: "we have to add tab in the finance application this tab will open dashboard on this dashboard you should read the file and expose to the user edit options like a table and global values like actor should be blobal value for the entire file topic should be dropdownlist from all what we have for that coplumn"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Upload and Preview Parsed Data (Priority: P1)

As a user, I want to upload a bank statement file (specifically "אשראי יהב") so that the system automatically extracts the transactions into a preview table.

**Why this priority**: Core functionality; without extracting the data, there is nothing to edit or submit.

**Independent Test**: Can be fully tested by uploading a valid PDF statement and verifying that the preview table accurately reflects the transactions using the defined mapping rules.

**Acceptance Scenarios**:

1. **Given** I am on the new Import tab, **When** I upload a valid statement file, **Then** I see a data grid populated with the extracted transactions.
2. **Given** the file contains installment data, **When** the file is parsed, **Then** the `installments` and `installment_no` fields are populated correctly, and the `remaining_amount` is automatically calculated.

---

### User Story 2 - Apply Global Settings (Priority: P1)

As a user, I want to set a global `actor` value for the entire uploaded file, so that I don't have to select it row by row.

**Why this priority**: Drastically improves user experience and efficiency when processing large statement files belonging to a single actor.

**Independent Test**: Can be fully tested by selecting an actor from a global dropdown and verifying all rows in the preview table are updated to reflect the choice.

**Acceptance Scenarios**:

1. **Given** a populated preview table, **When** I select an actor (e.g., "מושלמת") from the global dropdown, **Then** the actor field for every pending transaction in the table is updated.

---

### User Story 3 - Edit Individual Row Values (Priority: P1)

As a user, I want to select the `topic` for each transaction from a dropdown containing existing topics from the database, so that my categorization remains consistent.

**Why this priority**: Required for data integrity; transactions must be categorized correctly before being persisted.

**Independent Test**: Can be fully tested by modifying a row's topic via dropdown and verifying the change is saved in the pending transaction state.

**Acceptance Scenarios**:

1. **Given** the preview table, **When** I click the `topic` cell on a row, **Then** I see a dropdown list of all existing topics.
2. **Given** I have selected a topic from the dropdown, **When** I finish editing, **Then** the row's topic is updated.

---

### User Story 4 - Commit Data to Database (Priority: P1)

As a user, I want to review my edits and submit the finalized transactions, so they are saved to the central database.

**Why this priority**: Completes the end-to-end import flow.

**Independent Test**: Can be fully tested by clicking submit and verifying the corresponding records appear in the `transaction_auto` database table.

**Acceptance Scenarios**:

1. **Given** a reviewed and fully populated preview table, **When** I click "Save", **Then** the transactions are permanently saved to the `transaction_auto` database table.

### Edge Cases

- What happens when a user uploads an unsupported file format?
- How does the system handle missing or unparseable lines in the PDF?
- What happens if the user tries to save without selecting mandatory fields like `topic`?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a new "Import" tab in the application navigation.
- **FR-002**: System MUST parse uploaded "אשראי יהב" statement files and extract the date, description, amount, and installments data.
- **FR-003**: System MUST map parsed values: `txn_month` (1st of month), `category` (merchant description), `amount`, `installments`, `installment_no`, and default `payment_method` to "אשראי".
- **FR-004**: System MUST calculate `remaining_amount` dynamically based on `(installments - installment_no) * amount`.
- **FR-005**: System MUST provide a UI to view and edit parsed transactions in a tabular grid format (`ag-grid-react`).
- **FR-006**: System MUST provide a global selector for the `actor` field applying to all rows.
- **FR-007**: System MUST provide a dropdown selector for the `topic` field on each row, dynamically populated with existing unique topics from the read-only `transactions` table.
- **FR-008**: System MUST allow users to submit the finalized transactions to the `transaction_auto` database table via an API endpoint. The original `transactions` table MUST NOT be modified by the import process.

### Key Entities 

- **PendingTransactionDTO**: Represents a transaction in the transient state before it is saved to the database.
- **TransactionAuto**: The persistent entity mapped to the new `transaction_auto` MySQL table.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can upload a statement and see the parsed results rendered in the table within 5 seconds.
- **SC-002**: The data extraction algorithm accurately parses 100% of the rows from standard "אשראי יהב" statements without data loss.
- **SC-003**: Users successfully commit finalized transactions to the `transaction_auto` database table.

## Assumptions

- Users will only upload the specific "אשראי יהב" PDF format initially.
- The `topic` list can be derived dynamically by querying the database for `SELECT DISTINCT topic FROM transactions WHERE topic IS NOT NULL`.
- The user has a modern browser capable of rendering `ag-grid-react` efficiently with potentially hundreds of rows.
