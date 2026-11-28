# Joins - Notes

## 1. Cartesian Product & CROSS JOIN
- **Syntax**: `SELECT * FROM table1 CROSS JOIN table2;` (or `FROM table1, table2;`).
- Created when two tables are joined without any matching condition.
- Every row in the first table pairs with every row in the second table.
- **Row Count Formula**: Rows(Table 1) × Rows(Table 2).
- Example: 5 colors × 4 sizes = 20 total combinations.

## 2. NATURAL JOIN
- **Syntax**: `SELECT col1, shared_col FROM table1 NATURAL JOIN table2;`
- Automatically matches rows on all columns sharing identical names and datatypes.
- **Qualifier Prohibition**: Columns used in a `NATURAL JOIN` **must not** have a table prefix or alias in the query (e.g., `c.customer_id` is illegal; write `customer_id`).
- Adding a qualifier raises: `column used in NATURAL join cannot have qualifier`.
- Example: `SELECT c.customer_name, customer_id FROM customers c NATURAL JOIN orders o;`

## 3. The USING Clause
- **Syntax**: `SELECT col1, shared_col FROM table1 JOIN table2 USING (shared_col);`
- Joins on an explicitly specified shared column (enclosed in parentheses).
- **Qualifier Restriction**: Just like `NATURAL JOIN`, any column listed in the `USING` clause **must not** have a table qualifier or alias anywhere in the query.
- Adding a qualifier raises: `column part of USING clause cannot have qualifier`.
- Example: `SELECT e.emp_name, department_id FROM employees e JOIN departments d USING (department_id);`

## 4. The JOIN ... ON Syntax (Inner Join)
- **Syntax**: `SELECT e.col, d.col FROM table1 e JOIN table2 d ON e.id = d.id;`
- Most flexible join; works with different column names and complex conditions.
- **Chaining 3+ Tables**: Add sequential `JOIN ... ON` clauses one after another (`FROM t1 a JOIN t2 b ON a.k1 = b.k1 JOIN t3 c ON b.k2 = c.k2`).
- **Disambiguation Rule**: In `JOIN ... ON`, any shared column referenced in `SELECT` **must be qualified** with a table alias (e.g., `c.customer_id`).
- Omitting the table qualifier on a shared column raises: `column ambiguously defined`.
- Example (2 tables): `SELECT c.customer_name, c.customer_id, o.order_total FROM customers c JOIN orders o ON c.customer_id = o.customer_id;`
- Example (3 tables): `SELECT c.customer_name, o.order_id, oi.qty FROM customers c JOIN orders o ON c.customer_id = o.customer_id JOIN order_items oi ON o.order_id = oi.order_id;`

## 5. Self Joins
- **Syntax**: `SELECT e.col, m.col FROM table e JOIN table m ON e.parent_id = m.id;`
- Joins a table to itself to model relationships within the same dataset (such as employee and manager hierarchies).
- Requires using the table twice with **two distinct aliases** so Oracle treats them as independent tables.
- Example: `SELECT e.emp_name, m.salary FROM employees e JOIN employees m ON e.manager_id = m.emp_id;`

## 6. Non-Equijoins
- **Syntax**: `SELECT e.col, g.col FROM table1 e JOIN table2 g ON e.val BETWEEN g.low AND g.high;`
- A join condition using comparison operators other than `=` (such as `BETWEEN`, `<`, `>`, `<=`, `>=`).
- Used when tables relate through numerical ranges or grade bands rather than identical primary/foreign keys.
- Example: `SELECT s.student_name, g.grade_letter FROM students s JOIN grading_scale g ON s.score BETWEEN g.min_score AND g.max_score;`

## 7. LEFT OUTER JOIN
- **Syntax**: `SELECT e.col, d.col FROM table1 e LEFT OUTER JOIN table2 d ON e.id = d.id;`
- Keyword `OUTER` is optional (`LEFT JOIN` is identical).
- Returns all matching rows, PLUS all unmatched rows from the **LEFT table** (the first table listed).
- Columns from the right table are filled with `NULL` for unmatched left rows.
- Example: `SELECT c.customer_name, o.order_id FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id;` preserves all customers even if they have 0 orders.

## 8. RIGHT & FULL OUTER JOIN
- **RIGHT OUTER JOIN**: Returns all matching rows, PLUS all unmatched rows from the **right table** (columns from unmatched left table become `NULL`).
  - Any `RIGHT JOIN` can be inverted into a `LEFT JOIN` by switching table positions in the `FROM` clause.
- **FULL OUTER JOIN**: Returns all matching rows, PLUS unmatched rows from **both the left and right tables**.
- Example: `SELECT e.emp_name, d.department_name FROM employees e FULL OUTER JOIN departments d ON e.department_id = d.department_id;`

## 9. Oracle Proprietary (+) Outer Join Operator
- Legacy Oracle outer join syntax placed in the `WHERE` clause.
- **Placement Rule**: Place `(+)` on the **deficient side** (the side lacking matching data that needs to supply `NULL`s):
  - `table1.col = table2.col (+)` ≡ `table1 LEFT JOIN table2`
  - `table1.col (+) = table2.col` ≡ `table1 RIGHT JOIN table2`
- **Prohibitions**:
  - Cannot perform a Full Outer Join by placing `(+)` on both sides (raises: `a predicate may reference only one outer-joined table`).
  - Cannot be used with the `IN` operator or combined using `OR` (raises: `outer join operator (+) not allowed in operand of OR or IN`).
- Example: `SELECT c.customer_name, o.order_total FROM customers c, orders o WHERE c.customer_id = o.customer_id (+);`
