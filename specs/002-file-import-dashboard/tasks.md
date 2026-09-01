# Tasks: File Import Dashboard

**Input**: Design documents from `/specs/002-file-import-dashboard/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No explicit tests were requested in the specification; focusing on MVP implementation per user's directive to prioritize functional delivery.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Add `pdfbox` dependency to `pom.xml`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002a Create `TransactionAuto` entity and repository mapped to `transaction_auto` table
- [x] T002b Create `PendingTransactionDTO` model in `src/main/java/com/finance/dto/PendingTransactionDTO.java`
- [x] T003 Create `ImportService` interface and `YahavPdfParser` in `src/main/java/com/finance/service/` and `src/main/java/com/finance/service/parser/`
- [x] T004 Create `ImportController` skeleton in `src/main/java/com/finance/controller/ImportController.java`
- [x] T005 [P] Create `ImportDashboard.jsx` skeleton in `frontend/src/components/ImportDashboard.jsx`
- [x] T006 [P] Update routing and layout to include new tab in `frontend/src/App.jsx` and `frontend/src/components/Layout.jsx`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Upload and Preview Parsed Data (Priority: P1) 🎯 MVP

**Goal**: As a user, I want to upload a bank statement file (specifically "אשראי יהב") so that the system automatically extracts the transactions into a preview table.

**Independent Test**: Can be fully tested by uploading a valid PDF statement and verifying that the preview table accurately reflects the transactions using the defined mapping rules.

### Implementation for User Story 1

- [x] T007 [P] [US1] Implement `YahavPdfParser.java` text extraction and regex parsing logic
- [x] T008 [P] [US1] Implement `/finance/api/v1/import/upload` endpoint in `ImportController.java`
- [x] T009 [US1] Implement file upload UI and basic `ag-grid-react` grid in `frontend/src/components/ImportDashboard.jsx` (depends on T008)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Apply Global Settings (Priority: P1)

**Goal**: As a user, I want to set a global `actor` value for the entire uploaded file, so that I don't have to select it row by row.

**Independent Test**: Can be fully tested by selecting an actor from a global dropdown and verifying all rows in the preview table are updated to reflect the choice.

### Implementation for User Story 2

- [x] T010 [US2] Implement global actor dropdown and grid state update logic in `frontend/src/components/ImportDashboard.jsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Edit Individual Row Values (Priority: P1)

**Goal**: As a user, I want to select the `topic` for each transaction from a dropdown containing existing topics from the database, so that my categorization remains consistent.

**Independent Test**: Can be fully tested by modifying a row's topic via dropdown and verifying the change is saved in the pending transaction state.

### Implementation for User Story 3

- [x] T011 [P] [US3] Implement `/finance/api/v1/transactions/topics` endpoint in `ImportController.java` (or TransactionController) to fetch unique topics
- [x] T012 [US3] Implement `ag-grid-react` cell editor for `topic` column using the fetched topics in `frontend/src/components/ImportDashboard.jsx`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: User Story 4 - Commit Data to Database (Priority: P1)

**Goal**: As a user, I want to review my edits and submit the finalized transactions, so they are saved to the central database.

**Independent Test**: Can be fully tested by clicking submit and verifying the corresponding records appear in the `transactions` database table.

### Implementation for User Story 4

- [x] T013 [P] [US4] Implement `/finance/api/v1/import/save` endpoint mapping DTOs to `TransactionAuto` Entities and saving via `TransactionAutoRepository` in `ImportController.java` and `ImportService.java`
- [x] T014 [US4] Add "Save to Database" button and API call handling in `frontend/src/components/ImportDashboard.jsx`

**Checkpoint**: Entire end-to-end flow is fully functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T015 [P] Create and apply styling in `frontend/src/components/ImportDashboard.css`
- [x] T016 Verify SecurityConfig allows access to the new endpoints (or uses active session properly)
- [x] T017 Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - US1 blocks US2, US3, and US4 frontend integrations (since the grid needs to exist first).
  - The backend endpoints for US3 and US4 can be developed in parallel to US1 backend.
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### Parallel Opportunities

- Foundation tasks T002-T004 (backend) can run in parallel with T005-T006 (frontend).
- Backend implementations for US1 (T007-T008), US3 (T011), and US4 (T013) can run completely in parallel once the foundation is laid out.
- Frontend implementation generally follows backend sequentially to allow real integration, but mock data can be used to parallelize further.

---

## Parallel Example: Backend API Development

```bash
# Launch backend API implementations together:
Task: "Implement YahavPdfParser.java text extraction and regex parsing logic"
Task: "Implement /finance/api/v1/transactions/topics endpoint"
Task: "Implement /finance/api/v1/import/save endpoint"
```

---

## Implementation Strategy

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (Upload & Parse) → Test independently → MVP!
3. Add User Story 2 (Global Actor Update) → Test independently
4. Add User Story 3 (Per-row Topic Edit) → Test independently
5. Add User Story 4 (Save to DB) → Test independently → End-to-end complete.
