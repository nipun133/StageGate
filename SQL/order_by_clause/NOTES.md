# ORDER BY Clause - Notes

## 1. Basic Sorting (ASC vs DESC)
- **Syntax**: `SELECT col1, col2 FROM table_name ORDER BY column [ASC | DESC];`
- Sorts query output; always placed as the very last clause of the query.
- `ASC` (default): Ascending order (1-10, A-Z, oldest date to newest).
- `DESC`: Descending order (10-1, Z-A, newest date to oldest).
- Example: `SELECT * FROM employees ORDER BY hire_date DESC;`

## 2. Multi-Column Sorting
- **Syntax**: `ORDER BY col1 [ASC|DESC], col2 [ASC|DESC];`
- Sorts primarily by the first column; subsequent columns are evaluated only when ties (identical values) occur in preceding columns.
- Each column can have its own independent sort direction (`ASC` or `DESC`).
- Example: `SELECT * FROM students ORDER BY grade ASC, score DESC;`

## 3. Sorting by Aliases & Positional Numbers
- **Aliases in ORDER BY**: Because `ORDER BY` executes after the `SELECT` clause, it can legally sort using column aliases (`ORDER BY annual_salary DESC;`).
- **Aliases in WHERE (Invalid)**: `WHERE` executes before `SELECT`, so using an alias in `WHERE` fails with: `"ALIAS_NAME": invalid identifier`.
- **Positional Numbers**: Columns can be sorted by their 1-based index in the `SELECT` list (`ORDER BY 2 DESC;` sorts by the 2nd column selected).

## 4. Sorting with NULLs (NULLS FIRST / NULLS LAST)
- In Oracle, `NULL` is treated as the greatest/highest value when sorting.
- **Default Behavior**:
  - `ASC` orders default to **`NULLS LAST`** (bottom of the list).
  - `DESC` orders default to **`NULLS FIRST`** (top of the list).
- **Manual Override**: Append `NULLS FIRST` or `NULLS LAST` to control placement explicitly:
  `SELECT emp_name, salary FROM employees ORDER BY salary DESC NULLS LAST;`
