window.STAGE_GATE_DATA = [
  {
    "id": "general_knowledge",
    "title": "0. General Knowledge",
    "folder": "general_knowledge",
    "content": "# Topic Notes: General Knowledge\n\n## 1. SQL Logical Order of Execution\n\n- **Engine Processing Sequence**:\n  1. `FROM` & `JOIN`: Identifies tables, evaluates join conditions, and builds initial working dataset.\n  2. `WHERE`: Filters individual rows based on row-level predicates.\n  3. `GROUP BY`: Collapses filtered rows into summary groups.\n  4. `HAVING`: Filters aggregated summary groups.\n  5. `SELECT`: Computes expressions, resolves column projection, and assigns column aliases.\n  6. `DISTINCT`: Removes duplicate rows from the projected output.\n  7. `ORDER BY`: Sorts the final output rows.\n  8. `FETCH / OFFSET`: Limits the final number of rows returned.\n\n- **Column Alias Trap in WHERE / HAVING**:\n  - Column aliases defined in `SELECT` cannot be referenced in `WHERE` or `HAVING`.\n  - Attempting to do so fails with: `invalid identifier`.\n  - **Reason**: `WHERE` (step 2) and `HAVING` (step 4) execute before `SELECT` (step 5) assigns the alias.\n\n- **Column Aliases in ORDER BY**:\n  - Column aliases defined in `SELECT` are completely valid and supported in `ORDER BY`.\n  - **Reason**: `ORDER BY` (step 7) executes after `SELECT` (step 5).\n\n- **Aggregate Functions in WHERE**:\n  - Aggregate functions (`COUNT`, `SUM`, `AVG`, `MIN`, `MAX`) cannot be placed in `WHERE`.\n  - Attempting to do so fails with: `group function is not allowed here`.\n  - **Reason**: Aggregation happens in `GROUP BY` (step 3); individual rows in `WHERE` (step 2) are not yet grouped.\n",
    "examples": {
      "1": [
        {
          "sql": "SELECT department_id, COUNT(*) AS dept_count\nFROM employees\nWHERE salary > 3000\nGROUP BY department_id\nHAVING COUNT(*) >= 2\nORDER BY dept_count DESC;",
          "output": "DEPARTMENT_ID  DEPT_COUNT\n-------------  ----------\n           50           5\n           80           3\n           60           2"
        }
      ]
    }
  },
  {
    "id": "select_statement",
    "title": "1. SELECT Statement",
    "folder": "select_statement",
    "content": "# SELECT Statement - Notes\n\n## 1. Basic SELECT (Projection)\n- **Syntax**: `SELECT col1, col2 FROM table_name;`\n- `*` selects all columns from the table.\n- Listing specific column names fetches only those columns.\n- **Literal Constants in SELECT**: You can select fixed numbers or text strings directly without referencing table columns (e.g., `SELECT 1, 'Active' FROM employees;`). Oracle simply repeats that constant value for every matching row returned.\n- **Semicolon (`;`)**: **Not mandatory** in pure SQL syntax. In client tools (SQL*Plus, SQL Developer), it is used as a statement terminator to send the query (a slash `/` on a new line can also execute it). In programming APIs or dynamic SQL, `;` is forbidden.\n\n## 2. Column Aliases & Quote Rules\n- **Syntax**: `SELECT col AS alias_name FROM table;` or `SELECT col alias_name FROM table;`\n- Renames the column header in the query output. The `AS` keyword is optional.\n- By default, Oracle displays aliases in all-uppercase.\n- **Double Quotes (`\"\"`)**: Mandatory if the alias contains spaces, special symbols (e.g. `$`, `#`), or requires exact lowercase/mixed case (e.g., `\"Full Name\"`, `\"Annual Salary ($)\"`).\n- **Exam Trap**: Never use single quotes (`''`) for aliases (single quotes are strictly for text literals, not column aliases). Using `''` for an alias causes: `FROM keyword not found where expected`.\n\n## 3. Arithmetic Expressions & NULL\n- Math operators (`+`, `-`, `*`, `/`) can be applied directly to numeric columns or literals in the `SELECT` clause (e.g., `SELECT salary * 12 FROM employees;`).\n- `NULL` represents an unknown/missing value (not zero, not blank).\n- Any arithmetic calculation involving `NULL` always results in `NULL` (e.g., `4000 + NULL = NULL`).\n\n## 4. Handling NULL in Arithmetic with NVL()\n- **Syntax**: `NVL(column_or_expression, default_value)`\n- Replaces a `NULL` with a specified replacement value so arithmetic calculations are not wiped out to `NULL`.\n- Example: `SELECT item_price + NVL(shipping_fee, 0) AS total_amount FROM orders;`\n- Both arguments in `NVL` must have compatible data types; datatype mismatch raises: `invalid number`.\n\n## 5. String Concatenation (||) & Literals\n- **Syntax**: `SELECT col1 || ' literal text ' || col2 AS alias_name FROM table;`\n- Uses two vertical bars `||` to combine columns and text into one output column.\n- Fixed text characters and spaces must be wrapped in single quotes `'...'` (e.g., `' is a '`).\n- **Concatenating with NULL**: In Oracle, `'Hello' || NULL || 'World'` treats `NULL` as an empty string (returns `'HelloWorld'`).\n\n## 6. The Oracle DUAL Table\n- **Syntax**: `SELECT expression FROM DUAL;`\n- In Oracle, every `SELECT` query strictly requires a `FROM` clause; omitting it raises: `FROM keyword not found where expected`.\n- `DUAL` is Oracle's built-in pseudo-table with 1 row and 1 column (`DUMMY`).\n- Used to test math, functions, or view system values like `SYSDATE` without referencing a user table.\n\n## 7. Eliminating Duplicates with DISTINCT\n- **Syntax**: `SELECT DISTINCT col1, col2 FROM table;`\n- Removes duplicate rows from the query output.\n- Must appear immediately after the `SELECT` keyword; placing it mid-list (e.g., `SELECT col1, DISTINCT col2`) causes: `missing expression`.\n- When used with multiple columns, it evaluates uniqueness across the combination of all listed columns.\n",
    "examples": {
      "1": [
        {
          "sql": "-- Standard: Select all columns and rows using asterisk (*)\nSELECT * FROM departments\nWHERE department_id IN (10, 20);",
          "output": "DEPARTMENT_ID  DEPARTMENT_NAME  MANAGER_ID  LOCATION_ID\n-------------  ---------------  ----------  -----------\n           10  Administration          200         1700\n           20  Marketing               201         1800"
        },
        {
          "sql": "-- Best Practice: Project only specific columns needed by the application\nSELECT department_id, department_name\nFROM departments\nWHERE department_id IN (10, 20);",
          "output": "DEPARTMENT_ID  DEPARTMENT_NAME\n-------------  ---------------\n           10  Administration\n           20  Marketing"
        }
      ],
      "2": [
        {
          "sql": "-- Standard: Renaming output headers using optional AS keyword (uppercased by default)\nSELECT first_name AS fname, salary AS monthly_pay\nFROM employees\nWHERE employee_id = 100;",
          "output": "FNAME   MONTHLY_PAY\n------  -----------\nSteven        24000"
        },
        {
          "sql": "-- Alternative: Renaming output headers by omitting AS keyword\nSELECT first_name fname, salary monthly_pay\nFROM employees\nWHERE employee_id = 100;",
          "output": "FNAME   MONTHLY_PAY\n------  -----------\nSteven        24000"
        },
        {
          "sql": "-- Standard: Double quotes preserve exact lowercase, spaces, and special symbols\nSELECT first_name AS \"First Name\",\n       salary * 12 AS \"Annual Salary ($)\"\nFROM employees\nWHERE employee_id = 100;",
          "output": "First Name  Annual Salary ($)\n----------  -----------------\nSteven                 288000"
        },
        {
          "sql": "-- Exam Trap: Using single quotes for column alias raises error\nSELECT first_name 'Employee Name' FROM employees;\n-- Error: FROM keyword not found where expected",
          "output": "Error: FROM keyword not found where expected\nCause: Single quotes are strictly for text literals; aliases requiring spaces must use double quotes (\"...\")."
        }
      ],
      "3": [
        {
          "sql": "-- Standard: Arithmetic operators (+, -, *, /) applied directly in SELECT\nSELECT salary, salary * 12 AS annual_sal, salary + 500 AS sal_with_bonus\nFROM employees\nWHERE employee_id = 100;",
          "output": "    SALARY  ANNUAL_SAL  SAL_WITH_BONUS\n----------  ----------  --------------\n     24000      288000           24500"
        },
        {
          "sql": "-- Rule: Any arithmetic operation involving NULL results in NULL\nSELECT salary, commission_pct, salary * commission_pct AS comm_amount\nFROM employees\nWHERE employee_id = 100;",
          "output": "    SALARY  COMMISSION_PCT  COMM_AMOUNT\n----------  --------------  -----------\n     24000                        <NULL>"
        },
        {
          "sql": "-- Dual test: NULL arithmetic propagation holds across all operators\nSELECT 100 + NULL AS r1, 50 * NULL AS r2, 0 / NULL AS r3 FROM dual;",
          "output": "R1      R2      R3\n------  ------  ------\n<NULL>  <NULL>  <NULL>"
        }
      ],
      "4": [
        {
          "sql": "-- Standard: NVL replaces NULL with replacement value to safeguard calculations\nSELECT employee_id, salary, commission_pct,\n       salary + (salary * NVL(commission_pct, 0)) AS total_compensation\nFROM employees\nWHERE employee_id IN (100, 145);",
          "output": "EMPLOYEE_ID      SALARY  COMMISSION_PCT  TOTAL_COMPENSATION\n-----------  ----------  --------------  ------------------\n        100       24000                               24000\n        145       14000             .4                19600"
        },
        {
          "sql": "-- Exam Trap: NVL arguments must share compatible datatypes (Number vs Char raises error)\nSELECT NVL(commission_pct, 'No Commission') FROM employees;\n-- Error: invalid number",
          "output": "Error: invalid number\nCause: commission_pct is numeric, but 'No Commission' is a character string that cannot be coerced to number."
        }
      ],
      "5": [
        {
          "sql": "-- Standard: Concatenating columns and string literals using || operator\nSELECT first_name || ' ' || last_name AS full_name\nFROM employees\nWHERE employee_id = 100;",
          "output": "FULL_NAME\n-----------\nSteven King"
        },
        {
          "sql": "-- Practical: Building complete sentences using literals and column values\nSELECT first_name || ' earns $' || salary || ' per month' AS emp_summary\nFROM employees\nWHERE employee_id = 100;",
          "output": "EMP_SUMMARY\n------------------------------------\nSteven earns $24000 per month"
        },
        {
          "sql": "-- Oracle Feature: Concatenating NULL with text treats NULL as empty string\nSELECT 'Hello' || NULL || 'World' AS greeting FROM dual;",
          "output": "GREETING\n----------\nHelloWorld"
        }
      ],
      "6": [
        {
          "sql": "-- Standard: DUAL is a 1-row pseudo-table used to compute expressions and system values\nSELECT 25 * 4 AS calc_res, SYSDATE AS sys_dt FROM dual;",
          "output": "  CALC_RES  SYS_DT\n----------  ---------\n       100  13-NOV-26"
        },
        {
          "sql": "-- Architecture: DUAL has exactly 1 column named DUMMY with a single row value 'X'\nSELECT * FROM dual;",
          "output": "DUMMY\n-----\nX"
        },
        {
          "sql": "-- Exam Trap: In Oracle, omitting the FROM clause is illegal syntax\nSELECT 10 + 5;\n-- Error: FROM keyword not found where expected",
          "output": "Error: FROM keyword not found where expected\nCause: Oracle SQL strictly requires a FROM clause in every SELECT statement (unlike SQL Server or MySQL)."
        }
      ],
      "7": [
        {
          "sql": "-- Standard: DISTINCT removes duplicate values from the output\nSELECT DISTINCT department_id\nFROM employees\nWHERE department_id IN (10, 20, 90)\nORDER BY department_id;",
          "output": "DEPARTMENT_ID\n-------------\n           10\n           20\n           90"
        },
        {
          "sql": "-- Multi-Column: Evaluates uniqueness across the combination of all listed columns\nSELECT DISTINCT department_id, job_id\nFROM employees\nWHERE department_id = 20;",
          "output": "DEPARTMENT_ID  JOB_ID\n-------------  ----------\n           20  MK_MAN\n           20  MK_REP"
        },
        {
          "sql": "-- Exam Trap: DISTINCT must appear immediately after SELECT; mid-list placement fails\nSELECT department_id, DISTINCT job_id FROM employees;\n-- Error: missing expression",
          "output": "Error: missing expression\nCause: DISTINCT is a statement-level modifier and must precede all selected columns."
        }
      ]
    }
  },
  {
    "id": "where_clause",
    "title": "2. WHERE Clause",
    "folder": "where_clause",
    "content": "# WHERE Clause - Notes\n\n## 1. Basic Filtering & Comparison Operators\n- **Syntax**: `SELECT col1, col2 FROM table_name WHERE condition;`\n- Filters rows returned by the query; placed immediately after the `FROM` clause.\n- Comparison operators: `=` (equal), `>` (greater than), `<` (less than), `>=` (greater or equal), `<=` (less or equal), `<>` or `!=` (not equal).\n- Example: `SELECT * FROM employees WHERE department_id = 10;`\n\n## 2. Filtering Text & Dates (Case-Sensitivity)\n- Text and date values must always be enclosed in single quotes `'...'` (e.g., `'CHICAGO'`, `'01-JAN-2024'`).\n- In Oracle, text data inside quotes is strictly **case-sensitive** (`'CHICAGO'` will not match `'Chicago'`).\n- Column names and SQL keywords remain case-insensitive.\n- Example: `SELECT emp_name, salary FROM employees WHERE city = 'CHICAGO';`\n\n## 3. Logical Operators (AND & OR)\n- **AND**: Returns rows only when all combined conditions evaluate to TRUE.\n- **OR**: Returns rows if at least one of the conditions evaluates to TRUE.\n- Example: `SELECT * FROM employees WHERE department_id = 20 AND salary < 4000;`\n\n## 4. Operator Precedence (AND before OR)\n- `AND` is evaluated before `OR` by default.\n- Without parentheses, `cond1 OR cond2 AND cond3` is processed as `cond1 OR (cond2 AND cond3)`.\n- Use parentheses `()` to enforce priority and group `OR` conditions properly:\n  `SELECT * FROM employees WHERE (job = 'CLERK' OR job = 'ANALYST') AND salary > 3000;`\n\n## 5. Range Filtering (BETWEEN ... AND ...)\n- **Syntax**: `WHERE column BETWEEN lower_val AND upper_val;`\n- Evaluates whether a value falls within a specified range.\n- Strictly **inclusive** of both boundary limits (>= lower and <= upper).\n- The lower boundary must always be specified first; reversing the order (e.g., `BETWEEN 150 AND 50`) returns 0 rows.\n- Example: `SELECT product_name, price FROM products WHERE price BETWEEN 50 AND 150;`\n\n## 6. List Matching (IN & NOT IN)\n- **Syntax**: `WHERE column IN (val1, val2, ...);`\n- Checks whether a value matches any entry in a comma-separated list (replaces multiple `OR` conditions).\n- Values must be wrapped in parentheses `(...)`.\n- Negative form: `WHERE column NOT IN (val1, val2);` excludes matching rows.\n- **NULL Trap with NOT IN**: If a literal `NULL` is present in a `NOT IN` list (e.g., `NOT IN (10, 20, NULL)`), the condition evaluates to `UNKNOWN` and returns **0 rows**.\n- Example: `SELECT * FROM employees WHERE job_id IN ('IT_PROG', 'SA_REP', 'HR_REP');`\n\n## 7. Pattern Matching (LIKE Operator)\n- **Syntax**: `WHERE column LIKE 'pattern';`\n- Searches for text patterns; strictly case-sensitive.\n- Wildcard `%`: Matches zero or more characters (e.g., `'S%'` starts with S, `'%son'` ends with son, `'%an%'` contains an).\n- Wildcard `_`: Matches exactly one single character (e.g., `'_a%'` has 'a' as second character).\n- Negative form: `WHERE column NOT LIKE 'pattern';`.\n- **ESCAPE Identifier**: Use `ESCAPE` to search for literal `%` or `_` characters (e.g., `WHERE job_id LIKE 'SA\\_%' ESCAPE '\\'`).\n- Example: `SELECT first_name FROM employees WHERE first_name LIKE '_a%';`\n\n## 8. Filtering for NULLs (IS NULL & IS NOT NULL)\n- `NULL` represents an unknown/missing value and cannot be compared using `=` or `!=`.\n- Comparing with `= NULL` or `!= NULL` silently evaluates to `UNKNOWN` (treated as FALSE) and returns 0 rows.\n- Use `IS NULL` to find missing values: `WHERE column IS NULL;`\n- Use `IS NOT NULL` to find populated values: `WHERE column IS NOT NULL;`\n- Example: `SELECT * FROM tasks WHERE completion_date IS NOT NULL;`\n",
    "examples": {
      "1": [
        {
          "sql": "-- Standard: Equality filter (=) returns rows matching the criteria\nSELECT first_name, last_name, department_id\nFROM employees\nWHERE department_id = 10;",
          "output": "FIRST_NAME  LAST_NAME  DEPARTMENT_ID\n----------  ---------  -------------\nJennifer    Whalen                10"
        },
        {
          "sql": "-- Relational: Comparison operators (<, >, <=, >=, <>, !=)\nSELECT first_name, salary\nFROM employees\nWHERE salary >= 17000 AND department_id <> 90;",
          "output": "FIRST_NAME  SALARY\n----------  ------\nNeena        17000\nLex          17000"
        }
      ],
      "2": [
        {
          "sql": "-- Standard: Text in quotes is strictly case-sensitive ('King' vs 'KING')\nSELECT employee_id, last_name FROM employees WHERE last_name = 'King';",
          "output": "EMPLOYEE_ID  LAST_NAME\n-----------  ---------\n        100  King\n        156  King"
        },
        {
          "sql": "-- Gotcha: Mismatched case returns 0 rows without raising an error\nSELECT employee_id, last_name FROM employees WHERE last_name = 'KING';",
          "output": "no rows selected"
        },
        {
          "sql": "-- Standard: Date literal filtering using default Oracle format DD-MON-RR\nSELECT first_name, hire_date\nFROM employees\nWHERE hire_date >= '01-JAN-2005' AND department_id = 90;",
          "output": "FIRST_NAME  HIRE_DATE\n----------  ---------\nNeena       21-SEP-05"
        }
      ],
      "3": [
        {
          "sql": "-- Standard: AND requires both conditions to be TRUE\nSELECT first_name, department_id, salary\nFROM employees\nWHERE department_id = 90 AND salary > 20000;",
          "output": "FIRST_NAME  DEPARTMENT_ID  SALARY\n----------  -------------  ------\nSteven                 90   24000"
        },
        {
          "sql": "-- Standard: OR returns rows where at least one condition is TRUE\nSELECT first_name, department_id, salary\nFROM employees\nWHERE department_id = 10 OR salary > 20000;",
          "output": "FIRST_NAME  DEPARTMENT_ID  SALARY\n----------  -------------  ------\nSteven                 90   24000\nJennifer               10    4400"
        }
      ],
      "4": [
        {
          "sql": "-- Exam Trap: AND has higher precedence than OR; cond1 OR cond2 AND cond3\n-- Evaluates as: department_id = 10 OR (department_id = 90 AND salary > 20000)\nSELECT first_name, department_id, salary\nFROM employees\nWHERE department_id = 10 OR department_id = 90 AND salary > 20000;",
          "output": "FIRST_NAME  DEPARTMENT_ID  SALARY\n----------  -------------  ------\nSteven                 90   24000\nJennifer               10    4400"
        },
        {
          "sql": "-- Proper Practice: Parentheses override precedence to evaluate OR first\nSELECT first_name, department_id, salary\nFROM employees\nWHERE (department_id = 10 OR department_id = 90) AND salary > 20000;",
          "output": "FIRST_NAME  DEPARTMENT_ID  SALARY\n----------  -------------  ------\nSteven                 90   24000"
        }
      ],
      "5": [
        {
          "sql": "-- Standard: BETWEEN is inclusive of both boundary values (>= lower AND <= upper)\nSELECT first_name, salary\nFROM employees\nWHERE salary BETWEEN 17000 AND 24000\nORDER BY salary;",
          "output": "FIRST_NAME  SALARY\n----------  ------\nNeena        17000\nLex          17000\nSteven       24000"
        },
        {
          "sql": "-- Exam Trap: Specifying higher boundary first returns 0 rows (val >= 24000 AND val <= 17000 is impossible)\nSELECT first_name, salary\nFROM employees\nWHERE salary BETWEEN 24000 AND 17000;",
          "output": "no rows selected"
        },
        {
          "sql": "-- Date Range: BETWEEN works identically on date boundaries\nSELECT first_name, hire_date\nFROM employees\nWHERE hire_date BETWEEN '01-JAN-2003' AND '31-DEC-2003';",
          "output": "FIRST_NAME  HIRE_DATE\n----------  ---------\nSteven      17-JUN-03"
        }
      ],
      "6": [
        {
          "sql": "-- Standard: IN tests matching against a discrete set of values\nSELECT first_name, department_id\nFROM employees\nWHERE department_id IN (10, 20)\nORDER BY department_id;",
          "output": "FIRST_NAME  DEPARTMENT_ID\n----------  -------------\nJennifer               10\nMichael                20\nPat                    20"
        },
        {
          "sql": "-- Standard: NOT IN excludes matching values from the result set\nSELECT first_name, department_id\nFROM employees\nWHERE department_id NOT IN (20, 50, 60, 80, 90, 100, 110);",
          "output": "FIRST_NAME  DEPARTMENT_ID\n----------  -------------\nJennifer               10"
        },
        {
          "sql": "-- Exam Trap: Literal NULL inside NOT IN causes condition to evaluate to UNKNOWN, returning 0 rows!\nSELECT first_name, department_id\nFROM employees\nWHERE department_id NOT IN (10, 20, NULL);",
          "output": "no rows selected\nNote: dept != 10 AND dept != 20 AND dept != NULL -> TRUE AND TRUE AND UNKNOWN evaluates to UNKNOWN."
        }
      ],
      "7": [
        {
          "sql": "-- Standard: % wildcard matches 0 or more characters; _ matches exactly 1 character\nSELECT first_name\nFROM employees\nWHERE first_name LIKE 'S%n';  -- Starts with S, ends with n",
          "output": "FIRST_NAME\n----------\nSteven"
        },
        {
          "sql": "-- Single Character: _a% matches names having 'a' as their second letter\nSELECT first_name\nFROM employees\nWHERE first_name LIKE '_a%'\nORDER BY first_name;",
          "output": "FIRST_NAME\n----------\nDaniel\nDavid\nPat"
        },
        {
          "sql": "-- Exam Gotcha: ESCAPE clause escapes literal wildcards in searches\nSELECT job_id FROM jobs WHERE job_id LIKE 'SA\\_%' ESCAPE '\\';",
          "output": "JOB_ID\n------\nSA_MAN\nSA_REP"
        }
      ],
      "8": [
        {
          "sql": "-- Standard: NULL values cannot be matched with =; must use IS NULL / IS NOT NULL\nSELECT first_name, commission_pct\nFROM employees\nWHERE department_id = 90 AND commission_pct IS NULL;",
          "output": "FIRST_NAME  COMMISSION_PCT\n----------  --------------\nSteven              <NULL>\nNeena               <NULL>\nLex                 <NULL>"
        },
        {
          "sql": "-- Exam Trap: Using = NULL or != NULL compiles but always returns 0 rows\nSELECT first_name, commission_pct\nFROM employees\nWHERE commission_pct = NULL;",
          "output": "no rows selected\nCause: Comparison with NULL using '=' produces UNKNOWN (treated as FALSE by WHERE)."
        }
      ]
    }
  },
  {
    "id": "order_by_clause",
    "title": "3. ORDER BY Clause",
    "folder": "order_by_clause",
    "content": "# ORDER BY Clause - Notes\n\n## 1. Basic Sorting (ASC vs DESC)\n- **Syntax**: `SELECT col1, col2 FROM table_name ORDER BY column [ASC | DESC];`\n- Sorts query output; always placed as the very last clause of the query.\n- `ASC` (default): Ascending order (1-10, A-Z, oldest date to newest).\n- `DESC`: Descending order (10-1, Z-A, newest date to oldest).\n- Example: `SELECT * FROM employees ORDER BY hire_date DESC;`\n\n## 2. Multi-Column Sorting\n- **Syntax**: `ORDER BY col1 [ASC|DESC], col2 [ASC|DESC];`\n- Sorts primarily by the first column; subsequent columns are evaluated only when ties (identical values) occur in preceding columns.\n- Each column can have its own independent sort direction (`ASC` or `DESC`).\n- Example: `SELECT * FROM students ORDER BY grade ASC, score DESC;`\n\n## 3. Sorting by Aliases & Positional Numbers\n- **Aliases in ORDER BY**: Because `ORDER BY` executes after the `SELECT` clause, it can legally sort using column aliases (`ORDER BY annual_salary DESC;`).\n- **Aliases in WHERE (Invalid)**: `WHERE` executes before `SELECT`, so using an alias in `WHERE` fails with: `\"ALIAS_NAME\": invalid identifier`.\n- **Positional Numbers**: Columns can be sorted by their 1-based index in the `SELECT` list (`ORDER BY 2 DESC;` sorts by the 2nd column selected).\n\n## 4. Sorting with NULLs (NULLS FIRST / NULLS LAST)\n- In Oracle, `NULL` is treated as the greatest/highest value when sorting.\n- **Default Behavior**:\n  - `ASC` orders default to **`NULLS LAST`** (bottom of the list).\n  - `DESC` orders default to **`NULLS FIRST`** (top of the list).\n- **Manual Override**: Append `NULLS FIRST` or `NULLS LAST` to control placement explicitly:\n  `SELECT emp_name, salary FROM employees ORDER BY salary DESC NULLS LAST;`\n",
    "examples": {
      "1": [
        {
          "sql": "-- Standard: Default sort is ascending (ASC); sorts numbers low-to-high, dates past-to-future\nSELECT first_name, salary\nFROM employees\nWHERE department_id = 90\nORDER BY salary;  -- Default ASC",
          "output": "FIRST_NAME  SALARY\n----------  ------\nNeena        17000\nLex          17000\nSteven       24000"
        },
        {
          "sql": "-- Explicit: DESC sorts from highest to lowest\nSELECT first_name, salary\nFROM employees\nWHERE department_id = 90\nORDER BY salary DESC;",
          "output": "FIRST_NAME  SALARY\n----------  ------\nSteven       24000\nNeena        17000\nLex          17000"
        }
      ],
      "2": [
        {
          "sql": "-- Multi-Column: Primary sort by department ASC; ties broken by salary DESC\nSELECT department_id, first_name, salary\nFROM employees\nWHERE department_id IN (20, 90)\nORDER BY department_id ASC, salary DESC;",
          "output": "DEPARTMENT_ID  FIRST_NAME  SALARY\n-------------  ----------  ------\n           20  Michael      13000\n           20  Pat           6000\n           90  Steven       24000\n           90  Neena        17000\n           90  Lex          17000"
        },
        {
          "sql": "-- Practical: Multi-column sorting with independent directions on text and numbers\nSELECT department_id, job_id, salary\nFROM employees\nWHERE department_id = 80\nORDER BY job_id ASC, salary DESC;",
          "output": "DEPARTMENT_ID  JOB_ID      SALARY\n-------------  ----------  ------\n           80  SA_MAN       14000\n           80  SA_MAN       13500\n           80  SA_REP       11500\n           80  SA_REP       10000"
        }
      ],
      "3": [
        {
          "sql": "-- Standard: ORDER BY executes after SELECT, so using column aliases is valid\nSELECT first_name, salary * 12 AS annual_comp\nFROM employees\nWHERE department_id = 90\nORDER BY annual_comp DESC;",
          "output": "FIRST_NAME  ANNUAL_COMP\n----------  -----------\nSteven           288000\nNeena            204000\nLex              204000"
        },
        {
          "sql": "-- Positional: Ordering by 1-based column position in the SELECT list\nSELECT first_name, salary\nFROM employees\nWHERE department_id = 90\nORDER BY 2 DESC;  -- 2 refers to salary",
          "output": "FIRST_NAME  SALARY\n----------  ------\nSteven       24000\nNeena        17000\nLex          17000"
        },
        {
          "sql": "-- Exam Trap: Using alias in WHERE clause raises error (WHERE runs before SELECT!)\nSELECT first_name, salary * 12 AS annual_sal\nFROM employees\nWHERE annual_sal > 200000;\n-- Error: \"ANNUAL_SAL\": invalid identifier",
          "output": "Error: \"ANNUAL_SAL\": invalid identifier\nCause: Execution order is FROM -> WHERE -> SELECT -> ORDER BY. Alias does not exist during WHERE filtering."
        }
      ],
      "4": [
        {
          "sql": "-- Default Behavior: In Oracle, NULL is treated as highest value (ASC -> NULLS LAST, DESC -> NULLS FIRST)\nSELECT first_name, commission_pct\nFROM employees\nWHERE department_id IN (80, 90)\nORDER BY commission_pct DESC;",
          "output": "FIRST_NAME  COMMISSION_PCT\n----------  --------------\nSteven              <NULL>  (NULLs placed at top by default in DESC)\nNeena               <NULL>\nRussell                 .4\nPartners                .3"
        },
        {
          "sql": "-- Manual Override: Force NULLs to bottom in descending sort using NULLS LAST\nSELECT first_name, commission_pct\nFROM employees\nWHERE department_id IN (80, 90)\nORDER BY commission_pct DESC NULLS LAST;",
          "output": "FIRST_NAME  COMMISSION_PCT\n----------  --------------\nRussell                 .4\nPartners                .3\nSteven              <NULL>  (Forced to bottom)\nNeena               <NULL>"
        },
        {
          "sql": "-- Manual Override: Force NULLs to top in ascending sort using NULLS FIRST\nSELECT first_name, commission_pct\nFROM employees\nWHERE department_id IN (80, 90)\nORDER BY commission_pct ASC NULLS FIRST;",
          "output": "FIRST_NAME  COMMISSION_PCT\n----------  --------------\nSteven              <NULL>  (Forced to top)\nNeena               <NULL>\nPartners                .3\nRussell                 .4"
        }
      ]
    }
  },
  {
    "id": "character_functions",
    "title": "4. Character Functions",
    "folder": "character_functions",
    "content": "# Character Functions - Notes\n\n## 1. Case Conversion Functions\n- **UPPER(str)**: Converts all letters to uppercase (`UPPER('sql')` → `'SQL'`).\n- **LOWER(str)**: Converts all letters to lowercase (`LOWER('SQL')` → `'sql'`).\n- **INITCAP(str)**: Capitalizes the first letter of each word and sets the rest to lowercase (`INITCAP('stage gate')` → `'Stage Gate'`).\n- **Case-Insensitive Search Pattern**: Use `UPPER()` or `LOWER()` in the `WHERE` clause to bypass Oracle's strict case sensitivity:\n  `SELECT * FROM users WHERE LOWER(email) = 'admin@deloitte.com';`\n\n## 2. String Length (LENGTH)\n- **Syntax**: `LENGTH(string)`\n- Returns the total count of characters as an integer (spaces are included).\n- `LENGTH(NULL)` returns `NULL` (not 0).\n- Example: `SELECT * FROM user_accounts WHERE LENGTH(password) < 8;`\n\n## 3. Substring Extraction (SUBSTR)\n- **Syntax**: `SUBSTR(string, start_position [, length])`\n- `start_position`: 1-based index (1 is the first character).\n- `length` (optional): Count of characters to extract; if omitted, extracts to the end of the string.\n- **Negative Index**: Counts backwards from the end of the string (`-1` is the last character).\n- **Start Position 0**: Oracle treats a start position of `0` as `1` (e.g., `SUBSTR('Oracle', 0, 3)` returns `'Ora'`).\n- Character case is preserved from the original string.\n- Example: `SUBSTR('Database', -3, 2)` starts 3 characters from the end ('a') and takes 2 characters → `'as'`.\n\n## 4. Finding String Positions (INSTR)\n- **Syntax**: `INSTR(string, substring [, start_position [, occurrence]])`\n- Returns the numeric 1-based index where the substring is located.\n- Returns `0` if the substring is not found (not NULL, not an error).\n- `start_position` (default 1): Index where the search begins.\n- `occurrence` (default 1): Which instance to find (e.g., `2` for second appearance).\n- Example: `SELECT INSTR('Stage Gate Exam', 'a', 1, 2) FROM DUAL;` returns `8` (2nd 'a' is at index 8).\n\n## 5. String Padding (LPAD & RPAD)\n- **Syntax**: `LPAD(string, total_length, pad_char)` and `RPAD(string, total_length, pad_char)`\n- `LPAD`: Fills the left side with `pad_char` until the string reaches `total_length`.\n- `RPAD`: Fills the right side with `pad_char` until the string reaches `total_length`.\n- **Truncation Behavior**: If `total_length` is less than the string's actual length, Oracle truncates the string to that length without error (e.g., `LPAD('Deloitte', 4, '*')` → `'Delo'`).\n- Example: `SELECT RPAD('Oracle', 8, '-') FROM DUAL;` returns `'Oracle--'`.\n\n## 6. Trimming Characters (TRIM)\n- **Syntax**: `TRIM([LEADING | TRAILING | BOTH] [trim_char FROM] string)`\n- Default `TRIM(str)` removes leading and trailing whitespace.\n- Can remove a specific character from the front (`LEADING`), back (`TRAILING`), or `BOTH`.\n- **Strict Constraint**: `TRIM` can only accept **one single character**. Passing multiple characters (e.g., `TRIM('12' FROM ...)`) raises: `trim set should have only one character`.\n- Example: `SELECT TRIM(LEADING '0' FROM '00045') FROM DUAL;` returns `'45'`.\n\n## 7. Substring Replacement (REPLACE)\n- **Syntax**: `REPLACE(source_string, search_string [, replacement_string])`\n- Searches the entire string and replaces all occurrences of `search_string`.\n- Can handle multi-character patterns.\n- If `replacement_string` is omitted, all occurrences of `search_string` are deleted.\n- Example: `SELECT REPLACE('Stage Gate Exam', ' ', '_') FROM DUAL;` returns `'Stage_Gate_Exam'`.\n",
    "examples": {
      "1": [
        {
          "sql": "-- Standard: Case conversion functions (UPPER, LOWER, INITCAP)\nSELECT UPPER('stage gate') AS u_val,\n       LOWER('STAGE GATE') AS l_val,\n       INITCAP('stage gate exam') AS init_val\nFROM dual;",
          "output": "U_VAL       L_VAL       INIT_VAL\n----------  ----------  ---------------\nSTAGE GATE  stage gate  Stage Gate Exam"
        },
        {
          "sql": "-- Practical Pattern: Case-insensitive search using UPPER() in WHERE clause\nSELECT first_name, last_name, email\nFROM employees\nWHERE UPPER(last_name) = 'KING';",
          "output": "FIRST_NAME  LAST_NAME  EMAIL\n----------  ---------  --------\nSteven      King       SKING\nJanette     King       JKING"
        }
      ],
      "2": [
        {
          "sql": "-- Standard: LENGTH counts total characters including spaces\nSELECT LENGTH('Oracle SQL') AS len_with_space,\n       LENGTH('Database') AS len_word\nFROM dual;",
          "output": "LEN_WITH_SPACE  LEN_WORD\n--------------  --------\n            10         8"
        },
        {
          "sql": "-- Exam Trap: LENGTH(NULL) returns NULL (not zero!)\nSELECT LENGTH(NULL) AS null_len FROM dual;",
          "output": "NULL_LEN\n--------\n  <NULL>"
        }
      ],
      "3": [
        {
          "sql": "-- Standard: SUBSTR(str, start_pos, length) with 1-based indexing\nSELECT SUBSTR('Database', 1, 4) AS extract_val FROM dual;",
          "output": "EXTRACT_VAL\n-----------\nData"
        },
        {
          "sql": "-- Feature: Omitted length parameter extracts from start position through the end\nSELECT SUBSTR('Database', 5) AS tail_val FROM dual;",
          "output": "TAIL_VAL\n--------\nbase"
        },
        {
          "sql": "-- Feature: Negative start position counts backwards from the end of the string\nSELECT SUBSTR('Database', -3, 2) AS neg_extract FROM dual;\n-- Starts 3 from end ('a') and takes 2 characters",
          "output": "NEG_EXTRACT\n-----------\nas"
        },
        {
          "sql": "-- Oracle Edge Case: Start position 0 is treated as 1\nSELECT SUBSTR('Oracle', 0, 3) AS zero_start FROM dual;",
          "output": "ZERO_START\n----------\nOra"
        },
        {
          "sql": "-- Edge Case: Start position greater than string length returns NULL (no error)\nSELECT SUBSTR('Oracle', 10, 2) AS out_of_bounds FROM dual;",
          "output": "OUT_OF_BOUNDS\n-------------\n       <NULL>"
        }
      ],
      "4": [
        {
          "sql": "-- Standard: INSTR returns 1-based numeric position of first occurrence\nSELECT INSTR('Corporate Floor', 'or') AS first_pos FROM dual;",
          "output": "FIRST_POS\n---------\n        2"
        },
        {
          "sql": "-- Parameter: Occurrence parameter finds the N-th instance\nSELECT INSTR('Corporate Floor', 'or', 1, 2) AS second_pos FROM dual;",
          "output": "SECOND_POS\n----------\n         5"
        },
        {
          "sql": "-- Parameter: Custom start position controls where search begins\nSELECT INSTR('Corporate Floor', 'or', 3) AS from_pos_three FROM dual;",
          "output": "FROM_POS_THREE\n--------------\n             5"
        },
        {
          "sql": "-- Exam Trap: Substring not found returns 0 (not NULL, not an error!)\nSELECT INSTR('Oracle', 'xyz') AS missing_pos FROM dual;",
          "output": "MISSING_POS\n-----------\n          0"
        }
      ],
      "5": [
        {
          "sql": "-- Standard: LPAD and RPAD pad string up to total target length\nSELECT LPAD('123', 6, '0') AS left_padded,\n       RPAD('Oracle', 10, '*') AS right_padded\nFROM dual;",
          "output": "LEFT_PADDED  RIGHT_PADDED\n-----------  ------------\n000123       Oracle****  "
        },
        {
          "sql": "-- Exam Trap: When total length is shorter than original string, Oracle truncates without error\nSELECT LPAD('Deloitte', 4, '*') AS trunc_lpad,\n       RPAD('Deloitte', 4, '*') AS trunc_rpad\nFROM dual;",
          "output": "TRUNC_LPAD  TRUNC_RPAD\n----------  ----------\nDelo        Delo      "
        }
      ],
      "6": [
        {
          "sql": "-- Standard: Default TRIM removes leading and trailing spaces\nSELECT '[' || TRIM('   Stage Gate   ') || ']' AS clean_str FROM dual;",
          "output": "CLEAN_STR\n------------\n[Stage Gate]"
        },
        {
          "sql": "-- Feature: Targeted trim removes specified character from LEADING, TRAILING, or BOTH\nSELECT TRIM(LEADING '0' FROM '00045') AS no_lead_zero,\n       TRIM(BOTH '*' FROM '***Exam***') AS no_stars\nFROM dual;",
          "output": "NO_LEAD_ZERO  NO_STARS\n------------  --------\n45            Exam    "
        },
        {
          "sql": "-- Exam Trap: TRIM strictly accepts only ONE single character; multi-character raises error\nSELECT TRIM('12' FROM '1212Apple12') FROM dual;\n-- Error: trim set should have only one character",
          "output": "Error: trim set should have only one character\nCause: The trim character argument must be a single character literal. (Use REPLACE for multi-character)."
        }
      ],
      "7": [
        {
          "sql": "-- Standard: REPLACE substitutes all occurrences of search pattern\nSELECT REPLACE('Stage Gate Exam', ' ', '_') AS underscore_str FROM dual;",
          "output": "UNDERSCORE_STR\n---------------\nStage_Gate_Exam"
        },
        {
          "sql": "-- Feature: Omitting replacement string deletes all occurrences of search pattern\nSELECT REPLACE('2024-Q1-REPORT-FINAL', '-') AS stripped_str FROM dual;",
          "output": "STRIPPED_STR\n------------------\n2024Q1REPORTFINAL"
        },
        {
          "sql": "-- Multi-Character: Replaces multi-character words throughout the string\nSELECT REPLACE('Red Car, Red House, Red Light', 'Red', 'Blue') AS swapped_str FROM dual;",
          "output": "SWAPPED_STR\n--------------------------------\nBlue Car, Blue House, Blue Light"
        }
      ]
    }
  },
  {
    "id": "numeric_functions",
    "title": "5. Numeric Functions",
    "folder": "numeric_functions",
    "content": "# Numeric Functions - Notes\n\n## 1. Rounding Numbers (ROUND)\n- **Syntax**: `ROUND(number [, decimal_places])`\n- Uses standard mathematical rounding (>= 5 rounds up, < 5 rounds down).\n- `decimal_places = 0` (or omitted): Rounds to the nearest whole integer (e.g., `ROUND(45.6)` → `46`).\n- `decimal_places > 0`: Rounds to decimal places to the right (e.g., `ROUND(45.926, 2)` → `45.93`).\n- `decimal_places < 0`: Rounds left of the decimal point to whole place values:\n  - `-1` = nearest 10 (e.g., `ROUND(67, -1)` → `70`).\n  - `-2` = nearest 100 (e.g., `ROUND(768.45, -2)` → `800`).\n\n## 2. Truncating Numbers (TRUNC)\n- **Syntax**: `TRUNC(number [, decimal_places])`\n- Chops off digits without any rounding.\n- `decimal_places = 0` (or omitted): Discards all decimal values (e.g., `TRUNC(45.9)` → `45`).\n- `decimal_places > 0`: Cuts off digits right of the specified position (e.g., `TRUNC(45.926, 2)` → `45.92`).\n- `decimal_places < 0`: Replaces whole number places with zeros without rounding up (e.g., `TRUNC(159.85, -1)` → `150`).\n\n## 3. Modulo Function (MOD)\n- **Syntax**: `MOD(m, n)`\n- Returns the remainder of `m` divided by `n`.\n- **Sign of Result**: In Oracle, `MOD(m, n)` takes the mathematical sign of the first parameter `m` (dividend) (e.g., `MOD(-11, 4)` → `-3`, `MOD(11, -4)` → `3`).\n- **Even/Odd Filter Pattern**:\n  - Even: `MOD(column, 2) = 0`\n  - Odd: `MOD(column, 2) = 1`\n- Example: `SELECT transaction_id FROM transactions WHERE MOD(transaction_id, 2) = 1;`\n\n## 4. Integer Boundaries (CEIL & FLOOR)\n- **CEIL(n)**: Rounds UP to the nearest integer greater than or equal to `n` (e.g., `CEIL(4.2)` → `5`).\n  - With negative numbers: `CEIL(-7.2)` → `-7` (pushes towards zero/positive).\n- **FLOOR(n)**: Rounds DOWN to the nearest integer less than or equal to `n` (e.g., `FLOOR(7.9)` → `7`).\n  - With negative numbers: `FLOOR(-7.2)` → `-8` (pushes towards more negative).\n- Example: `SELECT CEIL(-7.2), FLOOR(7.9) FROM DUAL;` returns `-7` and `7`.\n",
    "examples": {
      "1": [
        {
          "sql": "-- Standard: Positive decimal places round to specified precision (>= 5 rounds up)\nSELECT ROUND(45.923, 2) AS r_down,\n       ROUND(45.926, 2) AS r_up\nFROM dual;",
          "output": "    R_DOWN      R_UP\n----------  --------\n     45.92     45.93"
        },
        {
          "sql": "-- Standard: 0 or omitted decimal places rounds to nearest whole integer\nSELECT ROUND(45.4) AS r_int_down,\n       ROUND(45.5) AS r_int_up\nFROM dual;",
          "output": "R_INT_DOWN  R_INT_UP\n----------  --------\n        45        46"
        },
        {
          "sql": "-- Feature: Negative places round left of decimal to tens (-1) or hundreds (-2)\nSELECT ROUND(67, -1) AS near_ten,\n       ROUND(768.45, -2) AS near_hundred\nFROM dual;",
          "output": "  NEAR_TEN  NEAR_HUNDRED\n----------  ------------\n        70           800"
        }
      ],
      "2": [
        {
          "sql": "-- Standard: Positive decimal places chop off digits without rounding\nSELECT TRUNC(45.923, 2) AS t_down,\n       TRUNC(45.929, 2) AS t_still_down\nFROM dual;",
          "output": "    T_DOWN  T_STILL_DOWN\n----------  ------------\n     45.92         45.92"
        },
        {
          "sql": "-- Standard: 0 or omitted decimal places discards all decimal portions\nSELECT TRUNC(45.99) AS t_int FROM dual;",
          "output": "     T_INT\n----------\n        45"
        },
        {
          "sql": "-- Feature: Negative places replace whole place values with zero without rounding up\nSELECT TRUNC(159.85, -1) AS trunc_ten,\n       TRUNC(768.45, -2) AS trunc_hundred\nFROM dual;",
          "output": " TRUNC_TEN  TRUNC_HUNDRED\n----------  -------------\n       150            700"
        }
      ],
      "3": [
        {
          "sql": "-- Standard: MOD(m, n) returns remainder; common for even/odd testing\nSELECT MOD(11, 4) AS remainder,\n       MOD(10, 2) AS even_check,\n       MOD(11, 2) AS odd_check\nFROM dual;",
          "output": " REMAINDER  EVEN_CHECK  ODD_CHECK\n----------  ----------  ---------\n         3           0          1"
        },
        {
          "sql": "-- Exam Trap: In Oracle, MOD(m, n) takes the mathematical sign of the dividend (m)\nSELECT MOD(-11, 4) AS neg_dividend,\n       MOD(11, -4) AS neg_divisor\nFROM dual;",
          "output": "NEG_DIVIDEND  NEG_DIVISOR\n------------  -----------\n          -3            3"
        }
      ],
      "4": [
        {
          "sql": "-- Standard: CEIL rounds up to next integer; FLOOR rounds down to previous integer\nSELECT CEIL(4.2) AS ceil_pos,\n       FLOOR(7.9) AS floor_pos\nFROM dual;",
          "output": "  CEIL_POS  FLOOR_POS\n----------  ---------\n         5          7"
        },
        {
          "sql": "-- Exam Trap: Negative numbers (CEIL pushes toward zero; FLOOR pushes toward negative infinity)\nSELECT CEIL(-7.2) AS ceil_neg,\n       FLOOR(-7.2) AS floor_neg\nFROM dual;",
          "output": "  CEIL_NEG  FLOOR_NEG\n----------  ---------\n        -7         -8"
        }
      ]
    }
  },
  {
    "id": "date_functions",
    "title": "6. Date Functions",
    "folder": "date_functions",
    "content": "# Date Functions - Notes\n\n## 1. Date Arithmetic\n- Oracle `DATE` datatype internally stores century, year, month, day, hours, minutes, and seconds.\n- The unit `1` represents **1 whole day** (24 hours).\n- `date + n`: Adds `n` days to the date (returns a Date).\n- `date - n`: Subtracts `n` days from the date (returns a Date).\n- `date1 - date2`: Calculates difference between dates (returns **number of days** as a numeric value).\n  - **Sign Rule**: Put the later date first (`later_date - earlier_date` is positive; `earlier_date - later_date` is negative).\n  - **Converting Difference to Hours/Minutes**: Because `date1 - date2` returns **days**, multiply to convert into smaller units: `(later_date - earlier_date) * 24` gives **hours**, and `(later_date - earlier_date) * (24*60)` gives **minutes**.\n- Adding/subtracting fractional time on a date: 1 hour = `1/24`, 1 minute = `1/(24*60)` (e.g., `created_at + 6/24` adds 6 hours).\n- Example: `SELECT SYSDATE - hire_date AS \"TOTAL DAYS\" FROM employees;`\n\n## 2. Calculating Months (MONTHS_BETWEEN)\n- **Syntax**: `MONTHS_BETWEEN(date1, date2)`\n- Returns the number of months between two dates.\n- **Sign Rule**:\n  - Positive if `date1` is later than `date2`.\n  - Negative if `date1` is earlier than `date2`.\n- Returns an exact whole integer if both dates share the same day of the month or are both month-end dates; otherwise returns a decimal.\n- Example: `SELECT MONTHS_BETWEEN('01-JAN-2024', '01-JUL-2024') FROM DUAL;` returns `-6`.\n\n## 3. Adding / Subtracting Months (ADD_MONTHS)\n- **Syntax**: `ADD_MONTHS(start_date, n)`\n- Moves a date forward (if `n > 0`) or backward (if `n < 0`) by `n` calendar months.\n- **Month-End Rules**:\n  - If `start_date` is on the last day of the month, the result is automatically the last day of the target month (e.g., `ADD_MONTHS('28-FEB-2023', 1)` → `'31-MAR-2023'`).\n  - If the target month has fewer days than the starting day, it adjusts to that month's final day (e.g., `ADD_MONTHS('31-AUG-2024', 1)` → `'30-SEP-2024'`).\n\n## 4. Key Date Finders (NEXT_DAY & LAST_DAY)\n- **NEXT_DAY(date, 'day_of_week')**: Returns the date of the next specified weekday after the given date (e.g., `'FRIDAY'`, or number `1-7` where 1 = Sunday).\n- **LAST_DAY(date)**: Returns the date of the last day of the month containing `date` (handles leap years automatically).\n- Remaining days in current month formula: `LAST_DAY(SYSDATE) - SYSDATE`.\n- Example: `SELECT LAST_DAY('05-FEB-2023') FROM DUAL;` returns `'28-FEB-2023'`.\n\n## 5. Date Rounding & Truncation (ROUND & TRUNC)\n- Applied to dates using format models such as `'MONTH'` or `'YEAR'`.\n- **Default to Day**: `ROUND(date)` without format model rounds to nearest day (cutoff is 12:00 PM / noon).\n- **With `'MONTH'`**:\n  - `ROUND`: Days 1-15 round down to 1st of current month; days 16-31 round up to 1st of next month.\n  - `TRUNC`: Always chops down to the 1st of the current month.\n- **With `'YEAR'`**:\n  - `ROUND`: Jan-Jun rounds down to 01-JAN current year; Jul-Dec rounds up to 01-JAN next year.\n  - `TRUNC`: Always chops down to 01-JAN of current year.\n- Example:\n  - `ROUND('25-OCT-2024', 'MONTH')` → `'01-NOV-2024'`\n  - `TRUNC('25-OCT-2024', 'MONTH')` → `'01-OCT-2024'`\n",
    "examples": {
      "1": [
        {
          "sql": "-- Standard: Date arithmetic operates in units of whole days (24 hours)\nSELECT TO_DATE('15-NOV-2026') + 7 AS plus_seven_days,\n       TO_DATE('15-NOV-2026') - 10 AS minus_ten_days\nFROM dual;",
          "output": "PLUS_SEVEN_DAYS  MINUS_TEN_DAYS\n---------------  --------------\n22-NOV-26        05-NOV-26     "
        },
        {
          "sql": "-- Standard: Date minus Date returns total number of days (later - earlier = positive; earlier - later = negative)\nSELECT TO_DATE('25-DEC-2026') - TO_DATE('15-NOV-2026') AS day_diff,\n       TO_DATE('15-NOV-2026') - TO_DATE('25-DEC-2026') AS neg_diff\nFROM dual;",
          "output": "  DAY_DIFF    NEG_DIFF\n----------  ----------\n        40         -40"
        },
        {
          "sql": "-- Converting Date Difference to Hours/Minutes: Multiply days by 24 (hours) or 24*60 (minutes)\nSELECT (TO_DATE('15-NOV-2026 13:30', 'DD-MON-YYYY HH24:MI') - TO_DATE('15-NOV-2026 10:00', 'DD-MON-YYYY HH24:MI')) * 24 AS hrs_diff,\n       (TO_DATE('15-NOV-2026 10:45', 'DD-MON-YYYY HH24:MI') - TO_DATE('15-NOV-2026 10:00', 'DD-MON-YYYY HH24:MI')) * (24*60) AS mins_diff\nFROM dual;",
          "output": "  HRS_DIFF   MINS_DIFF\n----------  ----------\n       3.5          45"
        },
        {
          "sql": "-- Feature: Adding fractional time to a date (1 hour = 1/24; 1 minute = 1/(24*60))\nSELECT TO_CHAR(TO_DATE('15-NOV-2026 10:00', 'DD-MON-YYYY HH24:MI') + (4/24), 'DD-MON-YYYY HH24:MI') AS plus_4_hrs,\n       TO_CHAR(TO_DATE('15-NOV-2026 10:00', 'DD-MON-YYYY HH24:MI') + (30/(24*60)), 'DD-MON-YYYY HH24:MI') AS plus_30_mins\nFROM dual;",
          "output": "PLUS_4_HRS         PLUS_30_MINS    \n-----------------  ----------------\n15-NOV-2026 14:00  15-NOV-2026 10:30"
        }
      ],
      "2": [
        {
          "sql": "-- Standard: MONTHS_BETWEEN(dt1, dt2) returns exact integer if both dates have same day of month\nSELECT MONTHS_BETWEEN(TO_DATE('01-JUL-2026'), TO_DATE('01-JAN-2026')) AS mths_pos FROM dual;",
          "output": "  MTHS_POS\n----------\n         6"
        },
        {
          "sql": "-- Rule: Sign rule: Positive if dt1 > dt2; Negative if dt1 < dt2\nSELECT MONTHS_BETWEEN(TO_DATE('01-JAN-2026'), TO_DATE('01-JUL-2026')) AS mths_neg FROM dual;",
          "output": "  MTHS_NEG\n----------\n        -6"
        },
        {
          "sql": "-- Exam Trap: Month-end rule: If BOTH dates are month-end dates, Oracle yields an exact whole integer\nSELECT MONTHS_BETWEEN(TO_DATE('31-MAR-2023'), TO_DATE('28-FEB-2023')) AS mths_month_end FROM dual;",
          "output": "MTHS_MONTH_END\n--------------\n             1"
        },
        {
          "sql": "-- Fractional: If day numbers differ and are not month-ends, Oracle calculates fraction based on a 31-day month\nSELECT ROUND(MONTHS_BETWEEN(TO_DATE('15-FEB-2026'), TO_DATE('01-JAN-2026')), 4) AS mths_frac FROM dual;\n-- Calculation: 1 month + (14 days / 31) = 1.4516",
          "output": " MTHS_FRAC\n----------\n    1.4516"
        }
      ],
      "3": [
        {
          "sql": "-- Standard: ADD_MONTHS moves date forward (>0) or backward (<0) by calendar months\nSELECT ADD_MONTHS(TO_DATE('15-JAN-2026'), 3) AS fwd_3_mths,\n       ADD_MONTHS(TO_DATE('15-JAN-2026'), -2) AS back_2_mths\nFROM dual;",
          "output": "FWD_3_MTHS  BACK_2_MTHS\n----------  -----------\n15-APR-26   15-NOV-25  "
        },
        {
          "sql": "-- Exam Trap: If starting date is the last day of the month, result is strictly the last day of target month\nSELECT ADD_MONTHS(TO_DATE('28-FEB-2023'), 1) AS eom_target FROM dual;",
          "output": "EOM_TARGET\n----------\n31-MAR-23 "
        },
        {
          "sql": "-- Rule: If target month has fewer days than starting day, Oracle adjusts to target month's final day\nSELECT ADD_MONTHS(TO_DATE('31-AUG-2026'), 1) AS adjusted_sept FROM dual;",
          "output": "ADJUSTED_SEPT\n-------------\n30-SEP-26    "
        }
      ],
      "4": [
        {
          "sql": "-- Standard: NEXT_DAY returns next specified weekday (accepts day name or day number 1-7 where 1=Sunday)\nSELECT NEXT_DAY(TO_DATE('13-NOV-2026'), 'FRIDAY') AS next_fri_named,\n       NEXT_DAY(TO_DATE('13-NOV-2026'), 6) AS next_fri_num\nFROM dual;",
          "output": "NEXT_FRI_NAMED  NEXT_FRI_NUM\n--------------  ------------\n20-NOV-26       20-NOV-26   "
        },
        {
          "sql": "-- Standard: LAST_DAY returns the final date of the month (automatically handles leap years)\nSELECT LAST_DAY(TO_DATE('15-FEB-2024')) AS leap_feb,\n       LAST_DAY(TO_DATE('15-FEB-2023')) AS normal_feb\nFROM dual;",
          "output": "LEAP_FEB   NORMAL_FEB\n---------  ----------\n29-FEB-24  28-FEB-23 "
        },
        {
          "sql": "-- Practical Formula: Calculating remaining days in the month\nSELECT LAST_DAY(TO_DATE('13-NOV-2026')) - TO_DATE('13-NOV-2026') AS days_left FROM dual;",
          "output": " DAYS_LEFT\n----------\n        17"
        }
      ],
      "5": [
        {
          "sql": "-- Standard: TRUNC rolls date back to the start of the specified period (01 of month or 01-JAN of year)\nSELECT TRUNC(TO_DATE('25-DEC-2026'), 'MONTH') AS trunc_mth,\n       TRUNC(TO_DATE('25-DEC-2026'), 'YEAR') AS trunc_yr\nFROM dual;",
          "output": "TRUNC_MTH  TRUNC_YR \n---------  ---------\n01-DEC-26  01-JAN-26"
        },
        {
          "sql": "-- Exam Trap: ROUND to 'MONTH': Days 1-15 round DOWN to 1st of month; Days 16+ round UP to 1st of next month\nSELECT ROUND(TO_DATE('15-SEP-2026'), 'MONTH') AS r_mth_down,\n       ROUND(TO_DATE('16-SEP-2026'), 'MONTH') AS r_mth_up\nFROM dual;",
          "output": "R_MTH_DOWN  R_MTH_UP \n----------  ---------\n01-SEP-26   01-OCT-26"
        },
        {
          "sql": "-- Exam Trap: ROUND to 'YEAR': Months 1-6 round DOWN to 01-JAN; Months 7-12 round UP to next 01-JAN\nSELECT ROUND(TO_DATE('15-JUN-2026'), 'YEAR') AS r_yr_down,\n       ROUND(TO_DATE('01-JUL-2026'), 'YEAR') AS r_yr_up\nFROM dual;",
          "output": "R_YR_DOWN  R_YR_UP  \n---------  ---------\n01-JAN-26  01-JAN-27"
        },
        {
          "sql": "-- Feature: Default ROUND without format model rounds to nearest day based on 12:00 PM (noon) cutoff\nSELECT ROUND(TO_DATE('15-NOV-2026 11:59', 'DD-MON-YYYY HH24:MI')) AS r_morn,\n       ROUND(TO_DATE('15-NOV-2026 12:01', 'DD-MON-YYYY HH24:MI')) AS r_aft\nFROM dual;",
          "output": "R_MORN     R_AFT    \n---------  ---------\n15-NOV-26  16-NOV-26"
        }
      ]
    }
  },
  {
    "id": "conversion_functions",
    "title": "7. Conversion Functions",
    "folder": "conversion_functions",
    "content": "# Conversion Functions - Notes\n\n## 1. Implicit vs. Explicit Conversion\n- **Implicit Conversion**: Oracle automatically converts types behind the scenes. Avoid because it can degrade performance (disables indexes) and break across different server NLS settings.\n- **Explicit Conversion**: Controlled, reliable conversion using Oracle functions.\n- **Destination Principle**: The function name tells you the *resulting* data type:\n  - `TO_CHAR(value, [format])`: Converts Date or Number → Character string (text formatting).\n  - `TO_DATE(string, [format])`: Converts Character string → Date.\n  - `TO_NUMBER(string, [format])`: Converts Character string → Number.\n\n## 2. Date Formatting (TO_CHAR with Dates)\n- **Syntax**: `TO_CHAR(date, 'format_model')`\n- Converts a Date to a formatted character string.\n- Format Elements:\n  - Year: `YYYY` (4-digit), `YY` (2-digit).\n  - Month: `MM` (2-digit number), `MON` (3-letter name), `MONTH` (full name).\n  - Day: `DD` (day of month), `DY` (3-letter day), `DAY` (full weekday name).\n  - Time: `HH24` (24-hour), `MI` (Minutes - not MM!), `SS` (Seconds).\n  - Suffix Modifiers (appended to date numbers):\n    - `th` / `TH`: Appends ordinal suffix (e.g., `DDth` → `15th`, `DDTH` → `15TH`).\n    - `sp` / `SP`: Spells out the number (e.g., `DDsp` → `FIFTEEN`).\n    - `spth` / `thsp`: Spells out ordinal number (e.g., `DDspth` → `FIFTEENTH`).\n- Punctuation (slashes `/`, dashes `-`, spaces) in the format model appears literally in the output.\n- **Case Sensitivity of Elements**: The casing of format elements controls output capitalization (e.g., `'MONTH'` → `'JUNE'`, `'Month'` → `'June'`, `'month'` → `'june'`).\n- **Literal Text in Double Quotes**: Custom words or characters embedded inside format masks must be enclosed in double quotes `\"\"` (e.g., `'FMDDth \"of\" Month, YYYY'`).\n- **Fill Mode (FM) Modifier**: Prefix format models with `FM` to suppress padded trailing blanks in month/day names and leading zeros (e.g., `'FMMonth DD, YYYY'`).\n- Example: `SELECT TO_CHAR(hire_date, 'YYYY/MM/DD') FROM employees;`\n\n## 3. Number Formatting (TO_CHAR with Numbers)\n- **Syntax**: `TO_CHAR(number, 'format_model')`\n- Elements:\n  - `9`: Numeric position (suppresses leading zeros).\n  - `0`: Forces leading zero.\n  - `$`: Prefixes dollar sign.\n  - `L`: Prefixes local currency symbol.\n  - `,`: Comma separator.\n  - `.`: Decimal point.\n- **Overflow Trap (`###`)**: If format model has fewer integer digits than the number, Oracle outputs hash marks (e.g., `TO_CHAR(12345, '999')` → `####`).\n- Example: `SELECT TO_CHAR(8450, '$9,999') FROM DUAL;` returns `'$8,450'`.\n\n## 4. Converting Strings to Dates (TO_DATE & RR vs YY)\n- **Syntax**: `TO_DATE('date_string', 'format_model')`\n- Converts a text string into an internal Oracle `DATE` object.\n- **Client Display Note**: `TO_DATE` returns an internal binary date storing both date and time. However, clients display it using the session's default `NLS_DATE_FORMAT` (`DD-MON-RR`), hiding the time unless `TO_CHAR()` is explicitly used.\n- **YY vs RR Century Resolution**:\n  - `YY`: Strictly assumes the current century (`'95'` with `YY` → `2095`).\n  - `RR` (50-year sliding window): When queried in the current century (years 00-49):\n    - Year `00-49` → Current century (2000s).\n    - Year `50-99` → Previous century (1900s, e.g., `'85'` with `RR` → `1985`).\n- Example: `SELECT TO_DATE('20-OCT-85', 'DD-MON-RR') FROM DUAL;` returns `20-OCT-1985`.\n\n## 5. Converting Strings to Numbers (TO_NUMBER)\n- **Syntax**: `TO_NUMBER('string' [, 'format_model'])`\n- Converts a formatted text string into a true database Number.\n- If the text has currency signs, commas, or spaces, a matching format model must be supplied.\n- Missing or mismatched format on formatted text raises: `invalid number`.\n- Example: `SELECT TO_NUMBER('$2,500', '$9,999') FROM DUAL;` returns `2500`.\n\n## 6. General Functions (COALESCE)\n- **Syntax**: `COALESCE(expr1, expr2, ... expr_n)`\n- Evaluates expressions from left to right and returns the first non-null expression.\n- Short-circuits: stops evaluation as soon as the first non-null value is encountered.\n- Returns NULL only if all expressions in the list evaluate to NULL.\n- All expressions must have compatible data types; datatype mismatch raises: `inconsistent datatypes`.\n- Example: `SELECT COALESCE(NULL, NULL, 50, 100) FROM DUAL;` returns `50`.\n\n## 7. General Functions (NULLIF)\n- **Syntax**: `NULLIF(expr1, expr2)`\n- Compares two expressions:\n  - If `expr1 = expr2`, returns `NULL`.\n  - If `expr1 != expr2`, returns `expr1`.\n- **Division by Zero Protection**: `total_sales / NULLIF(total_units, 0)` safely turns 0 into NULL to avoid the error: `divisor is equal to zero`.\n- Example: `SELECT NULLIF(100, 100)` → `NULL`; `SELECT NULLIF('Apple', 'Orange')` → `'Apple'`.\n\n## 8. Conditional Logic (CASE Expressions)\n- **Syntax**:\n  ```sql\n  CASE \n      WHEN condition1 THEN result1\n      WHEN condition2 THEN result2\n      ELSE default_result\n  END\n  ```\n- Evaluates conditions from top to bottom; returns result for first `TRUE` condition.\n- If no conditions match and `ELSE` is omitted, returns `NULL`.\n- Strictly requires the `END` keyword to close the block.\n- **Datatype Consistency**: All return expressions in `THEN` and `ELSE` branches must have compatible data types. Returning mismatched datatypes (e.g., Number in THEN and Text in ELSE) raises: `inconsistent datatypes: expected NUMBER got CHAR`.\n- **Searched vs. Simple CASE**:\n  - **Searched CASE**: Evaluates boolean conditions with relational operators (`CASE WHEN salary >= 10000 THEN ...`).\n  - **Simple CASE**: Matches an expression against discrete values (`CASE dept_id WHEN 10 THEN 'Admin' ...`).\n- Example: `CASE WHEN score >= 50 THEN 'Pass' ELSE 'Fail' END AS result_status`.\n\n## 9. Oracle Proprietary DECODE\n- **Syntax**: `DECODE(column, search1, result1 [, search2, result2, ... , default])`\n- Compact Oracle-specific conditional function operating like a switch statement.\n- Returns `default` if no search matches (or `NULL` if default is omitted).\n- **DECODE vs CASE Distinction**:\n  - `DECODE` strictly checks for **equality (`=`)** only; it cannot handle relational operators or ranges (`<`, `>`, `BETWEEN`).\n  - For ranges, you **must use `CASE`**.\n  - `DECODE` evaluates two `NULL` values as equal (`DECODE(col, NULL, 'None')` works).\n- Example: `SELECT DECODE(dept_id, 10, 'Admin', 20, 'Sales', 'Other') FROM employees;`\n",
    "examples": {
      "1": [
        {
          "sql": "-- Best Practice: Explicit conversion functions (TO_CHAR, TO_DATE, TO_NUMBER)\nSELECT TO_CHAR(salary) AS sal_char,\n       TO_NUMBER('4500') AS bonus_num,\n       TO_DATE('2026-01-01', 'YYYY-MM-DD') AS start_dt\nFROM employees\nWHERE employee_id = 100;",
          "output": "SAL_CHAR   BONUS_NUM  START_DT \n---------  ---------  ---------\n24000           4500  01-JAN-26"
        },
        {
          "sql": "-- Exam Trap: Implicit conversion risks: Comparing number with string relies on silent type coercion\nSELECT employee_id, first_name\nFROM employees\nWHERE department_id = '10';  -- Oracle implicitly coerces '10' to 10",
          "output": "EMPLOYEE_ID  FIRST_NAME\n-----------  ----------\n        200  Jennifer  \nNote: Best practice is explicit datatype matching to avoid index suppression and subtle conversion bugs."
        }
      ],
      "2": [
        {
          "sql": "-- Standard: Formatting dates into readable strings with YYYY, MM, DD, and HH24:MI:SS\nSELECT TO_CHAR(hire_date, 'YYYY-MM-DD') AS iso_dt,\n       TO_CHAR(hire_date, 'HH24:MI:SS') AS hire_time\nFROM employees\nWHERE employee_id = 100;",
          "output": "ISO_DT      HIRE_TIME\n----------  ---------\n2003-06-17  00:00:00 "
        },
        {
          "sql": "-- Feature: Case sensitivity of format models (Month preserves capitalized case; MONTH is uppercase)\nSELECT TO_CHAR(hire_date, 'Month DD, YYYY') AS title_fmt,\n       TO_CHAR(hire_date, 'MONTH DD, YYYY') AS upper_fmt\nFROM employees\nWHERE employee_id = 100;",
          "output": "TITLE_FMT           UPPER_FMT          \n------------------  -------------------\nJune      17, 2003  JUNE      17, 2003 "
        },
        {
          "sql": "-- Feature: FM (Fill Mode) modifier suppresses padded blanks and leading zeros\nSELECT TO_CHAR(hire_date, 'Month DD, YYYY') AS padded_fmt,\n       TO_CHAR(hire_date, 'FMMonth DD, YYYY') AS stripped_fmt\nFROM employees\nWHERE employee_id = 100;",
          "output": "PADDED_FMT          STRIPPED_FMT \n------------------  -------------\nJune      17, 2003  June 17, 2003"
        },
        {
          "sql": "-- Syntax Rule: Embedding literal text in date format model requires double quotes (\"...\")\nSELECT TO_CHAR(hire_date, 'FMDDth \"of\" Month, YYYY') AS prose_dt\nFROM employees\nWHERE employee_id = 100;",
          "output": "PROSE_DT             \n---------------------\n17th of June, 2003   "
        }
      ],
      "3": [
        {
          "sql": "-- Standard: Number formatting with commas (,), decimals (.), and currency ($)\nSELECT salary,\n       TO_CHAR(salary, '$999,999.00') AS formatted_sal\nFROM employees\nWHERE employee_id = 100;",
          "output": "    SALARY  FORMATTED_SAL\n----------  -------------\n     24000     $24,000.00"
        },
        {
          "sql": "-- Feature: 0 forces leading zeros; 9 suppresses leading zeros\nSELECT TO_CHAR(45, '0099') AS forced_zeros,\n       TO_CHAR(45, '9999') AS no_lead_zeros\nFROM dual;",
          "output": "FORCED_ZEROS  NO_LEAD_ZEROS\n------------  -------------\n 0045            45        "
        },
        {
          "sql": "-- Exam Trap: If integer digits exceed the format mask, Oracle outputs hash marks (###)\nSELECT TO_CHAR(12345, '999') AS overflow_val FROM dual;",
          "output": "OVERFLOW_VAL\n------------\n####        \nCause: The format model '999' only accommodates up to 3 integer digits, but the number has 5 digits."
        }
      ],
      "4": [
        {
          "sql": "-- Standard & Display Note: TO_DATE stores time internally, but client displays default DD-MON-RR unless formatted\nSELECT TO_DATE('2026-10-25 14:30', 'YYYY-MM-DD HH24:MI') AS default_nls_display,\n       TO_CHAR(TO_DATE('2026-10-25 14:30', 'YYYY-MM-DD HH24:MI'), 'YYYY-MM-DD HH24:MI') AS full_display\nFROM dual;",
          "output": "DEFAULT_NLS_DISPLAY  FULL_DISPLAY    \n-------------------  ----------------\n25-OCT-26            2026-10-25 14:30"
        },
        {
          "sql": "-- Exam Trap: YY format strictly assumes the current century ('95' with YY -> 2095!)\nSELECT TO_CHAR(TO_DATE('95', 'YY'), 'YYYY') AS yr_yy FROM dual;",
          "output": "YR_YY\n-----\n2095 "
        },
        {
          "sql": "-- RR 50-Year Sliding Window: 50-99 resolves to previous century (1995); 00-49 resolves to current century (2015)\nSELECT TO_CHAR(TO_DATE('95', 'RR'), 'YYYY') AS past_century,\n       TO_CHAR(TO_DATE('15', 'RR'), 'YYYY') AS current_century\nFROM dual;",
          "output": "PAST_CENTURY  CURRENT_CENTURY\n------------  ---------------\n1995          2015           "
        }
      ],
      "5": [
        {
          "sql": "-- Standard: TO_NUMBER converts clean numeric strings to database numbers\nSELECT TO_NUMBER('12345') + 500 AS calc_num FROM dual;",
          "output": "  CALC_NUM\n----------\n     12845"
        },
        {
          "sql": "-- Feature: Formatted strings with currency or commas require matching format mask\nSELECT TO_NUMBER('$2,500.75', '$9,999.99') AS parsed_amount FROM dual;",
          "output": "PARSED_AMOUNT\n-------------\n      2500.75"
        },
        {
          "sql": "-- Exam Trap: Omitting format mask on formatted strings raises error\nSELECT TO_NUMBER('$2,500') FROM dual;\n-- Error: invalid number",
          "output": "Error: invalid number\nCause: The string contains currency and comma characters without a matching format model."
        }
      ],
      "6": [
        {
          "sql": "-- Standard: COALESCE returns the first non-null expression from left to right\nSELECT employee_id,\n       COALESCE(commission_pct, 0) AS safe_comm\nFROM employees\nWHERE employee_id IN (100, 145);",
          "output": "EMPLOYEE_ID  SAFE_COMM\n-----------  ---------\n        100          0\n        145         .4"
        },
        {
          "sql": "-- Feature: Multi-tier fallback short-circuits on the first non-null value\nSELECT COALESCE(NULL, NULL, 50, 100) AS first_val FROM dual;",
          "output": " FIRST_VAL\n----------\n        50"
        },
        {
          "sql": "-- Feature: If all expressions evaluate to NULL, COALESCE returns NULL\nSELECT COALESCE(NULL, NULL, NULL) AS all_null FROM dual;",
          "output": "ALL_NULL\n--------\n  <NULL>"
        },
        {
          "sql": "-- Exam Trap: All arguments in COALESCE must share compatible datatypes\nSELECT COALESCE(salary, 'None') FROM employees;\n-- Error: inconsistent datatypes: expected NUMBER got CHAR",
          "output": "Error: inconsistent datatypes: expected NUMBER got CHAR\nCause: salary is a NUMBER but 'None' is a VARCHAR2."
        }
      ],
      "7": [
        {
          "sql": "-- Standard: NULLIF(a, b) returns NULL if a = b; returns a if a != b\nSELECT NULLIF(100, 100) AS match_res,\n       NULLIF('Apple', 'Orange') AS diff_res\nFROM dual;",
          "output": "MATCH_RES  DIFF_RES\n---------  --------\n   <NULL>  Apple   "
        },
        {
          "sql": "-- Practical Pattern: Protecting against Error division-by-zero errors\nSELECT 5000 / NULLIF(0, 0) AS safe_division FROM dual;",
          "output": "SAFE_DIVISION\n-------------\n       <NULL>\nNote: NULLIF(0, 0) yields NULL; any number divided by NULL safely evaluates to NULL instead of throwing an error."
        }
      ],
      "8": [
        {
          "sql": "-- Standard: Searched CASE evaluates conditions from top to bottom; returns first match\nSELECT first_name, salary,\n       CASE \n         WHEN salary >= 20000 THEN 'Executive Tier'\n         WHEN salary >= 10000 THEN 'Senior Tier'\n         ELSE 'Standard Tier'\n       END AS salary_grade\nFROM employees\nWHERE department_id = 90;",
          "output": "FIRST_NAME  SALARY  SALARY_GRADE  \n----------  ------  --------------\nSteven       24000  Executive Tier\nNeena        17000  Senior Tier   \nLex          17000  Senior Tier   "
        },
        {
          "sql": "-- Standard: Simple CASE matches an expression against discrete values\nSELECT department_id,\n       CASE department_id\n         WHEN 10 THEN 'Administration'\n         WHEN 20 THEN 'Marketing'\n         ELSE 'Other Department'\n       END AS dept_name\nFROM departments\nWHERE department_id IN (10, 20, 50);",
          "output": "DEPARTMENT_ID  DEPT_NAME       \n-------------  ----------------\n           10  Administration  \n           20  Marketing       \n           50  Other Department"
        },
        {
          "sql": "-- Feature: If no conditions match and ELSE is omitted, CASE returns NULL\nSELECT CASE WHEN 1 = 2 THEN 'Match' END AS no_else FROM dual;",
          "output": "NO_ELSE\n-------\n <NULL>"
        },
        {
          "sql": "-- Exam Trap: All return values (THEN/ELSE) must share compatible datatypes\nSELECT CASE WHEN salary > 10000 THEN salary ELSE 'Low' END FROM employees;\n-- Error: inconsistent datatypes: expected NUMBER got CHAR",
          "output": "Error: inconsistent datatypes: expected NUMBER got CHAR\nCause: The THEN branch returns NUMBER, but the ELSE branch returns CHAR."
        }
      ],
      "9": [
        {
          "sql": "-- Standard: Oracle DECODE functions like a switch statement (col, search1, result1, ..., default)\nSELECT department_id,\n       DECODE(department_id,\n              10, 'Administration',\n              20, 'Marketing',\n              'Other') AS dept_label\nFROM departments\nWHERE department_id IN (10, 20, 50);",
          "output": "DEPARTMENT_ID  DEPT_LABEL    \n-------------  --------------\n           10  Administration\n           20  Marketing     \n           50  Other         "
        },
        {
          "sql": "-- Oracle Feature: DECODE treats two NULL values as equal (unlike standard = operator)\nSELECT employee_id,\n       DECODE(commission_pct, NULL, 'No Commission', 'Has Commission') AS comm_status\nFROM employees\nWHERE employee_id IN (100, 145);",
          "output": "EMPLOYEE_ID  COMM_STATUS   \n-----------  --------------\n        100  No Commission \n        145  Has Commission"
        },
        {
          "sql": "-- Exam Trap: DECODE only supports equality; relational (<, >) comparisons are invalid syntax\n-- Must use CASE expression when evaluating ranges or inequalities\nSELECT first_name,\n       CASE WHEN salary > 15000 THEN 'High' ELSE 'Normal' END AS sal_cat\nFROM employees\nWHERE employee_id = 100;",
          "output": "FIRST_NAME  SAL_CAT\n----------  -------\nSteven      High   "
        }
      ]
    }
  },
  {
    "id": "group_functions",
    "title": "8. Group Functions & Aggregations",
    "folder": "group_functions",
    "content": "# Group Functions - Notes\n\n## 1. Standard Group Functions\n- Group (aggregate) functions operate on sets of rows to return one single summary result per group.\n- **AVG(col)**: Calculates the average (numbers only).\n- **SUM(col)**: Calculates the total sum (numbers only).\n- **MIN(col)**: Returns the smallest/minimum value across numbers (lowest number), characters (alphabetically first, `A → Z`), and dates (oldest/earliest date).\n- **MAX(col)**: Returns the largest/maximum value across numbers (highest number), characters (alphabetically last, `Z → A`), and dates (newest/latest date).\n- **COUNT(col) / COUNT(*)**: `COUNT(col)` counts all non-`NULL` values (including duplicates); `COUNT(*)` counts every row (including `NULL`s and duplicates).\n- Example: `SELECT MAX(salary), MAX(hire_date) FROM employees;`\n\n## 2. Group Functions & NULL Handling\n- Group functions automatically **ignore NULL values** (except `COUNT(*)`).\n- `COUNT(*)`: Counts every row in the table, including rows with NULLs and duplicates.\n- `COUNT(col)`: Counts only rows where `col` is NOT NULL.\n- `AVG(col)`: Divides the sum only by the count of non-null rows (`SUM(col) / COUNT(col)`).\n- To include NULLs as zeros in an average, wrap the column in `NVL`: `AVG(NVL(col, 0))`.\n- Example: For 10 rows with 3 NULL ratings, `COUNT(*)` returns `10`, and `COUNT(rating)` returns `7`.\n\n## 3. DISTINCT with Group Functions\n- **Syntax**: `COUNT(DISTINCT col)`, `AVG(DISTINCT col)`, `SUM(DISTINCT col)`\n- Forces the aggregate function to evaluate only unique values, ignoring duplicate values.\n- Example: `SELECT COUNT(DISTINCT customer_id) FROM orders;` counts the unique customers who placed orders.\n\n## 4. Grouping Data (GROUP BY)\n- **Syntax**: `SELECT col1, AVG(col2) FROM table_name GROUP BY col1;`\n- Divides rows into distinct groups to compute aggregates per group.\n- **The Golden Rule**: Every unaggregated column in the `SELECT` list **must** be listed in the `GROUP BY` clause.\n- Omitting a selected column from `GROUP BY` raises: `not a GROUP BY expression` (or `not a single-group group function`).\n- **Aliases Prohibited**: Column aliases cannot be used in `GROUP BY` because `GROUP BY` executes before `SELECT` (raises: `\"ALIAS_NAME\": invalid identifier`).\n- Example: `SELECT department_id, job_id, SUM(salary) FROM employees GROUP BY department_id, job_id;`\n\n## 5. Filtering Groups (HAVING vs WHERE)\n- **Syntax**: `SELECT col, COUNT(*) FROM table GROUP BY col HAVING COUNT(*) > n;`\n- **WHERE**: Filters individual rows *before* grouping occurs; placing a group function in `WHERE` raises: `group function is not allowed here`.\n- **HAVING**: Filters aggregated groups *after* grouping occurs; designed specifically for conditions with aggregate functions.\n- Example: `SELECT department_id, COUNT(*) FROM employees GROUP BY department_id HAVING COUNT(*) > 5;`\n\n## 6. Nesting Group Functions\n- Group functions can be nested up to a **maximum of 2 levels** (e.g., `MAX(AVG(salary))`).\n- **Prohibition on Individual Columns**: When group functions are nested, the `GROUP BY` column **cannot** appear in the `SELECT` list because the nested function collapses the result into a single scalar value.\n- Violating this raises: `not a single-group group function`.\n- Example:\n  - Valid: `SELECT MIN(SUM(salary)) FROM employees GROUP BY department_id;`\n  - Invalid: `SELECT department_id, MIN(SUM(salary)) FROM employees GROUP BY department_id;`\n",
    "examples": {
      "1": [
        {
          "sql": "-- Standard: Numeric aggregates (AVG, SUM, MIN, MAX, COUNT)\nSELECT ROUND(AVG(salary), 2) AS avg_sal,\n       SUM(salary) AS total_sal,\n       COUNT(*) AS total_emps\nFROM employees\nWHERE department_id = 90;",
          "output": "   AVG_SAL  TOTAL_SAL  TOTAL_EMPS\n----------  ---------  ----------\n  19333.33      58000           3"
        },
        {
          "sql": "-- Feature: MIN and MAX operate on dates and character strings in addition to numbers\nSELECT MIN(hire_date) AS earliest_hire,\n       MAX(hire_date) AS latest_hire,\n       MIN(last_name) AS first_alpha_name\nFROM employees\nWHERE department_id = 90;",
          "output": "EARLIEST_HIRE  LATEST_HIRE  FIRST_ALPHA_NAME\n-------------  -----------  ----------------\n17-JUN-03      21-SEP-05    King            "
        }
      ],
      "2": [
        {
          "sql": "-- Rule: Aggregate functions ignore NULLs, except COUNT(*) which counts all physical rows\nSELECT COUNT(*) AS total_rows,\n       COUNT(commission_pct) AS non_null_comm,\n       ROUND(AVG(commission_pct), 2) AS avg_comm_ignores_nulls\nFROM employees\nWHERE department_id = 80;",
          "output": "TOTAL_ROWS  NON_NULL_COMM  AVG_COMM_IGNORES_NULLS\n----------  -------------  ----------------------\n        34             34                     .22"
        },
        {
          "sql": "-- Practice: Using NVL inside AVG to include NULLs as zeros in calculation\nSELECT ROUND(AVG(commission_pct), 2) AS avg_ignoring_nulls,\n       ROUND(AVG(NVL(commission_pct, 0)), 2) AS avg_including_nulls\nFROM employees;",
          "output": "AVG_IGNORING_NULLS  AVG_INCLUDING_NULLS\n------------------  -------------------\n               .22                  .07\nNote: First divides by count of employees with commission; second divides by all employees."
        }
      ],
      "3": [
        {
          "sql": "-- Standard: COUNT(DISTINCT col) counts only unique values, ignoring duplicates\nSELECT COUNT(department_id) AS all_dept_rows,\n       COUNT(DISTINCT department_id) AS unique_depts\nFROM employees;",
          "output": "ALL_DEPT_ROWS  UNIQUE_DEPTS\n-------------  ------------\n          106            11"
        },
        {
          "sql": "-- Feature: SUM(DISTINCT col) sums only unique salary values\nSELECT SUM(salary) AS normal_sum,\n       SUM(DISTINCT salary) AS unique_salary_sum\nFROM employees\nWHERE department_id = 90;",
          "output": "NORMAL_SUM  UNIQUE_SALARY_SUM\n----------  -----------------\n     58000              41000\nNote: Normal sum includes Steven (24k) + Neena (17k) + Lex (17k) = 58k. Distinct sum counts 17k once (41k)."
        }
      ],
      "4": [
        {
          "sql": "-- Standard: GROUP BY divides rows into distinct groups to compute aggregates per group\nSELECT department_id, COUNT(*) AS emp_count, ROUND(AVG(salary), 2) AS avg_sal\nFROM employees\nWHERE department_id IN (10, 20, 90)\nGROUP BY department_id\nORDER BY department_id;",
          "output": "DEPARTMENT_ID  EMP_COUNT   AVG_SAL\n-------------  ---------  --------\n           10          1      4400\n           20          2      9500\n           90          3  19333.33"
        },
        {
          "sql": "-- Multi-Column: Grouping by multiple columns calculates aggregates for each combination\nSELECT department_id, job_id, COUNT(*) AS count\nFROM employees\nWHERE department_id = 20\nGROUP BY department_id, job_id;",
          "output": "DEPARTMENT_ID  JOB_ID      COUNT\n-------------  ----------  -----\n           20  MK_MAN          1\n           20  MK_REP          1"
        },
        {
          "sql": "-- Exam Trap: Selecting unaggregated column missing from GROUP BY raises error\nSELECT department_id, last_name, AVG(salary)\nFROM employees\nGROUP BY department_id;\n-- Error: not a GROUP BY expression",
          "output": "Error: not a GROUP BY expression\nCause: last_name is in the SELECT list but is neither wrapped in an aggregate function nor present in the GROUP BY clause."
        },
        {
          "sql": "-- Exam Trap: Column aliases cannot be used in GROUP BY in Oracle (GROUP BY runs before SELECT!)\nSELECT department_id AS dept, COUNT(*)\nFROM employees\nGROUP BY dept;\n-- Error: \"DEPT\": invalid identifier",
          "output": "Error: \"DEPT\": invalid identifier\nCause: GROUP BY executes before the SELECT clause; the alias 'dept' does not exist yet."
        }
      ],
      "5": [
        {
          "sql": "-- Standard: WHERE filters rows BEFORE grouping; HAVING filters aggregated groups AFTER grouping\nSELECT department_id, COUNT(*) AS emp_count\nFROM employees\nWHERE salary > 5000\nGROUP BY department_id\nHAVING COUNT(*) >= 2\nORDER BY department_id;",
          "output": "DEPARTMENT_ID  EMP_COUNT\n-------------  ---------\n           20          2\n           90          3"
        },
        {
          "sql": "-- Exam Trap: Group functions are illegal inside the WHERE clause; raises error\nSELECT department_id, AVG(salary)\nFROM employees\nWHERE AVG(salary) > 8000\nGROUP BY department_id;\n-- Error: group function is not allowed here",
          "output": "Error: group function is not allowed here\nCause: Aggregate conditions must be placed in the HAVING clause, never in the WHERE clause."
        },
        {
          "sql": "-- Proper Syntax: Aggregate filtering in HAVING clause\nSELECT department_id, ROUND(AVG(salary), 2) AS dept_avg\nFROM employees\nGROUP BY department_id\nHAVING AVG(salary) > 10000\nORDER BY dept_avg DESC;",
          "output": "DEPARTMENT_ID  DEPT_AVG\n-------------  --------\n           90  19333.33\n          110     10154"
        }
      ],
      "6": [
        {
          "sql": "-- Standard: Group functions can be nested up to a maximum of 2 levels\nSELECT MAX(AVG(salary)) AS highest_dept_average\nFROM employees\nGROUP BY department_id;",
          "output": "HIGHEST_DEPT_AVERAGE\n--------------------\n            19333.33"
        },
        {
          "sql": "-- Exam Trap: Selecting individual column with nested group function raises error\nSELECT department_id, MAX(AVG(salary))\nFROM employees\nGROUP BY department_id;\n-- Error: not a single-group group function",
          "output": "Error: not a single-group group function\nCause: Nested group functions collapse the result into one single scalar value, so no individual group columns can be displayed."
        }
      ]
    }
  },
  {
    "id": "joins",
    "title": "9. Joins & Relationships",
    "folder": "joins",
    "content": "# Joins - Notes\n\n## 1. Cartesian Product & CROSS JOIN\n- **Syntax**: `SELECT * FROM table1 CROSS JOIN table2;` (or `FROM table1, table2;`).\n- Created when two tables are joined without any matching condition.\n- Every row in the first table pairs with every row in the second table.\n- **Row Count Formula**: Rows(Table 1) × Rows(Table 2).\n- Example: 5 colors × 4 sizes = 20 total combinations.\n\n## 2. NATURAL JOIN\n- **Syntax**: `SELECT col1, shared_col FROM table1 NATURAL JOIN table2;`\n- Automatically matches rows on all columns sharing identical names and datatypes.\n- **Qualifier Prohibition**: Columns used in a `NATURAL JOIN` **must not** have a table prefix or alias in the query (e.g., `c.customer_id` is illegal; write `customer_id`).\n- Adding a qualifier raises: `column used in NATURAL join cannot have qualifier`.\n- Example: `SELECT c.customer_name, customer_id FROM customers c NATURAL JOIN orders o;`\n\n## 3. The USING Clause\n- **Syntax**: `SELECT col1, shared_col FROM table1 JOIN table2 USING (shared_col);`\n- Joins on an explicitly specified shared column (enclosed in parentheses).\n- **Qualifier Restriction**: Just like `NATURAL JOIN`, any column listed in the `USING` clause **must not** have a table qualifier or alias anywhere in the query.\n- Adding a qualifier raises: `column part of USING clause cannot have qualifier`.\n- Example: `SELECT e.emp_name, department_id FROM employees e JOIN departments d USING (department_id);`\n\n## 4. The JOIN ... ON Syntax (Inner Join)\n- **Syntax**: `SELECT e.col, d.col FROM table1 e JOIN table2 d ON e.id = d.id;`\n- Most flexible join; works with different column names and complex conditions.\n- **Chaining 3+ Tables**: Add sequential `JOIN ... ON` clauses one after another (`FROM t1 a JOIN t2 b ON a.k1 = b.k1 JOIN t3 c ON b.k2 = c.k2`).\n- **Disambiguation Rule**: In `JOIN ... ON`, any shared column referenced in `SELECT` **must be qualified** with a table alias (e.g., `c.customer_id`).\n- Omitting the table qualifier on a shared column raises: `column ambiguously defined`.\n- Example (2 tables): `SELECT c.customer_name, c.customer_id, o.order_total FROM customers c JOIN orders o ON c.customer_id = o.customer_id;`\n- Example (3 tables): `SELECT c.customer_name, o.order_id, oi.qty FROM customers c JOIN orders o ON c.customer_id = o.customer_id JOIN order_items oi ON o.order_id = oi.order_id;`\n\n## 5. Self Joins\n- **Syntax**: `SELECT e.col, m.col FROM table e JOIN table m ON e.parent_id = m.id;`\n- Joins a table to itself to model relationships within the same dataset (such as employee and manager hierarchies).\n- Requires using the table twice with **two distinct aliases** so Oracle treats them as independent tables.\n- Example: `SELECT e.emp_name, m.salary FROM employees e JOIN employees m ON e.manager_id = m.emp_id;`\n\n## 6. Non-Equijoins\n- **Syntax**: `SELECT e.col, g.col FROM table1 e JOIN table2 g ON e.val BETWEEN g.low AND g.high;`\n- A join condition using comparison operators other than `=` (such as `BETWEEN`, `<`, `>`, `<=`, `>=`).\n- Used when tables relate through numerical ranges or grade bands rather than identical primary/foreign keys.\n- Example: `SELECT s.student_name, g.grade_letter FROM students s JOIN grading_scale g ON s.score BETWEEN g.min_score AND g.max_score;`\n\n## 7. LEFT OUTER JOIN\n- **Syntax**: `SELECT e.col, d.col FROM table1 e LEFT OUTER JOIN table2 d ON e.id = d.id;`\n- Keyword `OUTER` is optional (`LEFT JOIN` is identical).\n- Returns all matching rows, PLUS all unmatched rows from the **LEFT table** (the first table listed).\n- Columns from the right table are filled with `NULL` for unmatched left rows.\n- Example: `SELECT c.customer_name, o.order_id FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id;` preserves all customers even if they have 0 orders.\n\n## 8. RIGHT & FULL OUTER JOIN\n- **RIGHT OUTER JOIN**: Returns all matching rows, PLUS all unmatched rows from the **right table** (columns from unmatched left table become `NULL`).\n  - Any `RIGHT JOIN` can be inverted into a `LEFT JOIN` by switching table positions in the `FROM` clause.\n- **FULL OUTER JOIN**: Returns all matching rows, PLUS unmatched rows from **both the left and right tables**.\n- Example: `SELECT e.emp_name, d.department_name FROM employees e FULL OUTER JOIN departments d ON e.department_id = d.department_id;`\n\n## 9. Oracle Proprietary (+) Outer Join Operator\n- Legacy Oracle outer join syntax placed in the `WHERE` clause.\n- **Placement Rule**: Place `(+)` on the **deficient side** (the side lacking matching data that needs to supply `NULL`s):\n  - `table1.col = table2.col (+)` ≡ `table1 LEFT JOIN table2`\n  - `table1.col (+) = table2.col` ≡ `table1 RIGHT JOIN table2`\n- **Prohibitions**:\n  - Cannot perform a Full Outer Join by placing `(+)` on both sides (raises: `a predicate may reference only one outer-joined table`).\n  - Cannot be used with the `IN` operator or combined using `OR` (raises: `outer join operator (+) not allowed in operand of OR or IN`).\n- Example: `SELECT c.customer_name, o.order_total FROM customers c, orders o WHERE c.customer_id = o.customer_id (+);`\n",
    "examples": {
      "1": [
        {
          "sql": "-- Standard: CROSS JOIN produces a Cartesian product (Table 1 rows * Table 2 rows)\nSELECT r.region_name, c.country_id\nFROM regions r\nCROSS JOIN countries c\nWHERE r.region_id = 1 AND c.region_id = 1;",
          "output": "REGION_NAME  COUNTRY_ID\n-----------  ----------\nEurope       BE        \nEurope       CH        \nEurope       DE        "
        },
        {
          "sql": "-- Accidental Trap: Comma-separated tables in FROM without a WHERE condition creates an accidental Cartesian product\nSELECT e.last_name, d.department_name\nFROM employees e, departments d\nWHERE e.employee_id = 100;",
          "output": "LAST_NAME  DEPARTMENT_NAME\n---------  ---------------\nKing       Administration \nKing       Marketing      \nKing       Purchasing     \n(Repeats King for every single department in the table!)"
        }
      ],
      "2": [
        {
          "sql": "-- Standard: NATURAL JOIN automatically matches on all columns with identical names and datatypes\nSELECT department_id, department_name, manager_id\nFROM departments\nNATURAL JOIN locations\nWHERE department_id IN (10, 20);",
          "output": "DEPARTMENT_ID  DEPARTMENT_NAME  MANAGER_ID\n-------------  ---------------  ----------\n           10  Administration          200\n           20  Marketing               201"
        },
        {
          "sql": "-- Exam Trap: In NATURAL JOIN, common join columns MUST NOT have table qualifiers (raises error)\nSELECT d.department_id, d.department_name\nFROM departments d\nNATURAL JOIN locations l;\n-- Error: column used in NATURAL join cannot have qualifier",
          "output": "Error: column used in NATURAL join cannot have qualifier\nCause: Common columns in NATURAL JOIN belong to both tables and must be written unqualified (e.g. department_id, not d.department_id)."
        }
      ],
      "3": [
        {
          "sql": "-- Standard: JOIN ... USING specifies exactly which common column to join on (enclosed in parentheses)\nSELECT e.first_name, d.department_name, department_id\nFROM employees e\nJOIN departments d USING (department_id)\nWHERE department_id = 10;",
          "output": "FIRST_NAME  DEPARTMENT_NAME  DEPARTMENT_ID\n----------  ---------------  -------------\nJennifer    Administration              10"
        },
        {
          "sql": "-- Exam Trap: Columns in the USING clause MUST NOT have table qualifiers anywhere in the query (raises error)\nSELECT e.first_name, e.department_id\nFROM employees e\nJOIN departments d USING (department_id);\n-- Error: column part of USING clause cannot have qualifier",
          "output": "Error: column part of USING clause cannot have qualifier\nCause: Columns referenced in the USING clause cannot be prefixed with any table alias."
        }
      ],
      "4": [
        {
          "sql": "-- Standard: JOIN ... ON provides maximum flexibility and explicit join condition\nSELECT e.first_name, d.department_name, e.department_id\nFROM employees e\nJOIN departments d ON e.department_id = d.department_id\nWHERE e.department_id = 10;",
          "output": "FIRST_NAME  DEPARTMENT_NAME  DEPARTMENT_ID\n----------  ---------------  -------------\nJennifer    Administration              10"
        },
        {
          "sql": "-- Exam Trap: In JOIN ... ON, common column names in SELECT MUST be qualified with a table alias\nSELECT first_name, department_id\nFROM employees e\nJOIN departments d ON e.department_id = d.department_id;\n-- Error: column ambiguously defined",
          "output": "Error: column ambiguously defined\nCause: department_id exists in both employees and departments. In ON syntax, it must be qualified (e.g. e.department_id)."
        },
        {
          "sql": "-- Multi-Condition: ON clause supporting multiple conditions combining foreign key and additional criteria\nSELECT e.first_name, d.department_name\nFROM employees e\nJOIN departments d \n  ON e.department_id = d.department_id \n AND e.manager_id = d.manager_id\nWHERE e.department_id = 10;",
          "output": "FIRST_NAME  DEPARTMENT_NAME\n----------  ---------------\nJennifer    Administration "
        }
      ],
      "5": [
        {
          "sql": "-- Standard: Self Join links a table to itself using two distinct aliases (hierarchical employee-manager relationship)\nSELECT e.last_name AS employee,\n       m.last_name AS manager\nFROM employees e\nJOIN employees m ON e.manager_id = m.employee_id\nWHERE e.department_id = 90\nORDER BY e.last_name;",
          "output": "EMPLOYEE   MANAGER\n---------  -------\nLex        King   \nNeena      King   "
        },
        {
          "sql": "-- Feature: Combining Self Join with LEFT OUTER JOIN ensures top executive (manager_id is NULL) is not omitted\nSELECT e.last_name AS employee,\n       NVL(m.last_name, 'TOP BOSS') AS manager\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.employee_id\nWHERE e.employee_id IN (100, 101)\nORDER BY e.employee_id;",
          "output": "EMPLOYEE  MANAGER \n--------  --------\nKing      TOP BOSS\nKochhar   King    "
        }
      ],
      "6": [
        {
          "sql": "-- Standard: Non-Equijoin joins tables on a condition other than equality (e.g., BETWEEN ... AND ...)\nSELECT e.last_name, e.salary, j.grade_level\nFROM employees e\nJOIN job_grades j ON e.salary BETWEEN j.lowest_sal AND j.highest_sal\nWHERE e.employee_id = 100;",
          "output": "LAST_NAME  SALARY  GRADE_LEVEL\n---------  ------  -----------\nKing        24000  E          "
        },
        {
          "sql": "-- Feature: Non-Equijoin using relational comparison operators (<, >)\nSELECT e.last_name, e.salary, d.department_name\nFROM employees e\nJOIN departments d ON e.department_id = d.department_id AND e.salary > 20000;",
          "output": "LAST_NAME  SALARY  DEPARTMENT_NAME\n---------  ------  ---------------\nSteven      24000  Executive      "
        }
      ],
      "7": [
        {
          "sql": "-- Standard: LEFT OUTER JOIN returns all matching rows PLUS unmatched rows from the left table\nSELECT d.department_name, e.last_name\nFROM departments d\nLEFT OUTER JOIN employees e ON d.department_id = e.department_id\nWHERE d.department_id IN (10, 190);  -- Dept 190 has 0 employees",
          "output": "DEPARTMENT_NAME  LAST_NAME\n---------------  ---------\nAdministration   Whalen   \nContracting         <NULL>"
        },
        {
          "sql": "-- Practical Pattern: Finding left table rows that have NO match in right table using WHERE right.col IS NULL\nSELECT d.department_id, d.department_name\nFROM departments d\nLEFT JOIN employees e ON d.department_id = e.department_id\nWHERE e.employee_id IS NULL AND d.department_id = 190;",
          "output": "DEPARTMENT_ID  DEPARTMENT_NAME\n-------------  ---------------\n          190  Contracting    "
        }
      ],
      "8": [
        {
          "sql": "-- Standard: RIGHT OUTER JOIN preserves all rows from the right table\nSELECT e.last_name, d.department_name\nFROM employees e\nRIGHT OUTER JOIN departments d ON e.department_id = d.department_id\nWHERE d.department_id IN (10, 190);",
          "output": "LAST_NAME  DEPARTMENT_NAME\n---------  ---------------\nWhalen     Administration \n   <NULL>  Contracting    "
        },
        {
          "sql": "-- Standard: FULL OUTER JOIN returns all matching rows PLUS unmatched rows from BOTH left and right tables\nSELECT e.last_name, d.department_name\nFROM employees e\nFULL OUTER JOIN departments d ON e.department_id = d.department_id\nWHERE e.employee_id = 178 OR d.department_id = 190;",
          "output": "LAST_NAME  DEPARTMENT_NAME\n---------  ---------------\nGrant               <NULL>  (Employee without department)\n   <NULL>  Contracting      (Department without employees)"
        }
      ],
      "9": [
        {
          "sql": "-- Standard: Oracle (+) operator placed on the deficient side (the side that needs to supply NULLs)\nSELECT d.department_name, e.last_name\nFROM departments d, employees e\nWHERE d.department_id = e.department_id (+)\n  AND d.department_id IN (10, 190);",
          "output": "DEPARTMENT_NAME  LAST_NAME\n---------------  ---------\nAdministration   Whalen   \nContracting         <NULL>"
        },
        {
          "sql": "-- Exam Trap: Cannot create a FULL OUTER JOIN by placing (+) on both sides (raises error)\nSELECT d.department_name, e.last_name\nFROM departments d, employees e\nWHERE d.department_id (+) = e.department_id (+);\n-- Error: a predicate may reference only one outer-joined table",
          "output": "Error: a predicate may reference only one outer-joined table\nCause: (+) cannot appear on both sides of a predicate simultaneously."
        },
        {
          "sql": "-- Exam Trap: The (+) operator cannot be used with the IN operator or combined using OR\nSELECT d.department_name, e.last_name\nFROM departments d, employees e\nWHERE e.department_id (+) IN (10, 20);\n-- Error: outer join operator (+) not allowed in operand of OR or IN",
          "output": "Error: outer join operator (+) not allowed in operand of OR or IN\nCause: The (+) operator is strictly restricted to simple comparison conditions."
        }
      ]
    }
  },
  {
    "id": "subqueries",
    "title": "10. Subqueries & EXISTS",
    "folder": "subqueries",
    "content": "# Subqueries - Notes\n\n## 1. Single-Row Subqueries\n- An inner query nested inside an outer statement that returns **exactly one row (single value)**.\n- Must be enclosed in parentheses `(...)`.\n- Uses standard comparison operators: `=`, `>`, `<`, `>=`, `<=`, `<>`.\n- Inner query executes first, and its single output is supplied to the outer query condition.\n- Example: `SELECT emp_name FROM employees WHERE salary > (SELECT salary FROM employees WHERE emp_name = 'Abel');`\n\n## 2. The Single-Row Subquery Error Trap\n- Using a single-row operator (`=`, `>`, `<`, etc.) with a subquery that yields multiple rows causes a query failure.\n- Error message: `single-row subquery returns more than one row`.\n- Single-row operators strictly demand a subquery guaranteed to return at most 1 row (such as queries on unique keys or using aggregate functions like `MIN`, `MAX`).\n- Example: `WHERE department_id = (SELECT department_id FROM employees WHERE job_id = 'IT_PROG');` fails if multiple IT programmers exist.\n\n## 3. Multiple-Row Subqueries (IN Operator)\n- **Syntax**: `SELECT col FROM table1 WHERE col IN (SELECT col FROM table2 WHERE condition);`\n- Used when an inner subquery returns multiple rows.\n- Evaluates to true if the outer column matches any value returned by the inner query.\n- Example: `SELECT order_id FROM orders WHERE customer_id IN (SELECT customer_id FROM customers WHERE city = 'CHICAGO');`\n\n## 4. Multiple-Row Operators (ANY & ALL)\n- Pairs with relational comparison operators (`>`, `<`, `=`, `<>`) against multi-row subquery results.\n- **ANY (At least one)**:\n  - `> ANY`: Greater than the minimum value in the list (> MIN).\n  - `< ANY`: Less than the maximum value in the list (< MAX).\n  - `= ANY`: Equivalent to `IN`.\n- **ALL (Every single one)**:\n  - `> ALL`: Greater than the maximum value in the list (> MAX).\n  - `< ALL`: Less than the minimum value in the list (< MIN).\n  - `<> ALL`: Equivalent to `NOT IN`.\n- Example: `WHERE salary > ALL (2500, 3000, 4000)` requires `salary > 4000`.\n\n## 5. The NOT IN with NULL Trap\n- **The Boolean Mechanism**:\n  - `IN` uses `OR` logic: `(x=1 OR x=NULL)`. Since `TRUE OR UNKNOWN = TRUE`, `IN` is safe from NULL poisoning.\n  - `NOT IN` uses `AND` logic: `(x!=1 AND x!=NULL)`. Since `TRUE AND UNKNOWN = UNKNOWN`, a single `NULL` poisons the entire chain, causing every row to evaluate to UNKNOWN/FALSE.\n- Result: If the subquery yields even one `NULL`, `NOT IN` returns **0 rows**.\n- **Fix**: Filter out `NULL`s explicitly in the subquery:\n  `WHERE col NOT IN (SELECT col FROM table WHERE col IS NOT NULL);`\n- Example: `WHERE product_id NOT IN (1, 2, NULL)` returns `0 rows`.\n\n## 6. Multiple-Column Subqueries (Pairwise Comparison)\n- **Syntax**: `WHERE (col1, col2) IN (SELECT col1, aggregate(col2) FROM table GROUP BY col1);`\n- Evaluates multiple columns simultaneously as an atomic pair (tuple).\n- **The Problem It Solves**: Prevents false matches where separate single-column conditions match across different groups.\n- Can alternatively be written using an `INNER JOIN` against an aggregated inline view.\n- Example: `WHERE (category_id, price) IN (SELECT category_id, MAX(price) FROM products GROUP BY category_id);`\n\n## 7. Correlated Subqueries & EXISTS / NOT EXISTS\n- **Correlated Subquery**: An inner query that references a column from the outer query table, executing once per candidate row of the outer query.\n- **EXISTS**: Tests whether the inner query returns at least one row (returns TRUE on first match and short-circuits).\n- **NOT EXISTS**: Tests for the absence of any matching rows.\n- **NULL Immunity**: Unlike `NOT IN`, `NOT EXISTS` is completely unaffected by NULL values in the child table.\n- Standard practice uses `SELECT 1` or `SELECT *` inside the subquery.\n- Example: `SELECT c.customer_name FROM customers c WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE c.customer_id = o.customer_id);`\n",
    "examples": {
      "1": [
        {
          "sql": "-- Standard: Single-row subquery returns exactly one scalar value; evaluates inner first\nSELECT first_name, salary\nFROM employees\nWHERE salary > (SELECT AVG(salary) FROM employees)\nORDER BY salary DESC;",
          "output": "FIRST_NAME  SALARY\n----------  ------\nSteven       24000\nNeena        17000\nLex          17000"
        },
        {
          "sql": "-- Standard: Single-row comparison matching the minimum or maximum value\nSELECT first_name, salary\nFROM employees\nWHERE salary = (SELECT MAX(salary) FROM employees);",
          "output": "FIRST_NAME  SALARY\n----------  ------\nSteven       24000"
        },
        {
          "sql": "-- Projection: Scalar subquery embedded directly in SELECT list\nSELECT first_name, salary,\n       salary - (SELECT ROUND(AVG(salary), 0) FROM employees) AS diff_from_avg\nFROM employees\nWHERE department_id = 90;",
          "output": "FIRST_NAME  SALARY  DIFF_FROM_AVG\n----------  ------  -------------\nSteven       24000          17540\nNeena        17000          10540\nLex          17000          10540"
        }
      ],
      "2": [
        {
          "sql": "-- Exam Trap: Using a single-row operator (=, >, <) with a subquery returning multiple rows raises error\nSELECT first_name, department_id\nFROM employees\nWHERE department_id = (SELECT department_id FROM employees WHERE job_id = 'IT_PROG');\n-- Error: single-row subquery returns more than one row",
          "output": "Error: single-row subquery returns more than one row\nCause: Single-row operators strictly require the inner subquery to produce at most 1 row."
        },
        {
          "sql": "-- Fix: Replace single-row operator with multiple-row operator (IN)\nSELECT first_name, department_id\nFROM employees\nWHERE department_id IN (SELECT department_id FROM employees WHERE job_id = 'IT_PROG')\n  AND employee_id = 103;",
          "output": "FIRST_NAME  DEPARTMENT_ID\n----------  -------------\nAlexander              60"
        }
      ],
      "3": [
        {
          "sql": "-- Standard: IN operator matches against any value returned by the multi-row subquery\nSELECT first_name, department_id\nFROM employees\nWHERE department_id IN (SELECT department_id FROM departments WHERE location_id = 1700)\n  AND department_id = 10;",
          "output": "FIRST_NAME  DEPARTMENT_ID\n----------  -------------\nJennifer               10"
        },
        {
          "sql": "-- Standard: NOT IN excludes all values returned by the subquery (when subquery has no NULLs)\nSELECT department_id, department_name\nFROM departments\nWHERE department_id NOT IN (SELECT department_id FROM employees WHERE department_id IS NOT NULL)\n  AND department_id = 190;",
          "output": "DEPARTMENT_ID  DEPARTMENT_NAME\n-------------  ---------------\n          190  Contracting    "
        }
      ],
      "4": [
        {
          "sql": "-- Standard: > ANY means greater than the MINIMUM value; < ANY means less than the MAXIMUM value\nSELECT first_name, salary\nFROM employees\nWHERE salary < ANY (SELECT salary FROM employees WHERE department_id = 90)\n  AND department_id = 20;",
          "output": "FIRST_NAME  SALARY\n----------  ------\nMichael      13000\nPat           6000\nNote: Subquery returns (17000, 24000). Salary < 24000 (< MAX) evaluates to TRUE for both."
        },
        {
          "sql": "-- Standard: > ALL means greater than the MAXIMUM value; < ALL means less than the MINIMUM value\nSELECT first_name, salary\nFROM employees\nWHERE salary > ALL (SELECT salary FROM employees WHERE department_id = 60)\n  AND department_id = 90;",
          "output": "FIRST_NAME  SALARY\n----------  ------\nSteven       24000\nNeena        17000\nLex          17000\nNote: Dept 60 salaries max at 9000. All Dept 90 salaries (> 9000) qualify."
        },
        {
          "sql": "-- Equivalence Rule: = ANY is identical to IN; <> ALL is identical to NOT IN\nSELECT first_name, department_id\nFROM employees\nWHERE department_id = ANY (SELECT department_id FROM departments WHERE department_id IN (10, 20))\n  AND employee_id = 200;",
          "output": "FIRST_NAME  DEPARTMENT_ID\n----------  -------------\nJennifer               10"
        }
      ],
      "5": [
        {
          "sql": "-- Exam Trap: If a multi-row subquery returns even ONE NULL, NOT IN evaluates to UNKNOWN and returns 0 rows!\nSELECT employee_id, first_name\nFROM employees\nWHERE employee_id NOT IN (SELECT manager_id FROM employees);",
          "output": "no rows selected\nCause: manager_id column contains a NULL (Steven King has no manager). The AND chain evaluates to UNKNOWN!"
        },
        {
          "sql": "-- Fix: Filter out NULLs explicitly in the subquery using WHERE col IS NOT NULL\nSELECT employee_id, first_name\nFROM employees\nWHERE employee_id NOT IN (SELECT manager_id FROM employees WHERE manager_id IS NOT NULL)\n  AND department_id = 90;",
          "output": "no rows selected (All employees in Dept 90 are managers)\nNote: Adding IS NOT NULL allows non-managers in other departments to be correctly retrieved."
        }
      ],
      "6": [
        {
          "sql": "-- Standard: Pairwise subquery compares multiple columns simultaneously as an atomic tuple\nSELECT employee_id, department_id, salary\nFROM employees\nWHERE (department_id, salary) IN (\n  SELECT department_id, MAX(salary)\n  FROM employees\n  WHERE department_id IN (10, 20)\n  GROUP BY department_id\n)\nORDER BY department_id;",
          "output": "EMPLOYEE_ID  DEPARTMENT_ID  SALARY\n-----------  -------------  ------\n        200             10    4400\n        201             20   13000"
        },
        {
          "sql": "-- Contrast: Non-pairwise subquery matches columns independently and can yield false combinations\nSELECT employee_id, department_id, salary\nFROM employees\nWHERE department_id IN (10, 20)\n  AND salary IN (SELECT MAX(salary) FROM employees WHERE department_id IN (10, 20) GROUP BY department_id);",
          "output": "Note: Non-pairwise evaluates dept and salary independently, which could incorrectly match an employee in Dept 10 earning Dept 20's max salary."
        }
      ],
      "7": [
        {
          "sql": "-- Standard: Correlated subquery references outer table column; evaluates once per outer row\nSELECT e.first_name, e.salary, e.department_id\nFROM employees e\nWHERE e.salary > (\n  SELECT AVG(salary)\n  FROM employees\n  WHERE department_id = e.department_id\n)\nAND e.department_id = 90;",
          "output": "FIRST_NAME  SALARY  DEPARTMENT_ID\n----------  ------  -------------\nSteven       24000             90"
        },
        {
          "sql": "-- Feature: EXISTS tests for the presence of matching rows and short-circuits on first hit\nSELECT department_id, department_name\nFROM departments d\nWHERE EXISTS (\n  SELECT 1 FROM employees e WHERE e.department_id = d.department_id\n)\nAND department_id IN (10, 20);",
          "output": "DEPARTMENT_ID  DEPARTMENT_NAME\n-------------  ---------------\n           10  Administration \n           20  Marketing      "
        },
        {
          "sql": "-- Exam Trap: NOT EXISTS is completely immune to NULL poisoning in the inner subquery (unlike NOT IN!)\nSELECT employee_id, first_name\nFROM employees e\nWHERE NOT EXISTS (\n  SELECT 1 FROM employees WHERE manager_id = e.employee_id\n)\nAND department_id = 90;",
          "output": "no rows selected (All Dept 90 staff are managers)\nNote: NOT EXISTS safely works even when manager_id contains NULLs."
        }
      ]
    }
  },
  {
    "id": "set_operators",
    "title": "11. Set Operators",
    "folder": "set_operators",
    "content": "# Set Operators - Notes\n\n## 1. Set Operator Compatibility Rules\n- Combines multiple query results vertically into a single output.\n- **Rule 1 (Column Count)**: Both query blocks must select the exact same number of columns. Mismatch raises: `query block has incorrect number of result columns`.\n- **Rule 2 (Datatypes)**: Corresponding columns must have compatible data types; column names do not need to match. Mismatch raises: `expression must have same datatype as corresponding expression`.\n- **Rule 3 (Column Headers)**: The column headers in the final result are taken from the first `SELECT` query.\n\n## 2. UNION vs. UNION ALL\n- **UNION**:\n  - Merges rows and **eliminates duplicates**.\n  - Automatically sorts output in ascending order on the first column to identify and remove duplicates (higher performance cost).\n- **UNION ALL**:\n  - Merges rows and **preserves all duplicate rows**.\n  - Does not sort the output; faster execution.\n- Example: Combining `(Apple, Banana)` and `(Banana, Cherry)` with `UNION ALL` yields 4 total rows: `Apple, Banana, Banana, Cherry`.\n\n## 3. INTERSECT and MINUS\n- **INTERSECT**: Returns only rows common to both query results (the overlap); automatically deduplicates and sorts in ascending order.\n- **MINUS**: Returns rows from the first query that do not exist in the second query (set subtraction); automatically deduplicates and sorts.\n  - Order strictly matters: `A MINUS B` != `B MINUS A`.\n  - Exclusively called `MINUS` in Oracle (never `EXCEPT`).\n- Example:\n  - `(10, 20, 30) INTERSECT (20, 30, 40)` → `20, 30`\n  - `(10, 20, 30) MINUS (20, 30, 40)` → `10`\n\n## 4. The ORDER BY Placement Rule\n- **Strict Placement**: An `ORDER BY` clause can **only appear once**, at the **very end** of the entire compound query statement.\n- Placing `ORDER BY` on an individual sub-query raises: `SQL command not properly ended`.\n- **Naming Rule**: Can only sort by column names or aliases declared in the **first query block**, or by positional indices (`1, 2, 3...`).\n- Example:\n  ```sql\n  SELECT product_id, product_name FROM active_products\n  UNION ALL\n  SELECT product_id, product_name FROM archived_products\n  ORDER BY product_name;\n  ```\n",
    "examples": {
      "1": [
        {
          "sql": "-- Exam Trap: Set operators require matching column counts; mismatch raises error\nSELECT employee_id, first_name FROM employees WHERE department_id = 10\nUNION\nSELECT department_id FROM departments WHERE department_id = 10;\n-- Error: query block has incorrect number of result columns",
          "output": "Error: query block has incorrect number of result columns\nCause: First query selects 2 columns; second query selects only 1 column."
        },
        {
          "sql": "-- Exam Trap: Corresponding columns must share compatible datatypes; mismatch raises error\nSELECT employee_id FROM employees WHERE department_id = 10\nUNION\nSELECT department_name FROM departments WHERE department_id = 10;\n-- Error: expression must have same datatype as corresponding expression",
          "output": "Error: expression must have same datatype as corresponding expression\nCause: Column 1 in first block is NUMBER; column 1 in second block is VARCHAR2."
        },
        {
          "sql": "-- Core Rule: Output column headers and aliases are strictly determined by the FIRST query block\nSELECT employee_id AS staff_id, first_name AS staff_name FROM employees WHERE department_id = 10\nUNION\nSELECT department_id AS dept_num, department_name AS dept_title FROM departments WHERE department_id = 10;",
          "output": "  STAFF_ID  STAFF_NAME    \n----------  --------------\n        10  Administration\n       200  Jennifer      \nNote: Headers are STAFF_ID and STAFF_NAME (aliases from 2nd block are ignored)."
        }
      ],
      "2": [
        {
          "sql": "-- Standard: UNION combines results, eliminates duplicates, and automatically sorts ascending\nSELECT department_id FROM employees WHERE department_id IN (10, 20)\nUNION\nSELECT department_id FROM departments WHERE department_id IN (20, 50);",
          "output": "DEPARTMENT_ID\n-------------\n           10\n           20\n           50\nNote: 20 is deduplicated; output is sorted in ascending order."
        },
        {
          "sql": "-- Standard: UNION ALL preserves all duplicate rows and does NOT sort (significantly faster)\nSELECT department_id FROM employees WHERE department_id IN (10, 20)\nUNION ALL\nSELECT department_id FROM departments WHERE department_id IN (20, 50);",
          "output": "DEPARTMENT_ID\n-------------\n           10\n           20\n           20\n           20\n           50\nNote: Preserves all occurrences without sorting overhead."
        }
      ],
      "3": [
        {
          "sql": "-- Standard: INTERSECT returns only rows common to both query results (the overlap)\nSELECT department_id FROM employees\nINTERSECT\nSELECT department_id FROM departments\nWHERE department_id IN (10, 20, 190);",
          "output": "DEPARTMENT_ID\n-------------\n           10\n           20\nNote: Dept 190 has no employees, so it is omitted from INTERSECT."
        },
        {
          "sql": "-- Standard: MINUS returns rows from the first query that do NOT exist in the second query\nSELECT department_id FROM departments WHERE department_id IN (10, 20, 190)\nMINUS\nSELECT department_id FROM employees;",
          "output": "DEPARTMENT_ID\n-------------\n          190\nNote: Returns departments that have 0 employees."
        },
        {
          "sql": "-- Exam Trap: MINUS is order-sensitive: (A MINUS B) != (B MINUS A)\nSELECT department_id FROM employees WHERE department_id IN (10, 20)\nMINUS\nSELECT department_id FROM departments WHERE department_id = 20;",
          "output": "DEPARTMENT_ID\n-------------\n           10\nNote: Inverting the order (Departments MINUS Employees) would yield no rows."
        }
      ],
      "4": [
        {
          "sql": "-- Standard: An ORDER BY clause can only appear ONCE, at the very end of the compound statement\nSELECT employee_id, first_name FROM employees WHERE department_id = 10\nUNION\nSELECT employee_id, first_name FROM employees WHERE department_id = 20\nORDER BY first_name;",
          "output": "EMPLOYEE_ID  FIRST_NAME\n-----------  ----------\n        200  Jennifer  \n        201  Michael   \n        202  Pat       "
        },
        {
          "sql": "-- Exam Trap: Placing ORDER BY on an individual inner query block raises error\nSELECT employee_id, first_name FROM employees WHERE department_id = 10 ORDER BY first_name\nUNION\nSELECT employee_id, first_name FROM employees WHERE department_id = 20;\n-- Error: SQL command not properly ended",
          "output": "Error: SQL command not properly ended\nCause: ORDER BY cannot be attached to individual query components within a set operation."
        },
        {
          "sql": "-- Feature: ORDER BY in set queries can reference positional 1-based column indices\nSELECT employee_id, first_name FROM employees WHERE department_id IN (10, 20)\nUNION ALL\nSELECT department_id, department_name FROM departments WHERE department_id = 10\nORDER BY 2 DESC;",
          "output": "EMPLOYEE_ID  FIRST_NAME    \n-----------  --------------\n        202  Pat           \n        201  Michael       \n        200  Jennifer      \n         10  Administration"
        }
      ]
    }
  },
  {
    "id": "dml_and_transactions",
    "title": "12. DML & Transactions",
    "folder": "dml_and_transactions",
    "content": "# DML and Transactions - Notes\n\n## 1. The INSERT Statement\n- **Purpose**: Adds new rows to an existing database table.\n- **Explicit Column List (Best Practice)**:\n  - Syntax: `INSERT INTO table_name (col1, col2) VALUES (val1, val2);`\n  - Values match the specified column order.\n  - Any column omitted automatically receives `NULL` (or its defined `DEFAULT` value).\n- **Omitted Column List**:\n  - Syntax: `INSERT INTO table_name VALUES (val1, val2, ...);`\n  - Strict requirement: Must supply a value for **every single column** in the exact definition order of the table.\n- **Common Oracle Error Traps**:\n  - `not enough values`: Raised when the number of values in `VALUES(...)` is less than the columns specified (or less than total columns when column list is omitted).\n  - `too many values`: Raised when the number of values in `VALUES(...)` exceeds the specified or available columns.\n\n## 2. The UPDATE Statement\n- **Purpose**: Modifies existing records in a table.\n- **Syntax**:\n  ```sql\n  UPDATE table_name\n  SET column1 = value1,\n      column2 = value2\n  WHERE condition;\n  ```\n- **Multiple Columns Syntax Trap**:\n  - Multiple column assignments in the `SET` clause **must be separated by commas (`,`)**.\n  - Using `AND` (e.g., `SET col1 = val1 AND col2 = val2`) is invalid SQL and raises:\n    `SQL command not properly ended`.\n- **The Missing WHERE Trap**:\n  - If the `WHERE` clause is omitted, Oracle will silently update **every single row** across the entire table.\n\n## 3. The DELETE Statement vs. TRUNCATE\n- **The DELETE Statement**:\n  - Purpose: Deletes specific rows matching a `WHERE` condition.\n  - Syntax: `DELETE FROM table_name WHERE condition;` (`FROM` is optional in Oracle).\n  - Missing `WHERE`: Deletes all rows in the table.\n- **Comparison Table**:\n  | Property | `DELETE` | `TRUNCATE` |\n  | :--- | :--- | :--- |\n  | **Language Category** | **DML** | **DDL** |\n  | **Filtering** | Supports `WHERE` clause | No `WHERE` clause allowed (attempting `WHERE` raises `SQL command not properly ended`) |\n  | **Transaction Control** | Can be rolled back via `ROLLBACK` | **Cannot** be rolled back (issues implicit `COMMIT`) |\n  | **High Water Mark (HWM)**| Retains allocated extents; HWM unchanged | Deallocates extents; resets HWM to 0 |\n  | **Triggers** | Fires `DELETE` triggers | Does **not** fire triggers |\n  | **Speed** | Slower (logs row-by-row in undo) | Much faster (deallocates storage blocks directly) |\n\n## 4. The MERGE Statement (UPSERT)\n- **Purpose**: Combines conditional `INSERT` and `UPDATE` (and optionally `DELETE`) operations into a single atomic SQL statement based on match criteria.\n- **Syntax**:\n  ```sql\n  MERGE INTO target_table t\n  USING source_table s\n  ON (t.id = s.id)\n  WHEN MATCHED THEN\n    UPDATE SET t.col1 = s.col1,\n               t.col2 = s.col2\n  WHEN NOT MATCHED THEN\n    INSERT (id, col1, col2)\n    VALUES (s.id, s.col1, s.col2);\n  ```\n- **Strict Oracle Restriction & Trap**:\n  - **Cannot update match columns**: Any column referenced in the `ON (...)` condition cannot appear in the `UPDATE SET` clause.\n  - Violation error:\n    `Columns referenced in the ON Clause cannot be updated`.\n\n## 5. Transaction Control Language (TCL)\n- **Transaction Lifecycle in Oracle**:\n  - **Begins**: Automatically with the first executable DML statement (`INSERT`, `UPDATE`, `DELETE`, `MERGE`).\n  - **Explicit Ending**:\n    - `COMMIT;`: Persists all pending DML changes permanently and releases row locks.\n    - `ROLLBACK;`: Undoes all pending DML changes and releases row locks.\n  - **Implicit Ending**:\n    - Any DDL statement (`CREATE`, `ALTER`, `DROP`, `TRUNCATE`) or DCL statement (`GRANT`, `REVOKE`) executes an **implicit COMMIT** immediately before and after execution.\n    - Normal disconnection / SQL*Plus exit executes an automatic `COMMIT`.\n    - Session crash or abnormal disconnect causes an automatic `ROLLBACK`.\n- **SAVEPOINT (Partial Rollback)**:\n  - Syntax: `SAVEPOINT savepoint_name;`\n  - Rollback to marker: `ROLLBACK TO savepoint_name;`\n  - **Crucial Rule**: `ROLLBACK TO savepoint` does **not** terminate the transaction; the transaction remains active until a final `COMMIT` or complete `ROLLBACK` is issued.\n\n## 6. Row-Level Locking and SELECT ... FOR UPDATE\n- **Automatic Row Locks**: Oracle automatically places exclusive row locks whenever an `UPDATE` or `DELETE` executes. Readers never block writers, and writers never block readers (MVCC via Undo).\n- **Explicit Row Locking (`FOR UPDATE`)**:\n  - Syntax: `SELECT col1, col2 FROM table_name WHERE condition FOR UPDATE;`\n  - Acquires exclusive locks on matching rows to prevent other sessions from updating or deleting them until the locking transaction ends.\n- **Contention Clauses**:\n  - **Default**: Session waits indefinitely until the other session commits or rolls back.\n  - **`NOWAIT`**: Does not wait; immediately raises:\n    `resource busy and acquire with NOWAIT specified or timeout expired`.\n  - **`WAIT <n>`**: Waits up to `<n>` seconds before raising:\n    `resource busy; acquire with WAIT timeout expired`.\n- **Lock Release Rule**:\n  - All acquired locks are retained throughout the transaction and are **strictly released only upon `COMMIT` or `ROLLBACK`** (or abnormal session termination).\n",
    "examples": {
      "1": [
        {
          "sql": "-- Standard: INSERT with explicit column list (omitted nullable columns receive NULL or DEFAULT)\nINSERT INTO departments (department_id, department_name)\nVALUES (280, 'Stage Gate Prep');",
          "output": "1 row created."
        },
        {
          "sql": "-- Exam Trap: Error raised when VALUES list contains fewer items than column list\nINSERT INTO departments (department_id, department_name, manager_id)\nVALUES (290, 'Data Science');\n-- Error: not enough values",
          "output": "Error: not enough values\nCause: 3 columns specified, but only 2 values supplied in VALUES clause."
        },
        {
          "sql": "-- Exam Trap: Error raised when VALUES list contains more items than column list\nINSERT INTO departments (department_id, department_name)\nVALUES (300, 'AI Research', 200, 1700);\n-- Error: too many values",
          "output": "Error: too many values\nCause: 2 columns specified, but 4 values supplied in VALUES clause."
        },
        {
          "sql": "-- Feature: Inserting multiple rows using a subquery (no VALUES keyword)\nINSERT INTO bonus_archive (emp_id, bonus_amt)\nSELECT employee_id, salary * 0.10 FROM employees WHERE department_id = 90;",
          "output": "3 rows created."
        }
      ],
      "2": [
        {
          "sql": "-- Standard: Modifying multiple columns separated by commas in SET clause\nUPDATE employees\nSET salary = salary * 1.10,\n    commission_pct = 0.15\nWHERE employee_id = 103;",
          "output": "1 row updated."
        },
        {
          "sql": "-- Exam Trap: Using AND instead of commas in SET clause raises error\nUPDATE employees\nSET salary = 5000 AND commission_pct = 0.2\nWHERE employee_id = 103;\n-- Error: SQL command not properly ended",
          "output": "Error: SQL command not properly ended\nCause: Multiple column assignments in SET must be comma-separated, never separated with AND."
        },
        {
          "sql": "-- Warning Trap: Omitting the WHERE clause silently updates every single row in the table\nUPDATE employees\nSET salary = 5000;\n-- 107 rows updated (Entire company salary overwritten!)",
          "output": "107 rows updated.\nNote: Always verify WHERE clause before executing UPDATE statements."
        }
      ],
      "3": [
        {
          "sql": "-- Standard: Filtered DELETE removes specific matching rows (DML: can be rolled back)\nDELETE FROM employees\nWHERE employee_id = 999;",
          "output": "1 row deleted."
        },
        {
          "sql": "-- Architecture: TRUNCATE TABLE is DDL (cannot rollback, resets HWM to 0, does not fire triggers)\nTRUNCATE TABLE audit_log;",
          "output": "Table truncated.\nNote: Deallocates extents immediately; issues an implicit COMMIT before and after execution."
        },
        {
          "sql": "-- Exam Trap: TRUNCATE does NOT support a WHERE clause; raises error\nTRUNCATE TABLE audit_log WHERE log_date < SYSDATE - 30;\n-- Error: SQL command not properly ended",
          "output": "Error: SQL command not properly ended\nCause: TRUNCATE is DDL that wipes the whole table segment; row-level filtering requires DELETE."
        }
      ],
      "4": [
        {
          "sql": "-- Standard: MERGE performs conditional UPSERT (UPDATE if matched, INSERT if not matched)\nMERGE INTO emp_summary t\nUSING emp_staging s\nON (t.emp_id = s.emp_id)\nWHEN MATCHED THEN\n  UPDATE SET t.salary = s.salary, t.status = s.status\nWHEN NOT MATCHED THEN\n  INSERT (emp_id, salary, status)\n  VALUES (s.emp_id, s.salary, s.status);",
          "output": "5 rows merged."
        },
        {
          "sql": "-- Exam Trap: Cannot update columns referenced in the ON (...) condition; raises error\nMERGE INTO emp_summary t\nUSING emp_staging s\nON (t.emp_id = s.emp_id)\nWHEN MATCHED THEN\n  UPDATE SET t.emp_id = s.emp_id, t.salary = s.salary;\n-- Error: Columns referenced in the ON Clause cannot be updated",
          "output": "Error: Columns referenced in the ON Clause cannot be updated\nCause: t.emp_id is the join key in the ON clause and cannot be modified in the UPDATE branch."
        }
      ],
      "5": [
        {
          "sql": "-- Standard: Transaction lifecycle begins with first DML and persists with COMMIT\nUPDATE employees SET salary = salary + 100 WHERE employee_id = 100;\nCOMMIT;",
          "output": "1 row updated.\nCommit complete."
        },
        {
          "sql": "-- Feature: Partial rollback to a SAVEPOINT (transaction remains active!)\nUPDATE accounts SET balance = balance - 500 WHERE acct_id = 1;\nSAVEPOINT sp_debit;\nUPDATE accounts SET balance = balance + 500 WHERE acct_id = 2;\nROLLBACK TO sp_debit;\nCOMMIT;  -- Only the debit is committed",
          "output": "1 row updated.\nSavepoint created.\n1 row updated.\nRollback complete.\nCommit complete."
        },
        {
          "sql": "-- Exam Trap: Any DDL statement (CREATE, ALTER, TRUNCATE) issues an IMPLICIT COMMIT\nUPDATE employees SET salary = 9000 WHERE employee_id = 100;\nCREATE TABLE temp_flag (id NUMBER);\nROLLBACK;  -- Cannot rollback the update! DDL already committed it.",
          "output": "1 row updated.\nTable created.\nRollback complete (Has no effect on update; DDL issued implicit commit)."
        }
      ],
      "6": [
        {
          "sql": "-- Standard: SELECT ... FOR UPDATE acquires exclusive row-level locks on matching records\nSELECT employee_id, salary\nFROM employees\nWHERE department_id = 10\nFOR UPDATE;",
          "output": "EMPLOYEE_ID  SALARY\n-----------  ------\n        200    4400\nNote: Row is locked until this session issues COMMIT or ROLLBACK."
        },
        {
          "sql": "-- Feature: NOWAIT raises error immediately if rows are locked by another session\nSELECT employee_id, salary\nFROM employees\nWHERE department_id = 10\nFOR UPDATE NOWAIT;\n-- Error: resource busy and acquire with NOWAIT specified or timeout expired",
          "output": "Error: resource busy and acquire with NOWAIT specified or timeout expired\nCause: Another active transaction holds locks on the requested rows."
        },
        {
          "sql": "-- Feature: WAIT <n> specifies seconds to wait for locks before timing out with Error\nSELECT employee_id, salary\nFROM employees\nWHERE department_id = 10\nFOR UPDATE WAIT 5;",
          "output": "Error: resource busy; acquire with WAIT timeout expired\nCause: Lock could not be obtained within the specified 5-second interval."
        }
      ]
    }
  },
  {
    "id": "ddl_and_constraints",
    "title": "13. DDL & Integrity Constraints",
    "folder": "ddl_and_constraints",
    "content": "# DDL and Integrity Constraints - Notes\n\n## 1. Oracle Built-in Datatypes & the NUMBER(p, s) Rule\n- **Core Datatypes**:\n  - `VARCHAR2(size)`: Variable-length character string (up to 4,000 bytes). Only consumes bytes for characters actually stored.\n  - `CHAR(size)`: Fixed-length character string (up to 2,000 bytes). Pads unused space with trailing blanks.\n  - `DATE`: Stores century, year, month, day, hour, minute, second.\n  - `TIMESTAMP`: Stores date components plus fractional seconds (up to 9 digits, default 6).\n  - `CLOB` / `BLOB`: Large object storage (Character / Binary up to 128 TB).\n- **The `NUMBER(p, s)` Precision and Scale Rules**:\n  - `p` (Precision): Total number of significant digits (1 to 38).\n  - `s` (Scale): Number of digits to the right of the decimal point.\n  - Maximum allowed integer digits = `p - s`.\n  - **Fractional Digits**: Excess decimal places are **automatically rounded** to `s` places without error.\n  - **Integer Digits**: If the integer part exceeds `p - s` digits, Oracle raises:\n    `value larger than specified precision allowed for this column`.\n  - **Omitted Scale (`NUMBER(p)`)**: Defaults to `NUMBER(p, 0)` (pure integer). Decimal inputs are silently rounded to the nearest whole integer.\n  - **Omitted Both (`NUMBER`)**: Defaults to floating-point number storing up to 38 digits of precision with no fixed scale.\n\n## 2. PRIMARY KEY, UNIQUE, and NOT NULL Constraints\n- **Constraint Declaration Levels**:\n  - **Column-Level (Inline)**: Declared alongside the column definition. `NOT NULL` must always be declared at column level.\n  - **Table-Level (Out-of-line)**: Declared after all columns are listed. Required for **composite keys** (multi-column constraints).\n- **Composite Primary Keys (Multi-Column Keys)**:\n  - **Definition**: A primary key formed by combining two or more columns to uniquely identify a row (crucial for many-to-many junction tables like `order_items (order_id, item_id)` or `student_courses (student_id, course_id)`).\n  - **Mandatory Table-Level Syntax**: Composite keys **must** be declared at table level:\n    ```sql\n    CREATE TABLE order_items (\n        order_id NUMBER,\n        item_id  NUMBER,\n        quantity NUMBER,\n        CONSTRAINT pk_order_items PRIMARY KEY (order_id, item_id)\n    );\n    ```\n  - **Exam Trap (Column-Level Syntax Failure)**: Attempting to specify `PRIMARY KEY` inline on multiple columns fails immediately:\n    ```sql\n    order_id NUMBER PRIMARY KEY,\n    item_id  NUMBER PRIMARY KEY\n    ```\n    Raises: `ORA-02260: table can have only one primary key`.\n  - **Duplicate Values Rule**: Individual columns *can repeat freely* (e.g., `order_id = 101` can appear 50 times, `item_id = 1` can appear 100 times). Only the composite pair `(order_id, item_id)` must be unique.\n  - **Nullability**: Oracle automatically enforces `NOT NULL` on **all columns** participating in a composite primary key. None of the columns can contain `NULL`.\n  - **Foreign Key Referencing**: Any child table referencing a composite primary key must also declare a composite foreign key matching the exact column count and compatible datatypes in identical order:\n    `FOREIGN KEY (order_id, item_id) REFERENCES order_items(order_id, item_id)`.\n  - **Limit**: An Oracle composite key can span up to a maximum of **32 columns**.\n- **PRIMARY KEY vs. UNIQUE**:\n  | Feature | `PRIMARY KEY` | `UNIQUE` |\n  | :--- | :--- | :--- |\n  | **Count per Table** | Maximum of **one** | **Multiple** allowed |\n  | **Nullability** | Never allows `NULL` (Strictly unique + NOT NULL) | **Allows `NULL`** |\n  | **Underlying Index** | Automatically creates a unique index | Automatically creates a unique index |\n- **The Multiple NULL Rule in UNIQUE**:\n  - In Oracle SQL, two `NULL`s are not considered equal.\n  - Therefore, a `UNIQUE` column permits **multiple rows to contain `NULL`** without triggering a constraint violation error (unless `NOT NULL` is also explicitly specified).\n- **Duplicate Key Violation**: Attempting to insert a duplicate value into a `PRIMARY KEY` or `UNIQUE` column raises: `unique constraint violated`.\n\n## 3. The CHECK Constraint & Prohibited Expressions\n- **Purpose**: Defines conditions that every row must satisfy. A row is allowed if the condition evaluates to `TRUE` or `UNKNOWN` (`NULL`), and rejected only if it evaluates to `FALSE`.\n- **Strict Prohibitions in Oracle**:\n  - **No Subqueries**: Cannot query tables (`subquery not allowed here`).\n  - **No Non-Deterministic / Dynamic Functions**: Cannot reference `SYSDATE`, `CURRENT_DATE`, `SYSTIMESTAMP`, `USER`, `UID`, or `USERENV`.\n    - Violation raises: `date or system variable wrongly specified in CHECK constraint`.\n  - **No Pseudocolumns**: Cannot use `ROWNUM`, `ROWID`, `CURRVAL`, or `NEXTVAL`.\n  - **Single Table Scope**: Can only evaluate columns within the same row of the table where the constraint is defined.\n\n## 4. FOREIGN KEY & Referential Integrity Rules\n- **Purpose**: Links a column in a child table to a `PRIMARY KEY` or `UNIQUE` key column in a parent table.\n- **Child Insert/Update Rule (The Two Legal States)**:\n  - **State 1 (Match Existing Parent Key)**: If a non-null value is inserted or updated, it must already exist in the referenced parent primary/unique key. Inserting an unlisted value (e.g., adding `dept_id = 40` when only `10, 20, 30` exist in parent) raises:\n    `integrity constraint violated - parent key not found`.\n  - **State 2 (NULL Permitted by Default)**: Foreign key columns allow `NULL` values by default (indicating an unassigned or unlinked state, such as a newly hired employee without a department).\n  - **Mandatory Parent Requirement**: To prohibit `NULL` entries in child records, `NOT NULL` must be explicitly declared on the foreign key column (`REFERENCES dept(dept_id) NOT NULL`). Inserting `NULL` then raises: `cannot insert NULL into...`.\n- **Parent Deletion Behaviors**:\n  - **Default (No Action)**: Deletion is blocked if child records exist.\n    - Violation raises: `integrity constraint violated - child record found`.\n  - **`ON DELETE CASCADE`**: Deleting the parent row automatically deletes all matching child rows.\n  - **`ON DELETE SET NULL`**: Deleting the parent row sets the child foreign key column to `NULL` (requires child column to be nullable).\n\n## 5. Modifying Tables & Constraints (ALTER TABLE)\n- **Column Modifications**:\n  - `ADD`: Adds new columns (`ALTER TABLE emp ADD (city VARCHAR2(30));`).\n  - `MODIFY`: Changes column definition (`ALTER TABLE emp MODIFY (city VARCHAR2(50));`).\n    - **Width rule**: Can increase width anytime. Can only decrease width or change datatype if the column is entirely `NULL` across all rows.\n  - **Adding `NOT NULL`**: Because it is a column attribute, it requires `MODIFY` syntax:\n    `ALTER TABLE emp MODIFY (email NOT NULL);`\n  - `DROP COLUMN`: Removes a column permanently (`ALTER TABLE emp DROP COLUMN city;`).\n- **Constraint States & Bulk Loading**:\n  - **`DISABLE CONSTRAINT`**: Temporarily turns off constraint checking.\n    - *Why use it (Bulk Loading)?* When importing millions of rows (batch inserts/migrations), checking constraints row-by-row causes huge performance overhead. Disabling constraints speeds up ingestion and allows parent/child tables to load in any order.\n  - **`ENABLE CONSTRAINT`**: Re-enables the constraint and verifies all existing table data against the rule.\n- **Dropping Referenced Primary Keys**:\n  - Dropping a primary/unique key referenced by active child foreign keys fails with:\n    `this unique/primary key is referenced by some foreign keys`.\n  - Adding **`CASCADE`** (`ALTER TABLE dept DROP PRIMARY KEY CASCADE;`) forces Oracle to drop the primary key and simultaneously drop all dependent child foreign keys.\n\n## 6. Dropping Tables & The Oracle Recycle Bin (DROP TABLE)\n- **Recycle Bin Behavior**:\n  - `DROP TABLE table_name;`: Does not permanently delete data; moves the table to the Oracle Recycle Bin under an internal system name (`BIN$...`).\n  - **Restoring**: Can be restored at any time via:\n    `FLASHBACK TABLE table_name TO BEFORE DROP;`\n  - **Permanent Deletion (`PURGE`)**:\n    - Bypasses the Recycle Bin and immediately releases storage space:\n      `DROP TABLE table_name PURGE;`\n    - To empty the current user's Recycle Bin:\n      `PURGE RECYCLEBIN;`\n- **Dropping Referenced Parent Tables**:\n  - Dropping a table that is referenced by active foreign key constraints in other tables fails with:\n    `unique/primary keys in table referenced by foreign keys`.\n  - **Resolution**: Append **`CASCADE CONSTRAINTS`**:\n    `DROP TABLE table_name CASCADE CONSTRAINTS;`\n    This drops the parent table and automatically deletes all dependent foreign key constraints defined on child tables.\n",
    "examples": {
      "1": [
        {
          "sql": "-- Standard: Character storage: VARCHAR2(size) vs CHAR(size) with blank padding\nSELECT 'ABC' AS var_val, LENGTH('ABC') AS var_len,\n       CAST('ABC' AS CHAR(10)) AS char_val, LENGTH(CAST('ABC' AS CHAR(10))) AS char_len\nFROM dual;",
          "output": "VAR_VAL  VAR_LEN  CHAR_VAL    CHAR_LEN\n-------  -------  ----------  --------\nABC            3  ABC               10\nNote: CHAR(10) pads trailing spaces up to 10 characters."
        },
        {
          "sql": "-- Standard: NUMBER(p, s): Excess fractional digits are automatically rounded to scale (s)\nCREATE TABLE num_demo (amount NUMBER(5, 2));\nINSERT INTO num_demo VALUES (123.456);\nSELECT * FROM num_demo;",
          "output": "Table created.\n1 row created.\n\n    AMOUNT\n----------\n    123.46  (Rounded from 123.456 to 2 decimal places)"
        },
        {
          "sql": "-- Exam Trap: Integer digits exceed (p - s) places; raises error\nINSERT INTO num_demo VALUES (1234.5);\n-- Error: value larger than specified precision allowed for this column",
          "output": "Error: value larger than specified precision allowed for this column\nCause: NUMBER(5, 2) allows max 5 - 2 = 3 integer digits, but 1234 has 4 integer digits."
        }
      ],
      "2": [
        {
          "sql": "-- Standard: PRIMARY KEY and composite key defined at table level (out-of-line)\nCREATE TABLE project_members (\n  project_id  NUMBER(6),\n  employee_id NUMBER(6),\n  role_desc   VARCHAR2(30) NOT NULL,\n  CONSTRAINT pk_proj_member PRIMARY KEY (project_id, employee_id)\n);",
          "output": "Table created.\nNote: Composite keys must be declared at the table level."
        },
        {
          "sql": "-- Exam Trap: Attempting inline PRIMARY KEY on multiple columns fails\nCREATE TABLE order_items (\n  order_id NUMBER PRIMARY KEY,\n  item_id  NUMBER PRIMARY KEY\n);\n-- Error: table can have only one primary key",
          "output": "Error: table can have only one primary key (ORA-02260)\nCause: A table can have only one PRIMARY KEY. Multi-column composite keys must be declared at the table level."
        },
        {
          "sql": "-- Core Rule: UNIQUE permits multiple rows to contain NULL without constraint violation\nCREATE TABLE vendor (\n  vendor_id NUMBER PRIMARY KEY,\n  tax_id    VARCHAR2(20) UNIQUE\n);\nINSERT INTO vendor VALUES (1, NULL);\nINSERT INTO vendor VALUES (2, NULL);  -- Succeeds!",
          "output": "Table created.\n1 row created.\n1 row created.\nNote: In Oracle, two NULLs are not equal, so UNIQUE allows multiple NULL entries."
        },
        {
          "sql": "-- Exam Trap: Duplicate primary key value raises error\nINSERT INTO vendor VALUES (1, 'TAX-999');\n-- Error: unique constraint violated",
          "output": "Error: unique constraint (HR.SYS_C001122) violated\nCause: vendor_id = 1 already exists in the table."
        }
      ],
      "3": [
        {
          "sql": "-- Standard: CHECK constraint validates row criteria (allows TRUE and NULL; rejects FALSE)\nCREATE TABLE staff (\n  staff_id NUMBER PRIMARY KEY,\n  salary   NUMBER CHECK (salary > 0)\n);",
          "output": "Table created."
        },
        {
          "sql": "-- Exam Trap: Subqueries are strictly prohibited in CHECK constraints (raises error)\nALTER TABLE staff ADD CONSTRAINT chk_subq CHECK (salary > (SELECT AVG(salary) FROM employees));\n-- Error: subquery not allowed here",
          "output": "Error: subquery not allowed here\nCause: CHECK constraints can only reference columns within the same row of the current table."
        },
        {
          "sql": "-- Exam Trap: Non-deterministic/system functions like SYSDATE are prohibited in CHECK constraints (raises error)\nALTER TABLE staff ADD CONSTRAINT chk_dt CHECK (hire_date <= SYSDATE);\n-- Error: date or system variable wrongly specified in CHECK constraint",
          "output": "Error: date or system variable wrongly specified in CHECK constraint\nCause: SYSDATE changes continuously, violating the deterministic rule for CHECK constraints."
        }
      ],
      "4": [
        {
          "sql": "-- Exam Trap: Inserting child record without corresponding parent key raises error\nINSERT INTO employees (employee_id, last_name, department_id)\nVALUES (999, 'Test', 9999);\n-- Error: integrity constraint violated - parent key not found",
          "output": "Error: integrity constraint (HR.EMP_DEPT_FK) violated - parent key not found\nCause: department_id = 9999 does not exist in the parent DEPARTMENTS table."
        },
        {
          "sql": "-- Exam Trap: Deleting parent row when active child records exist raises error (default restrict)\nDELETE FROM departments WHERE department_id = 10;\n-- Error: integrity constraint violated - child record found",
          "output": "Error: integrity constraint (HR.EMP_DEPT_FK) violated - child record found\nCause: Employees currently exist assigned to Department 10."
        },
        {
          "sql": "-- Feature: ON DELETE CASCADE automatically removes child records when parent is deleted\nCREATE TABLE order_items (\n  item_id  NUMBER PRIMARY KEY,\n  order_id NUMBER REFERENCES orders(order_id) ON DELETE CASCADE\n);",
          "output": "Table created.\nNote: Deleting an order automatically purges all corresponding order items."
        }
      ],
      "5": [
        {
          "sql": "-- Standard: Adding new columns and modifying existing column widths using ALTER TABLE\nALTER TABLE departments ADD (status VARCHAR2(10));\nALTER TABLE departments MODIFY (status VARCHAR2(25));",
          "output": "Table altered.\nTable altered."
        },
        {
          "sql": "-- Syntax Rule: Adding NOT NULL requires MODIFY clause (NOT NULL is a column-level attribute)\nALTER TABLE departments MODIFY (status NOT NULL);",
          "output": "Table altered."
        },
        {
          "sql": "-- Architecture: Disabling constraints speeds up bulk data loading; ENABLE verifies integrity afterward\nALTER TABLE employees DISABLE CONSTRAINT emp_dept_fk;\n-- (Perform high-speed batch data ingestion here)\nALTER TABLE employees ENABLE CONSTRAINT emp_dept_fk;",
          "output": "Table altered.\nTable altered."
        },
        {
          "sql": "-- Exam Trap: Dropping referenced primary key fails unless CASCADE is specified\nALTER TABLE departments DROP PRIMARY KEY CASCADE;",
          "output": "Table altered.\nNote: CASCADE drops the primary key and simultaneously drops all dependent foreign keys in child tables."
        }
      ],
      "6": [
        {
          "sql": "-- Standard: DROP TABLE moves table to the Oracle Recycle Bin (prefixed with BIN$...)\nDROP TABLE audit_temp;\nSELECT object_name, original_name, type FROM user_recyclebin;",
          "output": "Table dropped.\n\nOBJECT_NAME                    ORIGINAL_NAME  TYPE \n-----------------------------  -------------  -----\nBIN$d9sF3k+8Tg==$0            AUDIT_TEMP     TABLE"
        },
        {
          "sql": "-- Feature: Restoring accidentally dropped table from Recycle Bin\nFLASHBACK TABLE audit_temp TO BEFORE DROP;",
          "output": "Flashback complete."
        },
        {
          "sql": "-- Exam Trap: Dropping parent table referenced by child FKs requires CASCADE CONSTRAINTS; PURGE bypasses bin\nDROP TABLE departments CASCADE CONSTRAINTS PURGE;",
          "output": "Table dropped.\nNote: CASCADE CONSTRAINTS drops foreign key dependencies; PURGE permanently releases disk space."
        }
      ]
    }
  },
  {
    "id": "views_and_other_objects",
    "title": "14. Views & Schema Objects",
    "folder": "views_and_other_objects",
    "content": "# Views and Other Database Objects - Notes\n\n## 1. Simple vs. Complex Views & DML Restrictions\n- **Definition of View**: A virtual or logical table based on an underlying `SELECT` query. It does not store physical data blocks; data is queried dynamically from underlying base tables.\n- **Classification**:\n  | Feature | Simple View | Complex View |\n  | :--- | :--- | :--- |\n  | **Base Tables** | Exactly 1 table | 1 or more tables (joins) |\n  | **Group Functions** | None | Contains `SUM`, `AVG`, `MAX`, `MIN`, `COUNT`, etc. |\n  | **`GROUP BY` / `DISTINCT`** | None | Allowed |\n  | **DML Operations** | Permitted (directly modifies base table) | Heavily restricted or forbidden |\n- **Strict DML Prohibition**:\n  - DML (`INSERT`, `UPDATE`, `DELETE`) is **strictly forbidden** on views containing:\n    1. Group functions\n    2. `GROUP BY` clause\n    3. `DISTINCT` keyword\n  - Violation error:\n    `data manipulation operation not legal on this view`.\n\n## 2. View Integrity Clauses (WITH READ ONLY & WITH CHECK OPTION)\n- **`WITH READ ONLY`**:\n  - Enforces strict read-only access.\n  - Any attempt to run `INSERT`, `UPDATE`, or `DELETE` through the view fails with:\n    `cannot perform a DML operation on a read-only view`.\n- **`WITH CHECK OPTION`**:\n  - Permits DML but ensures that all inserted or modified rows **satisfy the view's WHERE clause condition**.\n  - Prevents rows from falling outside the scope of the view after an update/insert.\n  - Attempting to insert or update a row that violates the view's `WHERE` clause fails with:\n    `view WITH CHECK OPTION where-clause violation`.\n\n## 3. Database Sequences\n- **Purpose**: Independent database object used to automatically generate unique integer numbers (typically surrogate primary keys).\n- **Key Parameters**:\n  - `START WITH <n>`: Initial value to generate.\n  - `INCREMENT BY <n>`: Step interval.\n  - `CACHE <n>` vs. `NOCACHE`: Pre-loads `<n>` values in memory for high-speed retrieval. Default is 20.\n  - `NOCYCLE` vs. `CYCLE`: Halts at `MAXVALUE` (default, throws error) vs. wraps around to `MINVALUE`.\n- **Pseudocolumns**:\n  - `NEXTVAL`: Advances the sequence and returns the next value.\n  - `CURRVAL`: Returns the current value generated by `NEXTVAL` in the **active session**.\n- **The Session Initialization Trap**:\n  - In a new session, referencing `CURRVAL` before invoking `NEXTVAL` at least once raises:\n    `sequence CURRVAL is not yet defined in this session`.\n- **Why Gaps Occur (Sequences are not contiguous)**:\n  - Sequences guarantee uniqueness, never gap-free consecutive numbers.\n  - Common gap causes:\n    1. **Rollback**: Fetching `NEXTVAL` and rolling back does not return the number to the sequence.\n    2. **Database Restart / Crash**: Unused sequence numbers cached in memory (`CACHE`) are lost.\n    3. **Multiple Tables**: Using the same sequence across different tables.\n\n## 4. Database Indexes & Index Suppression\n- **Purpose**: Schema objects that speed up data retrieval by providing direct pointers to row locations (ROWID), reducing disk I/O.\n- **Index Types**:\n  - **B-Tree Index (Default)**:\n    - Ideal for **high-cardinality** columns (columns with many unique values, e.g., `employee_id`, `email`, `last_name`).\n    - Standard tree structure (Root, Branches, Leaves).\n  - **Bitmap Index**:\n    - Ideal for **low-cardinality** columns (columns with few distinct values, e.g., `gender`, `marital_status`, `status`).\n    - Great for read-heavy Data Warehouses; strictly avoided in OLTP because row updates lock the whole bitmap index segment.\n- **Index Suppression by Functions (Exam Trap)**:\n  - If a function or calculation is applied to an indexed column in the `WHERE` clause (e.g., `WHERE TO_CHAR(hire_date, 'YYYY') = '2020'` or `WHERE UPPER(col) = 'VAL'`), Oracle **cannot use the standard B-Tree index** and falls back to a **Full Table Scan (FTS)**.\n  - **Remedy**: Create a **Function-Based Index** matching the exact expression:\n    `CREATE INDEX idx_emp_hire_yr ON employees(TO_CHAR(hire_date, 'YYYY'));`\n\n## 5. Database Synonyms & Name Resolution Order\n- **Purpose**: An alias or alternate name for an underlying database object (table, view, sequence, procedure, package).\n  - Masks physical location and schema owner.\n  - Simplifies query statements by removing schema qualifiers (`hr.`).\n  - **Security Rule**: Synonyms do **not** grant permissions; privileges must still be explicitly granted on the underlying object.\n- **Types**:\n  - **Private Synonym**: Visible and accessible strictly within the creator's schema (`CREATE SYNONYM syn_name FOR schema.object;`).\n  - **Public Synonym**: Accessible to all database users (`CREATE PUBLIC SYNONYM syn_name FOR schema.object;`).\n- **Oracle Object Name Resolution Order**:\n  When an unqualified object name is queried (e.g., `SELECT * FROM table_name`), Oracle searches in this exact order:\n  1. **Local Object**: An object directly owned by the querying user in their schema.\n  2. **Private Synonym**: A private synonym defined in the user's schema.\n  3. **Public Synonym**: A database-wide public synonym.\n  4. If not resolved: `table or view does not exist`.\n",
    "examples": {
      "1": [
        {
          "sql": "-- Standard: Simple view (1 table, no group functions, no GROUP BY) permits DML\nCREATE VIEW emp_v10 AS\nSELECT employee_id, first_name, salary, department_id\nFROM employees\nWHERE department_id = 10;\nUPDATE emp_v10 SET salary = salary + 100 WHERE employee_id = 200;",
          "output": "View created.\n1 row updated.\nNote: Simple view DML directly modifies the underlying EMPLOYEES base table."
        },
        {
          "sql": "-- Exam Trap: DML is strictly prohibited on views containing GROUP BY, aggregates, or DISTINCT (raises error)\nCREATE VIEW dept_sal_summary AS\nSELECT department_id, AVG(salary) AS avg_sal\nFROM employees\nGROUP BY department_id;\nDELETE FROM dept_sal_summary WHERE department_id = 10;\n-- Error: data manipulation operation not legal on this view",
          "output": "View created.\nError: data manipulation operation not legal on this view\nCause: Views containing GROUP BY or aggregate functions cannot undergo DML."
        }
      ],
      "2": [
        {
          "sql": "-- Feature: WITH READ ONLY blocks all DML through the view (raises error)\nCREATE VIEW v_secure_emp AS\nSELECT employee_id, last_name, salary FROM employees\nWITH READ ONLY;\nDELETE FROM v_secure_emp WHERE employee_id = 100;\n-- Error: cannot perform a DML operation on a read-only view",
          "output": "View created.\nError: cannot perform a DML operation on a read-only view\nCause: WITH READ ONLY prevents any INSERT, UPDATE, or DELETE through the view."
        },
        {
          "sql": "-- Exam Trap: WITH CHECK OPTION prevents DML from violating the view's WHERE clause (raises error)\nCREATE VIEW v_dept20 AS\nSELECT employee_id, last_name, department_id FROM employees WHERE department_id = 20\nWITH CHECK OPTION;\nUPDATE v_dept20 SET department_id = 30 WHERE employee_id = 201;\n-- Error: view WITH CHECK OPTION where-clause violation",
          "output": "View created.\nError: view WITH CHECK OPTION where-clause violation\nCause: Attempting to move the employee to Dept 30 would remove the row from the view's scope."
        }
      ],
      "3": [
        {
          "sql": "-- Standard: Sequences generate unique integers for surrogate primary keys\nCREATE SEQUENCE order_seq START WITH 1000 INCREMENT BY 1;\nSELECT order_seq.NEXTVAL, order_seq.CURRVAL FROM dual;",
          "output": "Sequence created.\n\n   NEXTVAL    CURRVAL\n----------  ---------\n      1000       1000"
        },
        {
          "sql": "-- Exam Trap: Referencing CURRVAL before NEXTVAL in a new session raises error\nSELECT order_seq.CURRVAL FROM dual;\n-- Error: sequence ORDER_SEQ.CURRVAL is not yet defined in this session",
          "output": "Error: sequence ORDER_SEQ.CURRVAL is not yet defined in this session\nCause: CURRVAL is session-specific and cannot be read until NEXTVAL is invoked in that session."
        },
        {
          "sql": "-- Architecture: Sequences guarantee uniqueness, NOT contiguous numbers (gaps occur on rollback)\nINSERT INTO orders (order_id) VALUES (order_seq.NEXTVAL);  -- Takes 1001\nROLLBACK;  -- 1001 is lost forever; next insert gets 1002!",
          "output": "1 row created.\nRollback complete.\nNote: Rolling back a transaction never rolls back a sequence generator."
        }
      ],
      "4": [
        {
          "sql": "-- Standard: B-Tree index speeds up equality and range lookups on high-cardinality columns\nCREATE INDEX idx_emp_lname ON employees(last_name);\nSELECT * FROM employees WHERE last_name = 'King';",
          "output": "Index created.\n(Oracle optimizer uses INDEX RANGE SCAN via ROWID instead of Full Table Scan)"
        },
        {
          "sql": "-- Exam Trap: Applying a function or calculation to an indexed column suppresses the B-Tree index\nSELECT * FROM employees WHERE UPPER(last_name) = 'KING';  -- Suppresses idx_emp_lname!",
          "output": "Note: B-Tree index is ignored; Oracle falls back to Full Table Scan (FTS)."
        },
        {
          "sql": "-- Remedy: Create a Function-Based Index matching the exact expression\nCREATE INDEX idx_emp_upper_lname ON employees(UPPER(last_name));\nSELECT * FROM employees WHERE UPPER(last_name) = 'KING';",
          "output": "Index created.\n(Oracle optimizer now successfully uses Function-Based Index SCAN)"
        }
      ],
      "5": [
        {
          "sql": "-- Standard: Synonyms provide aliases for objects to mask ownership and simplify SQL\nCREATE SYNONYM emp FOR hr.employees;\nSELECT employee_id, last_name FROM emp WHERE employee_id = 100;",
          "output": "Synonym created.\n\nEMPLOYEE_ID  LAST_NAME\n-----------  ---------\n        100  King     "
        },
        {
          "sql": "-- Architecture: 4-Step Name Resolution Order (Local Object -> Private Synonym -> Public Synonym -> Error)\nSELECT * FROM non_existent_table;\n-- Error: table or view does not exist",
          "output": "Error: table or view does not exist\nOrder: 1. User Schema Object -> 2. Private Synonym -> 3. Public Synonym -> 4. Error."
        }
      ]
    }
  },
  {
    "id": "advanced_sql",
    "title": "15. Advanced SQL (Window Functions)",
    "folder": "advanced_sql",
    "content": "# Advanced SQL & Analytic Functions - Notes\n\n## 1. Ranking Functions: ROW_NUMBER vs. RANK vs. DENSE_RANK\n- **Analytic Function Behavior**: Computes an aggregate, rank, or offset over a window of rows while **retaining every individual record in the result set** (unlike `GROUP BY` which collapses rows).\n- **Core Syntax**:\n  ```sql\n  RANK() OVER (ORDER BY salary DESC)\n  ```\n- **Comparison Table**:\n  | Function | Behavior on Ties | Subsequent Numbering (Gaps) | Example Output for (10k, 8k, 8k, 6k) |\n  | :--- | :--- | :--- | :--- |\n  | **`ROW_NUMBER()`**| Sequential (arbitrary on ties) | No duplicates, strictly no gaps | `1, 2, 3, 4` |\n  | **`RANK()`** | Same rank for identical values | **Skips ranks (Leaves gaps)** | `1, 2, 2, 4` |\n  | **`DENSE_RANK()`**| Same rank for identical values | **No skipping (No gaps)** | `1, 2, 2, 3` |\n- **Exam Classic (N-th Highest Value)**:\n  - When finding the N-th highest salary, **`DENSE_RANK()`** is standard because it handles ties without skipping rank numbers.\n\n## 2. PARTITION BY & The SQL Execution Order Filter Trap\n- **`PARTITION BY`**:\n  - Divides the window into independent subsets (e.g., department, job category).\n  - The function calculation resets to its starting value for each partition.\n  - Syntax: `DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC)`.\n- **The SQL Execution Order**:\n  1. `FROM`\n  2. `WHERE`\n  3. `GROUP BY`\n  4. `HAVING`\n  5. `SELECT` *(Analytic functions and column aliases are evaluated here)*\n  6. `ORDER BY`\n- **Why Window Functions Fail in WHERE**:\n  - Because `WHERE` executes (Step 2) before `SELECT` (Step 5), window functions and aliases do not exist yet when `WHERE` is filtering.\n  - Placing window functions directly in `WHERE` raises:\n    `window functions are not allowed here`.\n  - Using a `SELECT` alias in `WHERE` raises:\n    `\"ALIAS_NAME\": invalid identifier`.\n- **The Standard Solution (Inline View / Subquery)**:\n  - Evaluate the window function in an inner query `FROM (...)`, then filter against the assigned alias in the outer `WHERE` clause.\n\n## 3. Positional Navigation Functions: LEAD & LAG\n- **Purpose**: Access values from preceding (`LAG`) or succeeding (`LEAD`) rows within the same result set without self-joins.\n- **Syntax**:\n  ```sql\n  LAG(column, [offset], [default]) OVER ([PARTITION BY ...] ORDER BY ...)\n  LEAD(column, [offset], [default]) OVER ([PARTITION BY ...] ORDER BY ...)\n  ```\n- **Parameter Rules**:\n  - `offset` *(optional, default = 1)*: Number of rows forward or backward.\n  - `default` *(optional, default = NULL)*: Fallback value when offset reaches outside the partition/table boundary.\n  - Example: First row with `LAG(..., 1, 0)` returns `0`. Last row with `LEAD(..., 1)` returns `NULL`.\n- **Primary Use Cases**:\n  - Month-over-month comparisons (e.g., current month revenue vs. previous month revenue).\n  - Difference calculations between consecutive records.\n\n## 4. Aggregate Window Functions & Framing (Grand vs. Running Totals)\n- **Concept**: Turning standard aggregates (`SUM`, `AVG`, `COUNT`, `MIN`, `MAX`) into analytic window functions using `OVER (...)` (they are not limited to ranking functions).\n- **Default Framing Rules**:\n  - **`OVER ()` (No ORDER BY clause)**:\n    - Default Window Frame: `RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING`.\n    - Computes the **Grand Total** across the entire table.\n    - Every row shows its individual value alongside the identical overall sum.\n  - **`OVER (PARTITION BY ...)` (Group Total Without Collapsing Rows)**:\n    - Computes the aggregate per partition/group (e.g., `SUM(salary) OVER (PARTITION BY dept_id)`), keeping every individual row.\n  - **`OVER (ORDER BY ...)`**:\n    - Default Window Frame: `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`.\n    - Automatically computes a **Cumulative Running Total** from the first row up to the current row (or per partition with `OVER (PARTITION BY ... ORDER BY ...)`).\n- **Combining with Math & Single-Row Functions (`ROUND`, `% Share`)**:\n  - Window functions can be used directly inside arithmetic and scalar functions like `ROUND((amount / SUM(amount) OVER (PARTITION BY dept_id)) * 100, 2)`.\n  - **Sibling Alias Rule**: You cannot reference a column alias defined in the same `SELECT` list inside another `SELECT` expression (repeat the `OVER (...)` expression instead).\n- **Example Comparison (Row 2 of salaries 1000, 2000, 3000)**:\n  - `SUM(salary) OVER ()` → `6000` (Grand total).\n  - `SUM(salary) OVER (PARTITION BY dept_id)` → Department total for that row's `dept_id`.\n  - `SUM(salary) OVER (ORDER BY salary)` → `3000` (Running total: 1000 + 2000).\n",
    "examples": {
      "1": [
        {
          "sql": "-- Core Comparison: ROW_NUMBER vs RANK vs DENSE_RANK on identical salaries\n-- Test data: King (24k), Kochhar (17k), De Haan (17k), Russell (14k)\nSELECT last_name, salary,\n       ROW_NUMBER() OVER (ORDER BY salary DESC) AS row_num,\n       RANK()       OVER (ORDER BY salary DESC) AS rnk,\n       DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rnk\nFROM employees\nWHERE employee_id IN (100, 101, 102, 145);",
          "output": "LAST_NAME      SALARY  ROW_NUM  RNK  DENSE_RNK\n------------  -------  -------  ---  ---------\nKing            24000        1    1          1\nKochhar         17000        2    2          2  (Tie)\nDe Haan         17000        3    2          2  (Tie)\nRussell         14000        4    4          3  (RANK skips 3; DENSE_RANK does not)"
        },
        {
          "sql": "-- Exam Classic: Finding the N-th highest salary requires DENSE_RANK to handle ties properly\nSELECT salary FROM (\n  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk\n  FROM employees\n) WHERE rnk = 2 AND ROWNUM = 1;",
          "output": "    SALARY\n----------\n     17000\nNote: 2nd highest distinct salary is 17000 (even though 2 employees share it)."
        },
        {
          "sql": "-- Feature: ROW_NUMBER strictly generates sequential integers without ties or gaps\nSELECT employee_id, salary,\n       ROW_NUMBER() OVER (ORDER BY salary DESC) AS seq_id\nFROM employees\nWHERE department_id = 90;",
          "output": "EMPLOYEE_ID  SALARY  SEQ_ID\n-----------  ------  ------\n        100   24000       1\n        101   17000       2\n        102   17000       3"
        }
      ],
      "2": [
        {
          "sql": "-- Standard: PARTITION BY divides window into independent subsets; rank resets per group\nSELECT department_id, last_name, salary,\n       DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS dept_rank\nFROM employees\nWHERE department_id IN (10, 20, 90)\nORDER BY department_id, dept_rank;",
          "output": "DEPARTMENT_ID  LAST_NAME  SALARY  DEPT_RANK\n-------------  ---------  ------  ---------\n           10  Whalen       4400          1\n           20  Hartstein   13000          1\n           20  Fay          6000          2\n           90  King        24000          1\n           90  Kochhar     17000          2\n           90  De Haan     17000          2"
        },
        {
          "sql": "-- Exam Trap: Analytic functions directly inside WHERE clause raise Error (WHERE runs before SELECT!)\nSELECT last_name, salary\nFROM employees\nWHERE DENSE_RANK() OVER (ORDER BY salary DESC) = 1;\n-- Error: window functions are not allowed here",
          "output": "Error: window functions are not allowed here\nCause: Execution order is FROM -> WHERE -> GROUP BY -> HAVING -> SELECT (Analytics evaluated in SELECT)."
        },
        {
          "sql": "-- Solution: Wrap analytic calculation inside an Inline View and filter in the outer WHERE clause\nSELECT last_name, salary, dept_rank\nFROM (\n  SELECT last_name, salary,\n         DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS dept_rank\n  FROM employees\n  WHERE department_id = 90\n)\nWHERE dept_rank = 1;",
          "output": "LAST_NAME  SALARY  DEPT_RANK\n---------  ------  ---------\nKing        24000          1"
        }
      ],
      "3": [
        {
          "sql": "-- Standard: LAG retrieves preceding row value; LEAD retrieves succeeding row value (default offset = 1)\nSELECT employee_id, salary,\n       LAG(salary, 1)  OVER (ORDER BY salary) AS prev_sal,\n       LEAD(salary, 1) OVER (ORDER BY salary) AS next_sal\nFROM employees\nWHERE department_id = 90\nORDER BY salary;",
          "output": "EMPLOYEE_ID  SALARY  PREV_SAL  NEXT_SAL\n-----------  ------  --------  --------\n        101   17000    <NULL>     17000\n        102   17000     17000     24000\n        100   24000     17000    <NULL>"
        },
        {
          "sql": "-- Feature: Custom offset and default fallback value when reaching table/partition boundaries\nSELECT employee_id, salary,\n       LAG(salary, 1, 0) OVER (ORDER BY salary) AS safe_prev_sal\nFROM employees\nWHERE department_id = 90\nORDER BY salary;",
          "output": "EMPLOYEE_ID  SALARY  SAFE_PREV_SAL\n-----------  ------  -------------\n        101   17000              0  (Fallback 0 instead of NULL)\n        102   17000          17000\n        100   24000          17000"
        },
        {
          "sql": "-- Practical Pattern: Calculating difference between current row and preceding row\nSELECT employee_id, salary,\n       salary - LAG(salary, 1, salary) OVER (ORDER BY salary) AS sal_step\nFROM employees\nWHERE department_id = 90\nORDER BY salary;",
          "output": "EMPLOYEE_ID  SALARY  SAL_STEP\n-----------  ------  --------\n        101   17000         0\n        102   17000         0\n        100   24000      7000"
        }
      ],
      "4": [
        {
          "sql": "-- Core Comparison: OVER () computes Grand Total; OVER (ORDER BY ...) computes Cumulative Running Total\nSELECT last_name, salary,\n       SUM(salary) OVER () AS grand_total,\n       SUM(salary) OVER (ORDER BY salary) AS running_total\nFROM employees\nWHERE department_id = 90\nORDER BY salary;",
          "output": "LAST_NAME  SALARY  GRAND_TOTAL  RUNNING_TOTAL\n---------  ------  -----------  -------------\nKochhar     17000        58000          34000  (17k + 17k tie computed together)\nDe Haan     17000        58000          34000\nKing        24000        58000          58000  (34k + 24k = 58k)"
        },
        {
          "sql": "-- Practical Pattern: Computing an employee's percentage contribution to the grand total\nSELECT last_name, salary,\n       ROUND((salary / SUM(salary) OVER ()) * 100, 2) AS pct_of_dept\nFROM employees\nWHERE department_id = 90\nORDER BY salary DESC;",
          "output": "LAST_NAME  SALARY  PCT_OF_DEPT\n---------  ------  -----------\nSteven      24000        41.38\nNeena       17000        29.31\nLex         17000        29.31"
        },
        {
          "sql": "-- Partition Running Total: Running total that restarts at each department partition\nSELECT department_id, last_name, salary,\n       SUM(salary) OVER (PARTITION BY department_id ORDER BY salary) AS dept_running_total\nFROM employees\nWHERE department_id IN (10, 20)\nORDER BY department_id, salary;",
          "output": "DEPARTMENT_ID  LAST_NAME  SALARY  DEPT_RUNNING_TOTAL\n-------------  ---------  ------  ------------------\n           10  Whalen       4400                4400\n           20  Fay          6000                6000\n           20  Hartstein   13000               19000"
        }
      ]
    }
  }
];