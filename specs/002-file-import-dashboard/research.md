# Research & Decisions: File Import Dashboard

## Decision 1: PDF Parsing Library
- **Decision**: Use `Apache PDFBox` (`org.apache.pdfbox:pdfbox`).
- **Rationale**: It is a robust, widely-used standard in the Java ecosystem for extracting text from PDF files. Since bank statements contain structured text (not just images requiring OCR), PDFBox's `PDFTextStripper` can easily extract the lines which can then be parsed via regex to match the expected format (date, description, amount, etc.).
- **Alternatives considered**: Tesseract OCR (too heavy, requires native binaries), iText (restrictive AGPL licensing).

## Decision 2: Frontend Data Grid
- **Decision**: Use `ag-grid-react`.
- **Rationale**: Mandated by the project constitution (`AGENTS.md`) and the existing `TransactionTable.jsx` implementation. It provides robust editing capabilities out-of-the-box (dropdowns, cell editing) which is essential for User Stories 2 and 3 (applying global settings and editing individual rows).
- **Alternatives considered**: None (mandated by rules).

## Decision 3: File Upload Implementation
- **Decision**: Use standard HTML5 file input with `FormData` in React, handled by Spring `MultipartFile` in the backend.
- **Rationale**: Simplest and most native way to handle file uploads in a Spring/React stack without introducing unnecessary heavy dependencies.

## Decision 4: Transient Data Handling
- **Decision**: Send extracted data back to the frontend immediately as an array of `PendingTransactionDTO`s for preview. Do not save to DB until the user clicks "Save".
- **Rationale**: Follows the user requirement for a manual review dashboard and prevents polluting the database with unverified or incorrectly categorized transactions.
