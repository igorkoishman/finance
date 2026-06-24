# Tasks: Graph Tab Options

**Input**: Design documents from `/specs/001-graph-tab-options/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Verify Recharts installation and update package.json if necessary in `frontend/package.json`
- [x] T002 Update `frontend/src/components/TransactionGraph.css` to prepare basic layout (Controls + Chart Area)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Refactor data fetching in `frontend/src/components/TransactionGraph.jsx` to store raw transactions for local aggregation and implement a `GraphConfiguration` state object based on `data-model.md`.

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Configure and View a Line Graph (Priority: P1) 🎯 MVP

**Goal**: Users want to select a line graph and define its X and Y axes to understand financial trends over time or across categories.

**Independent Test**: Can be fully tested by selecting the "Line Graph" type, mapping 'Date' to the X-axis and 'Amount' to the Y-axis, and observing the rendered graph.

### Implementation for User Story 1

- [x] T004 [P] [US1] Create UI dropdowns for selecting X-axis (e.g., txnMonth, category) and Y-axis (amount) in `frontend/src/components/TransactionGraph.jsx`.
- [x] T005 [P] [US1] Create a new component `frontend/src/components/LineChartRenderer.jsx` that accepts raw transactions and axes config to aggregate and render a `LineChart`.
- [x] T006 [US1] Integrate `LineChartRenderer.jsx` into the main `TransactionGraph.jsx` switch statement.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Configure and View a Pie Chart (Priority: P1)

**Goal**: Users want to select a pie chart and select multiple categories (multi-check) to visualize the proportion of different expenses or income streams.

**Independent Test**: Can be fully tested by selecting "Pie Chart", checking multiple categories in the configuration, and observing the rendered pie chart.

### Implementation for User Story 2

- [x] T007 [P] [US2] Implement a Multi-select checkbox UI for filtering categories/groups in `frontend/src/components/TransactionGraph.jsx`.
- [x] T008 [P] [US2] Create a new component `frontend/src/components/PieChartRenderer.jsx` that aggregates data for a `PieChart` and respects the multi-check filters.
- [x] T009 [P] [US2] Create a new component `frontend/src/components/BarChartRenderer.jsx` to provide bar graph capabilities.
- [x] T010 [US2] Integrate `PieChartRenderer.jsx` and `BarChartRenderer.jsx` into the main `TransactionGraph.jsx`.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Utilize Financial Standard Presets (Priority: P2)

**Goal**: Users want quick access to 5 standard financial home expense graph options so they don't have to manually configure common views.

**Independent Test**: Can be tested by clicking on each of the 5 presets and verifying the correct graph type and parameters are automatically applied and rendered.

### Implementation for User Story 3

- [x] T011 [P] [US3] Define the 5 Preset configurations from `data-model.md` as constants in a new file `frontend/src/utils/GraphPresets.js`.
- [x] T012 [US3] Create preset selection buttons in `frontend/src/components/TransactionGraph.jsx` that update the `GraphConfiguration` state based on the selected preset.

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T013 Update `frontend/src/components/TransactionGraph.css` to add animations, transitions, and finalize the responsive design for a premium feel.
- [x] T014 Run all validation scenarios from `specs/001-graph-tab-options/quickstart.md` to ensure correct aggregation and UI behavior.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P1)**: Can start after Foundational (Phase 2)
- **User Story 3 (P2)**: Depends on US1 and US2 being substantially complete so the presets can correctly trigger the graph types.

### Parallel Opportunities

- Rendering components (`LineChartRenderer.jsx`, `PieChartRenderer.jsx`, `BarChartRenderer.jsx`) can be developed entirely in parallel since they take raw data and props.
