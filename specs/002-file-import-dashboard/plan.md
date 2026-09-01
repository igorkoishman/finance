# Implementation Plan: File Import Dashboard

**Branch**: `002-file-import-dashboard` | **Date**: 2026-09-01 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-file-import-dashboard/spec.md`

## Summary

Build a new React dashboard tab for uploading bank statement PDFs ("אשראי יהב"), parsing them on the Spring Boot backend using Apache PDFBox, and rendering a transient `ag-grid-react` preview table where users can apply global updates and manually categorize rows before committing them to the MySQL database.

## Technical Context

**Language/Version**: Java 17+ (Spring Boot 3), JavaScript (React/Vite)

**Primary Dependencies**: `org.apache.pdfbox:pdfbox`, `ag-grid-react`, `axios`

**Storage**: MySQL (via Spring Data JPA)

**Testing**: JUnit / Mockito for Backend, Manual Testing for Frontend

**Target Platform**: Web Browser

**Project Type**: Full-stack Web Application

**Performance Goals**: Parse and render 100+ rows within 5 seconds.

**Constraints**: Frontend must use Vanilla CSS and existing standard design practices.

**Scale/Scope**: ~3 API endpoints, 1 new React view, 1 new parser service.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Microservice Architecture & Technology Stack**: Complies (React UI, Spring Boot API).
- **Strict Layered Architecture**: Complies (ImportController -> ImportService -> TransactionAutoRepository).
- **Data Encapsulation and Separation**: Complies (Uses `PendingTransactionDTO` to separate from `TransactionAuto` entity).
- **Object-Oriented & SOLID Design**: Complies (Parsers will be abstracted behind an interface).

## Project Structure

### Documentation (this feature)

```text
specs/002-file-import-dashboard/
├── plan.md              # This file
├── research.md          # Decisions regarding PDFBox and ag-grid
├── data-model.md        # DTO definitions
├── quickstart.md        # End-to-end testing scenarios
├── contracts/           # API contracts for the new endpoints
└── tasks.md             # Implementation steps (to be generated)
```

### Source Code (repository root)

```text
backend/
├── src/main/java/com/finance/
│   ├── controller/ImportController.java
│   ├── dto/PendingTransactionDTO.java
│   ├── service/ImportService.java
│   └── service/parser/YahavPdfParser.java
│
frontend/
├── src/
│   ├── components/ImportDashboard.jsx
│   ├── components/ImportDashboard.css
│   └── App.jsx (routing updates)
```

**Structure Decision**: The frontend code will be placed in the `components` directory. The backend will follow the existing MVC structure with an added `parser` sub-package inside `service`.
