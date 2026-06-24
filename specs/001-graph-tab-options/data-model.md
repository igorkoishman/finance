# Data Model: Graph Tab Options

## 1. Entities

This feature relies on the existing `Transaction` entity from the backend, but defines specific models for the frontend graph rendering configuration.

### 1.1 UI State: GraphConfiguration

Represents the user's current configuration for the graph.

**Fields**:
- `graphType` (String): The type of graph to render. Enum: `['LINE', 'PIE', 'BAR']`.
- `xAxisField` (String): The field to group by on the X-axis (e.g., 'txnMonth', 'category').
- `yAxisField` (String): The field to aggregate (default to 'amount').
- `multiCheckSelection` (Array of Strings): Only used for Pie/Bar charts to filter which categories/actors to include.

### 1.2 Constants: Presets

Pre-defined configurations that map to `GraphConfiguration`.

**Presets**:
1. **Expenses by Category (Pie)**
   - Type: `PIE`
   - GroupBy: `category`
2. **Monthly Expenses Trend (Line)**
   - Type: `LINE`
   - GroupBy: `txnMonth`
3. **Income vs Expenses (Bar)**
   - Type: `BAR`
   - GroupBy: `txnType`
4. **Top 5 Expenses (Pie)**
   - Type: `PIE`
   - GroupBy: `category` (Filtered to top 5 by sum of amounts)
5. **Daily Spending this Month (Line)**
   - Type: `LINE`
   - GroupBy: `txnDate` (Filtered to current month)

## 2. Validation Rules

- `xAxisField` must be one of the available fields in `Transaction` (category, txnMonth, txnType, paymentMethod, actor, sourceName).
- `multiCheckSelection` can be empty (meaning include all) or contain specific keys.
