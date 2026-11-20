# Subqueries - Notes

## 1. Single-Row Subqueries
- An inner query nested inside an outer statement that returns **exactly one row (single value)**.
- Must be enclosed in parentheses `(...)`.
- Uses standard comparison operators: `=`, `>`, `<`, `>=`, `<=`, `<>`.
- Inner query executes first, and its single output is supplied to the outer query condition.
- Example: `SELECT emp_name FROM employees WHERE salary > (SELECT salary FROM employees WHERE emp_name = 'Abel');`

## 2. The Single-Row Subquery Error Trap
- Using a single-row operator (`=`, `>`, `<`, etc.) with a subquery that yields multiple rows causes a query failure.
- Error message: `single-row subquery returns more than one row`.
- Single-row operators strictly demand a subquery guaranteed to return at most 1 row (such as queries on unique keys or using aggregate functions like `MIN`, `MAX`).
- Example: `WHERE department_id = (SELECT department_id FROM employees WHERE job_id = 'IT_PROG');` fails if multiple IT programmers exist.

## 3. Multiple-Row Subqueries (IN Operator)
- **Syntax**: `SELECT col FROM table1 WHERE col IN (SELECT col FROM table2 WHERE condition);`
- Used when an inner subquery returns multiple rows.
- Evaluates to true if the outer column matches any value returned by the inner query.
- Example: `SELECT order_id FROM orders WHERE customer_id IN (SELECT customer_id FROM customers WHERE city = 'CHICAGO');`

## 4. Multiple-Row Operators (ANY & ALL)
- Pairs with relational comparison operators (`>`, `<`, `=`, `<>`) against multi-row subquery results.
- **ANY (At least one)**:
  - `> ANY`: Greater than the minimum value in the list (> MIN).
  - `< ANY`: Less than the maximum value in the list (< MAX).
  - `= ANY`: Equivalent to `IN`.
- **ALL (Every single one)**:
  - `> ALL`: Greater than the maximum value in the list (> MAX).
  - `< ALL`: Less than the minimum value in the list (< MIN).
  - `<> ALL`: Equivalent to `NOT IN`.
- Example: `WHERE salary > ALL (2500, 3000, 4000)` requires `salary > 4000`.

## 5. The NOT IN with NULL Trap
- **The Boolean Mechanism**:
  - `IN` uses `OR` logic: `(x=1 OR x=NULL)`. Since `TRUE OR UNKNOWN = TRUE`, `IN` is safe from NULL poisoning.
  - `NOT IN` uses `AND` logic: `(x!=1 AND x!=NULL)`. Since `TRUE AND UNKNOWN = UNKNOWN`, a single `NULL` poisons the entire chain, causing every row to evaluate to UNKNOWN/FALSE.
- Result: If the subquery yields even one `NULL`, `NOT IN` returns **0 rows**.
- **Fix**: Filter out `NULL`s explicitly in the subquery:
  `WHERE col NOT IN (SELECT col FROM table WHERE col IS NOT NULL);`
- Example: `WHERE product_id NOT IN (1, 2, NULL)` returns `0 rows`.

## 6. Multiple-Column Subqueries (Pairwise Comparison)
- **Syntax**: `WHERE (col1, col2) IN (SELECT col1, aggregate(col2) FROM table GROUP BY col1);`
- Evaluates multiple columns simultaneously as an atomic pair (tuple).
- **The Problem It Solves**: Prevents false matches where separate single-column conditions match across different groups.
- Can alternatively be written using an `INNER JOIN` against an aggregated inline view.
- Example: `WHERE (category_id, price) IN (SELECT category_id, MAX(price) FROM products GROUP BY category_id);`

## 7. Correlated Subqueries & EXISTS / NOT EXISTS
- **Correlated Subquery**: An inner query that references a column from the outer query table, executing once per candidate row of the outer query.
- **EXISTS**: Tests whether the inner query returns at least one row (returns TRUE on first match and short-circuits).
- **NOT EXISTS**: Tests for the absence of any matching rows.
- **NULL Immunity**: Unlike `NOT IN`, `NOT EXISTS` is completely unaffected by NULL values in the child table.
- Standard practice uses `SELECT 1` or `SELECT *` inside the subquery.
- Example: `SELECT c.customer_name FROM customers c WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE c.customer_id = o.customer_id);`
