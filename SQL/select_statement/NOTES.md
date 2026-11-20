# SELECT Statement - Notes

## 1. Basic SELECT (Projection)
- **Syntax**: `SELECT col1, col2 FROM table_name;`
- `*` selects all columns from the table.
- Listing specific column names fetches only those columns.
- **Literal Constants in SELECT**: You can select fixed numbers or text strings directly without referencing table columns (e.g., `SELECT 1, 'Active' FROM employees;`). Oracle simply repeats that constant value for every matching row returned.
- **Semicolon (`;`)**: **Not mandatory** in pure SQL syntax. In client tools (SQL*Plus, SQL Developer), it is used as a statement terminator to send the query (a slash `/` on a new line can also execute it). In programming APIs or dynamic SQL, `;` is forbidden.

## 2. Column Aliases & Quote Rules
- **Syntax**: `SELECT col AS alias_name FROM table;` or `SELECT col alias_name FROM table;`
- Renames the column header in the query output. The `AS` keyword is optional.
- By default, Oracle displays aliases in all-uppercase.
- **Double Quotes (`""`)**: Mandatory if the alias contains spaces, special symbols (e.g. `$`, `#`), or requires exact lowercase/mixed case (e.g., `"Full Name"`, `"Annual Salary ($)"`).
- **Exam Trap**: Never use single quotes (`''`) for aliases (single quotes are strictly for text literals, not column aliases). Using `''` for an alias causes: `FROM keyword not found where expected`.

## 3. Arithmetic Expressions & NULL
- Math operators (`+`, `-`, `*`, `/`) can be applied directly to numeric columns or literals in the `SELECT` clause (e.g., `SELECT salary * 12 FROM employees;`).
- `NULL` represents an unknown/missing value (not zero, not blank).
- Any arithmetic calculation involving `NULL` always results in `NULL` (e.g., `4000 + NULL = NULL`).

## 4. Handling NULL in Arithmetic with NVL()
- **Syntax**: `NVL(column_or_expression, default_value)`
- Replaces a `NULL` with a specified replacement value so arithmetic calculations are not wiped out to `NULL`.
- Example: `SELECT item_price + NVL(shipping_fee, 0) AS total_amount FROM orders;`
- Both arguments in `NVL` must have compatible data types; datatype mismatch raises: `invalid number`.

## 5. String Concatenation (||) & Literals
- **Syntax**: `SELECT col1 || ' literal text ' || col2 AS alias_name FROM table;`
- Uses two vertical bars `||` to combine columns and text into one output column.
- Fixed text characters and spaces must be wrapped in single quotes `'...'` (e.g., `' is a '`).
- **Concatenating with NULL**: In Oracle, `'Hello' || NULL || 'World'` treats `NULL` as an empty string (returns `'HelloWorld'`).

## 6. The Oracle DUAL Table
- **Syntax**: `SELECT expression FROM DUAL;`
- In Oracle, every `SELECT` query strictly requires a `FROM` clause; omitting it raises: `FROM keyword not found where expected`.
- `DUAL` is Oracle's built-in pseudo-table with 1 row and 1 column (`DUMMY`).
- Used to test math, functions, or view system values like `SYSDATE` without referencing a user table.

## 7. Eliminating Duplicates with DISTINCT
- **Syntax**: `SELECT DISTINCT col1, col2 FROM table;`
- Removes duplicate rows from the query output.
- Must appear immediately after the `SELECT` keyword; placing it mid-list (e.g., `SELECT col1, DISTINCT col2`) causes: `missing expression`.
- When used with multiple columns, it evaluates uniqueness across the combination of all listed columns.
