# Conversion Functions - Notes

## 1. Implicit vs. Explicit Conversion
- **Implicit Conversion**: Oracle automatically converts types behind the scenes. Avoid because it can degrade performance (disables indexes) and break across different server NLS settings.
- **Explicit Conversion**: Controlled, reliable conversion using Oracle functions.
- **Destination Principle**: The function name tells you the *resulting* data type:
  - `TO_CHAR(value, [format])`: Converts Date or Number → Character string (text formatting).
  - `TO_DATE(string, [format])`: Converts Character string → Date.
  - `TO_NUMBER(string, [format])`: Converts Character string → Number.

## 2. Date Formatting (TO_CHAR with Dates)
- **Syntax**: `TO_CHAR(date, 'format_model')`
- Converts a Date to a formatted character string.
- Format Elements:
  - Year: `YYYY` (4-digit), `YY` (2-digit).
  - Month: `MM` (2-digit number), `MON` (3-letter name), `MONTH` (full name).
  - Day: `DD` (day of month), `DY` (3-letter day), `DAY` (full weekday name).
  - Time: `HH24` (24-hour), `MI` (Minutes - not MM!), `SS` (Seconds).
  - Suffix Modifiers (appended to date numbers):
    - `th` / `TH`: Appends ordinal suffix (e.g., `DDth` → `15th`, `DDTH` → `15TH`).
    - `sp` / `SP`: Spells out the number (e.g., `DDsp` → `FIFTEEN`).
    - `spth` / `thsp`: Spells out ordinal number (e.g., `DDspth` → `FIFTEENTH`).
- Punctuation (slashes `/`, dashes `-`, spaces) in the format model appears literally in the output.
- **Case Sensitivity of Elements**: The casing of format elements controls output capitalization (e.g., `'MONTH'` → `'JUNE'`, `'Month'` → `'June'`, `'month'` → `'june'`).
- **Literal Text in Double Quotes**: Custom words or characters embedded inside format masks must be enclosed in double quotes `""` (e.g., `'FMDDth "of" Month, YYYY'`).
- **Fill Mode (FM) Modifier**: Prefix format models with `FM` to suppress padded trailing blanks in month/day names and leading zeros (e.g., `'FMMonth DD, YYYY'`).
- Example: `SELECT TO_CHAR(hire_date, 'YYYY/MM/DD') FROM employees;`

## 3. Number Formatting (TO_CHAR with Numbers)
- **Syntax**: `TO_CHAR(number, 'format_model')`
- Elements:
  - `9`: Numeric position (suppresses leading zeros).
  - `0`: Forces leading zero.
  - `$`: Prefixes dollar sign.
  - `L`: Prefixes local currency symbol.
  - `,`: Comma separator.
  - `.`: Decimal point.
- **Overflow Trap (`###`)**: If format model has fewer integer digits than the number, Oracle outputs hash marks (e.g., `TO_CHAR(12345, '999')` → `####`).
- Example: `SELECT TO_CHAR(8450, '$9,999') FROM DUAL;` returns `'$8,450'`.

## 4. Converting Strings to Dates (TO_DATE & RR vs YY)
- **Syntax**: `TO_DATE('date_string', 'format_model')`
- Converts a text string into an internal Oracle `DATE` object.
- **Client Display Note**: `TO_DATE` returns an internal binary date storing both date and time. However, clients display it using the session's default `NLS_DATE_FORMAT` (`DD-MON-RR`), hiding the time unless `TO_CHAR()` is explicitly used.
- **YY vs RR Century Resolution**:
  - `YY`: Strictly assumes the current century (`'95'` with `YY` → `2095`).
  - `RR` (50-year sliding window): When queried in the current century (years 00-49):
    - Year `00-49` → Current century (2000s).
    - Year `50-99` → Previous century (1900s, e.g., `'85'` with `RR` → `1985`).
- Example: `SELECT TO_DATE('20-OCT-85', 'DD-MON-RR') FROM DUAL;` returns `20-OCT-1985`.

## 5. Converting Strings to Numbers (TO_NUMBER)
- **Syntax**: `TO_NUMBER('string' [, 'format_model'])`
- Converts a formatted text string into a true database Number.
- If the text has currency signs, commas, or spaces, a matching format model must be supplied.
- Missing or mismatched format on formatted text raises: `invalid number`.
- Example: `SELECT TO_NUMBER('$2,500', '$9,999') FROM DUAL;` returns `2500`.

## 6. General Functions (COALESCE)
- **Syntax**: `COALESCE(expr1, expr2, ... expr_n)`
- Evaluates expressions from left to right and returns the first non-null expression.
- Short-circuits: stops evaluation as soon as the first non-null value is encountered.
- Returns NULL only if all expressions in the list evaluate to NULL.
- All expressions must have compatible data types; datatype mismatch raises: `inconsistent datatypes`.
- Example: `SELECT COALESCE(NULL, NULL, 50, 100) FROM DUAL;` returns `50`.

## 7. General Functions (NULLIF)
- **Syntax**: `NULLIF(expr1, expr2)`
- Compares two expressions:
  - If `expr1 = expr2`, returns `NULL`.
  - If `expr1 != expr2`, returns `expr1`.
- **Division by Zero Protection**: `total_sales / NULLIF(total_units, 0)` safely turns 0 into NULL to avoid the error: `divisor is equal to zero`.
- Example: `SELECT NULLIF(100, 100)` → `NULL`; `SELECT NULLIF('Apple', 'Orange')` → `'Apple'`.

## 8. Conditional Logic (CASE Expressions)
- **Syntax**:
  ```sql
  CASE 
      WHEN condition1 THEN result1
      WHEN condition2 THEN result2
      ELSE default_result
  END
  ```
- Evaluates conditions from top to bottom; returns result for first `TRUE` condition.
- If no conditions match and `ELSE` is omitted, returns `NULL`.
- Strictly requires the `END` keyword to close the block.
- **Datatype Consistency**: All return expressions in `THEN` and `ELSE` branches must have compatible data types. Returning mismatched datatypes (e.g., Number in THEN and Text in ELSE) raises: `inconsistent datatypes: expected NUMBER got CHAR`.
- **Searched vs. Simple CASE**:
  - **Searched CASE**: Evaluates boolean conditions with relational operators (`CASE WHEN salary >= 10000 THEN ...`).
  - **Simple CASE**: Matches an expression against discrete values (`CASE dept_id WHEN 10 THEN 'Admin' ...`).
- Example: `CASE WHEN score >= 50 THEN 'Pass' ELSE 'Fail' END AS result_status`.

## 9. Oracle Proprietary DECODE
- **Syntax**: `DECODE(column, search1, result1 [, search2, result2, ... , default])`
- Compact Oracle-specific conditional function operating like a switch statement.
- Returns `default` if no search matches (or `NULL` if default is omitted).
- **DECODE vs CASE Distinction**:
  - `DECODE` strictly checks for **equality (`=`)** only; it cannot handle relational operators or ranges (`<`, `>`, `BETWEEN`).
  - For ranges, you **must use `CASE`**.
  - `DECODE` evaluates two `NULL` values as equal (`DECODE(col, NULL, 'None')` works).
- Example: `SELECT DECODE(dept_id, 10, 'Admin', 20, 'Sales', 'Other') FROM employees;`
