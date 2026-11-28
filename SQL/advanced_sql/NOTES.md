# Advanced SQL & Analytic Functions - Notes

## 1. Ranking Functions: ROW_NUMBER vs. RANK vs. DENSE_RANK
- **Analytic Function Behavior**: Computes an aggregate, rank, or offset over a window of rows while **retaining every individual record in the result set** (unlike `GROUP BY` which collapses rows).
- **Core Syntax**:
  ```sql
  RANK() OVER (ORDER BY salary DESC)
  ```
- **Comparison Table**:
  | Function | Behavior on Ties | Subsequent Numbering (Gaps) | Example Output for (10k, 8k, 8k, 6k) |
  | :--- | :--- | :--- | :--- |
  | **`ROW_NUMBER()`**| Sequential (arbitrary on ties) | No duplicates, strictly no gaps | `1, 2, 3, 4` |
  | **`RANK()`** | Same rank for identical values | **Skips ranks (Leaves gaps)** | `1, 2, 2, 4` |
  | **`DENSE_RANK()`**| Same rank for identical values | **No skipping (No gaps)** | `1, 2, 2, 3` |
- **Exam Classic (N-th Highest Value)**:
  - When finding the N-th highest salary, **`DENSE_RANK()`** is standard because it handles ties without skipping rank numbers.

## 2. PARTITION BY & The SQL Execution Order Filter Trap
- **`PARTITION BY`**:
  - Divides the window into independent subsets (e.g., department, job category).
  - The function calculation resets to its starting value for each partition.
  - Syntax: `DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC)`.
- **The SQL Execution Order**:
  1. `FROM`
  2. `WHERE`
  3. `GROUP BY`
  4. `HAVING`
  5. `SELECT` *(Analytic functions and column aliases are evaluated here)*
  6. `ORDER BY`
- **Why Window Functions Fail in WHERE**:
  - Because `WHERE` executes (Step 2) before `SELECT` (Step 5), window functions and aliases do not exist yet when `WHERE` is filtering.
  - Placing window functions directly in `WHERE` raises:
    `window functions are not allowed here`.
  - Using a `SELECT` alias in `WHERE` raises:
    `"ALIAS_NAME": invalid identifier`.
- **The Standard Solution (Inline View / Subquery)**:
  - Evaluate the window function in an inner query `FROM (...)`, then filter against the assigned alias in the outer `WHERE` clause.

## 3. Positional Navigation Functions: LEAD & LAG
- **Purpose**: Access values from preceding (`LAG`) or succeeding (`LEAD`) rows within the same result set without self-joins.
- **Syntax**:
  ```sql
  LAG(column, [offset], [default]) OVER ([PARTITION BY ...] ORDER BY ...)
  LEAD(column, [offset], [default]) OVER ([PARTITION BY ...] ORDER BY ...)
  ```
- **Parameter Rules**:
  - `offset` *(optional, default = 1)*: Number of rows forward or backward.
  - `default` *(optional, default = NULL)*: Fallback value when offset reaches outside the partition/table boundary.
  - Example: First row with `LAG(..., 1, 0)` returns `0`. Last row with `LEAD(..., 1)` returns `NULL`.
- **Primary Use Cases**:
  - Month-over-month comparisons (e.g., current month revenue vs. previous month revenue).
  - Difference calculations between consecutive records.

## 4. Aggregate Window Functions & Framing (Grand vs. Running Totals)
- **Concept**: Turning standard aggregates (`SUM`, `AVG`, `COUNT`, `MIN`, `MAX`) into analytic window functions using `OVER (...)` (they are not limited to ranking functions).
- **Default Framing Rules**:
  - **`OVER ()` (No ORDER BY clause)**:
    - Default Window Frame: `RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING`.
    - Computes the **Grand Total** across the entire table.
    - Every row shows its individual value alongside the identical overall sum.
  - **`OVER (PARTITION BY ...)` (Group Total Without Collapsing Rows)**:
    - Computes the aggregate per partition/group (e.g., `SUM(salary) OVER (PARTITION BY dept_id)`), keeping every individual row.
  - **`OVER (ORDER BY ...)`**:
    - Default Window Frame: `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`.
    - Automatically computes a **Cumulative Running Total** from the first row up to the current row (or per partition with `OVER (PARTITION BY ... ORDER BY ...)`).
- **Combining with Math & Single-Row Functions (`ROUND`, `% Share`)**:
  - Window functions can be used directly inside arithmetic and scalar functions like `ROUND((amount / SUM(amount) OVER (PARTITION BY dept_id)) * 100, 2)`.
  - **Sibling Alias Rule**: You cannot reference a column alias defined in the same `SELECT` list inside another `SELECT` expression (repeat the `OVER (...)` expression instead).
- **Example Comparison (Row 2 of salaries 1000, 2000, 3000)**:
  - `SUM(salary) OVER ()` → `6000` (Grand total).
  - `SUM(salary) OVER (PARTITION BY dept_id)` → Department total for that row's `dept_id`.
  - `SUM(salary) OVER (ORDER BY salary)` → `3000` (Running total: 1000 + 2000).
