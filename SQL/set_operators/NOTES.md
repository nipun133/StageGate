# Set Operators - Notes

## 1. Set Operator Compatibility Rules
- Combines multiple query results vertically into a single output.
- **Rule 1 (Column Count)**: Both query blocks must select the exact same number of columns. Mismatch raises: `query block has incorrect number of result columns`.
- **Rule 2 (Datatypes)**: Corresponding columns must have compatible data types; column names do not need to match. Mismatch raises: `expression must have same datatype as corresponding expression`.
- **Rule 3 (Column Headers)**: The column headers in the final result are taken from the first `SELECT` query.

## 2. UNION vs. UNION ALL
- **UNION**:
  - Merges rows and **eliminates duplicates**.
  - Automatically sorts output in ascending order on the first column to identify and remove duplicates (higher performance cost).
- **UNION ALL**:
  - Merges rows and **preserves all duplicate rows**.
  - Does not sort the output; faster execution.
- Example: Combining `(Apple, Banana)` and `(Banana, Cherry)` with `UNION ALL` yields 4 total rows: `Apple, Banana, Banana, Cherry`.

## 3. INTERSECT and MINUS
- **INTERSECT**: Returns only rows common to both query results (the overlap); automatically deduplicates and sorts in ascending order.
- **MINUS**: Returns rows from the first query that do not exist in the second query (set subtraction); automatically deduplicates and sorts.
  - Order strictly matters: `A MINUS B` != `B MINUS A`.
  - Exclusively called `MINUS` in Oracle (never `EXCEPT`).
- Example:
  - `(10, 20, 30) INTERSECT (20, 30, 40)` → `20, 30`
  - `(10, 20, 30) MINUS (20, 30, 40)` → `10`

## 4. The ORDER BY Placement Rule
- **Strict Placement**: An `ORDER BY` clause can **only appear once**, at the **very end** of the entire compound query statement.
- Placing `ORDER BY` on an individual sub-query raises: `SQL command not properly ended`.
- **Naming Rule**: Can only sort by column names or aliases declared in the **first query block**, or by positional indices (`1, 2, 3...`).
- Example:
  ```sql
  SELECT product_id, product_name FROM active_products
  UNION ALL
  SELECT product_id, product_name FROM archived_products
  ORDER BY product_name;
  ```
