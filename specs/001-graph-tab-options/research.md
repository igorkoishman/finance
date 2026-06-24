# Research & Technical Decisions: Graph Tab Options

## Decisions

### 1. Charting Library
- **Decision**: Recharts
- **Rationale**: Recharts is already installed and in use in the current `TransactionGraph.jsx`. It provides React-centric composable components that are easy to extend for Line, Bar, and Pie charts.
- **Alternatives considered**: Chart.js (requires wrapping for React, more imperative), D3.js (too low-level, high learning curve).

### 2. Data Fetching & Aggregation
- **Decision**: Fetch raw transactions once on mount, aggregate locally on the client.
- **Rationale**: The backend `/api/transactions` endpoint returns the full list of transactions. For small to medium data sets (typical for a home finance app), aggregating client-side enables instant switching between graph types and presets without network latency.
- **Alternatives considered**: Backend aggregation (would require new endpoints and introduce latency for every preset click).

### 3. Presets Implementation
- **Decision**: Map presets to specific configuration objects (Graph Type, X-Axis/Grouping, Data Filter).
- **Rationale**: A preset is fundamentally just a pre-filled state for the graph controls. By storing them as constant configurations, we can easily apply them to the state and render the chart.
