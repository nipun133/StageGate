# Group Functions - Notes

## 1. Standard Group Functions
- Group (aggregate) functions operate on sets of rows to return one single summary result per group.
- **AVG(col)**: Calculates the average (numbers only).
- **SUM(col)**: Calculates the total sum (numbers only).
- **MIN(col)**: Returns the smallest/minimum value across numbers (lowest number), characters (alphabetically first, `A → Z`), and dates (oldest/earliest date).
- **MAX(col)**: Returns the largest/maximum value across numbers (highest number), characters (alphabetically last, `Z → A`), and dates (newest/latest date).
- **COUNT(col) / COUNT(*)**: `COUNT(col)` counts all non-`NULL` values (including duplicates); `COUNT(*)` counts every row (including `NULL`s and duplicates).
- Example: `SELECT MAX(salary), MAX(hire_date) FROM employees;`

## 2. Group Functions & NULL Handling
- Group functions automatically **ignore NULL values** (except `COUNT(*)`).
- `COUNT(*)`: Counts every row in the table, including rows with NULLs and duplicates.
- `COUNT(col)`: Counts only rows where `col` is NOT NULL.
- `AVG(col)`: Divides the sum only by the count of non-null rows (`SUM(col) / COUNT(col)`).
- To include NULLs as zeros in an average, wrap the column in `NVL`: `AVG(NVL(col, 0))`.
- Example: For 10 rows with 3 NULL ratings, `COUNT(*)` returns `10`, and `COUNT(rating)` returns `7`.

## 3. DISTINCT with Group Functions
- **Syntax**: `COUNT(DISTINCT col)`, `AVG(DISTINCT col)`, `SUM(DISTINCT col)`
- Forces the aggregate function to evaluate only unique values, ignoring duplicate values.
- Example: `SELECT COUNT(DISTINCT customer_id) FROM orders;` counts the unique customers who placed orders.

## 4. Grouping Data (GROUP BY)
- **Syntax**: `SELECT col1, AVG(col2) FROM table_name GROUP BY col1;`
- Divides rows into distinct groups to compute aggregates per group.
- **The Golden Rule**: Every unaggregated column in the `SELECT` list **must** be listed in the `GROUP BY` clause.
- Omitting a selected column from `GROUP BY` raises: `not a GROUP BY expression` (or `not a single-group group function`).
- **Aliases Prohibited**: Column aliases cannot be used in `GROUP BY` because `GROUP BY` executes before `SELECT` (raises: `"ALIAS_NAME": invalid identifier`).
- Example: `SELECT department_id, job_id, SUM(salary) FROM employees GROUP BY department_id, job_id;`

## 5. Filtering Groups (HAVING vs WHERE)
- **Syntax**: `SELECT col, COUNT(*) FROM table GROUP BY col HAVING COUNT(*) > n;`
- **WHERE**: Filters individual rows *before* grouping occurs; placing a group function in `WHERE` raises: `group function is not allowed here`.
- **HAVING**: Filters aggregated groups *after* grouping occurs; designed specifically for conditions with aggregate functions.
- Example: `SELECT department_id, COUNT(*) FROM employees GROUP BY department_id HAVING COUNT(*) > 5;`

## 6. Nesting Group Functions
- Group functions can be nested up to a **maximum of 2 levels** (e.g., `MAX(AVG(salary))`).
- **Prohibition on Individual Columns**: When group functions are nested, the `GROUP BY` column **cannot** appear in the `SELECT` list because the nested function collapses the result into a single scalar value.
- Violating this raises: `not a single-group group function`.
- Example:
  - Valid: `SELECT MIN(SUM(salary)) FROM employees GROUP BY department_id;`
  - Invalid: `SELECT department_id, MIN(SUM(salary)) FROM employees GROUP BY department_id;`
