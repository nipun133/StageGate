# WHERE Clause - Notes

## 1. Basic Filtering & Comparison Operators
- **Syntax**: `SELECT col1, col2 FROM table_name WHERE condition;`
- Filters rows returned by the query; placed immediately after the `FROM` clause.
- Comparison operators: `=` (equal), `>` (greater than), `<` (less than), `>=` (greater or equal), `<=` (less or equal), `<>` or `!=` (not equal).
- Example: `SELECT * FROM employees WHERE department_id = 10;`

## 2. Filtering Text & Dates (Case-Sensitivity)
- Text and date values must always be enclosed in single quotes `'...'` (e.g., `'CHICAGO'`, `'01-JAN-2024'`).
- In Oracle, text data inside quotes is strictly **case-sensitive** (`'CHICAGO'` will not match `'Chicago'`).
- Column names and SQL keywords remain case-insensitive.
- Example: `SELECT emp_name, salary FROM employees WHERE city = 'CHICAGO';`

## 3. Logical Operators (AND & OR)
- **AND**: Returns rows only when all combined conditions evaluate to TRUE.
- **OR**: Returns rows if at least one of the conditions evaluates to TRUE.
- Example: `SELECT * FROM employees WHERE department_id = 20 AND salary < 4000;`

## 4. Operator Precedence (AND before OR)
- `AND` is evaluated before `OR` by default.
- Without parentheses, `cond1 OR cond2 AND cond3` is processed as `cond1 OR (cond2 AND cond3)`.
- Use parentheses `()` to enforce priority and group `OR` conditions properly:
  `SELECT * FROM employees WHERE (job = 'CLERK' OR job = 'ANALYST') AND salary > 3000;`

## 5. Range Filtering (BETWEEN ... AND ...)
- **Syntax**: `WHERE column BETWEEN lower_val AND upper_val;`
- Evaluates whether a value falls within a specified range.
- Strictly **inclusive** of both boundary limits (>= lower and <= upper).
- The lower boundary must always be specified first; reversing the order (e.g., `BETWEEN 150 AND 50`) returns 0 rows.
- Example: `SELECT product_name, price FROM products WHERE price BETWEEN 50 AND 150;`

## 6. List Matching (IN & NOT IN)
- **Syntax**: `WHERE column IN (val1, val2, ...);`
- Checks whether a value matches any entry in a comma-separated list (replaces multiple `OR` conditions).
- Values must be wrapped in parentheses `(...)`.
- Negative form: `WHERE column NOT IN (val1, val2);` excludes matching rows.
- **NULL Trap with NOT IN**: If a literal `NULL` is present in a `NOT IN` list (e.g., `NOT IN (10, 20, NULL)`), the condition evaluates to `UNKNOWN` and returns **0 rows**.
- Example: `SELECT * FROM employees WHERE job_id IN ('IT_PROG', 'SA_REP', 'HR_REP');`

## 7. Pattern Matching (LIKE Operator)
- **Syntax**: `WHERE column LIKE 'pattern';`
- Searches for text patterns; strictly case-sensitive.
- Wildcard `%`: Matches zero or more characters (e.g., `'S%'` starts with S, `'%son'` ends with son, `'%an%'` contains an).
- Wildcard `_`: Matches exactly one single character (e.g., `'_a%'` has 'a' as second character).
- Negative form: `WHERE column NOT LIKE 'pattern';`.
- **ESCAPE Identifier**: Use `ESCAPE` to search for literal `%` or `_` characters (e.g., `WHERE job_id LIKE 'SA\_%' ESCAPE '\'`).
- Example: `SELECT first_name FROM employees WHERE first_name LIKE '_a%';`

## 8. Filtering for NULLs (IS NULL & IS NOT NULL)
- `NULL` represents an unknown/missing value and cannot be compared using `=` or `!=`.
- Comparing with `= NULL` or `!= NULL` silently evaluates to `UNKNOWN` (treated as FALSE) and returns 0 rows.
- Use `IS NULL` to find missing values: `WHERE column IS NULL;`
- Use `IS NOT NULL` to find populated values: `WHERE column IS NOT NULL;`
- Example: `SELECT * FROM tasks WHERE completion_date IS NOT NULL;`
