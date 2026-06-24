# Quickstart: Graph Tab Options Validation

## Prerequisites
- Node.js (v18+)
- Backend running locally on port 8080 (serves `/api/transactions`)

## Validation Scenarios

### Scenario 1: Verify Default Graph Render
1. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```
2. Open http://localhost:5173/dashboard/graph in a browser.
3. Verify that the graph tab loads and displays the default view (e.g., the first preset or a default line graph) without errors.

### Scenario 2: Test Presets
1. On the Graph Tab, locate the "Presets" section.
2. Click on "Expenses by Category". Verify the graph changes to a Pie Chart.
3. Click on "Monthly Expenses Trend". Verify the graph changes to a Line Chart.

### Scenario 3: Test Custom Configuration (Pie Chart)
1. Select "Pie Chart" from the Graph Type dropdown.
2. Observe the "Multi-check" options for categories appear.
3. Uncheck 1 or 2 categories.
4. Verify the Pie Chart dynamically updates to exclude those categories.

### Scenario 4: Test Custom Configuration (Line Graph)
1. Select "Line Graph" from the Graph Type dropdown.
2. Change the X-Axis to "paymentMethod".
3. Verify the X-Axis updates and the line graph plots data across payment methods.
