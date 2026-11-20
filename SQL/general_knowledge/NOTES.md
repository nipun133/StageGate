# Topic Notes: General Knowledge

## 1. SQL Logical Order of Execution

- **Engine Processing Sequence**:
  1. `FROM` & `JOIN`: Identifies tables, evaluates join conditions, and builds initial working dataset.
  2. `WHERE`: Filters individual rows based on row-level predicates.
  3. `GROUP BY`: Collapses filtered rows into summary groups.
  4. `HAVING`: Filters aggregated summary groups.
  5. `SELECT`: Computes expressions, resolves column projection, and assigns column aliases.
  6. `DISTINCT`: Removes duplicate rows from the projected output.
  7. `ORDER BY`: Sorts the final output rows.
  8. `FETCH / OFFSET`: Limits the final number of rows returned.

- **Column Alias Trap in WHERE / HAVING**:
  - Column aliases defined in `SELECT` cannot be referenced in `WHERE` or `HAVING`.
  - Attempting to do so fails with: `invalid identifier`.
  - **Reason**: `WHERE` (step 2) and `HAVING` (step 4) execute before `SELECT` (step 5) assigns the alias.

- **Column Aliases in ORDER BY**:
  - Column aliases defined in `SELECT` are completely valid and supported in `ORDER BY`.
  - **Reason**: `ORDER BY` (step 7) executes after `SELECT` (step 5).

- **Aggregate Functions in WHERE**:
  - Aggregate functions (`COUNT`, `SUM`, `AVG`, `MIN`, `MAX`) cannot be placed in `WHERE`.
  - Attempting to do so fails with: `group function is not allowed here`.
  - **Reason**: Aggregation happens in `GROUP BY` (step 3); individual rows in `WHERE` (step 2) are not yet grouped.
