// Dedicated High-Yield Practical SQL Examples for Deloitte Stage Gate Preparation
// Only for website display; keeps NOTES.md pure theory & concepts.

module.exports = {
  select_statement: [
    {
      title: "1. Safe Arithmetic with NVL and Custom Column Aliasing",
      sql: `-- Calculate total monthly compensation, safeguarding against NULL commissions
SELECT first_name || ' ' || last_name AS full_name,
       salary,
       NVL(commission_pct, 0) AS comm_rate,
       salary + (salary * NVL(commission_pct, 0)) AS "Total Monthly Pay"
FROM employees
WHERE department_id = 80;`,
      explanation: "Without NVL(), any employee with NULL commission would have their entire total pay calculate to NULL. Double quotes on \"Total Monthly Pay\" preserve exact capitalization and spacing in the output header."
    },
    {
      title: "2. Complex String Concatenation with Literal Text",
      sql: `-- Format an executive personnel summary badge
SELECT employee_id || ': ' || first_name || ' ' || last_name || 
       ' works in Dept #' || NVL(TO_CHAR(department_id), 'Unassigned') AS employee_profile
FROM employees
WHERE salary > 10000;`,
      explanation: "Uses the pipe operator (||) to chain column values and literal text enclosed in single quotes. Safely handles NULL department IDs using NVL with TO_CHAR."
    },
    {
      title: "3. Evaluating Math & System Expressions via DUAL",
      sql: `-- Evaluate standalone system values, date calculations, and math expressions
SELECT SYSDATE AS current_db_time,
       USER AS current_user,
       POWER(2, 10) AS kilobyte_multiplier,
       ROUND(1234.5678, 2) AS formatted_num
FROM dual;`,
      explanation: "Oracle strictly requires a FROM clause in every SELECT statement. The built-in 1-row table DUAL is used to evaluate scalar functions, math, and system pseudo-columns without querying user tables."
    },
    {
      title: "4. Multi-Column Duplicate Elimination with DISTINCT",
      sql: `-- Identify all unique combinations of department and job roles currently active
SELECT DISTINCT department_id, job_id
FROM employees
WHERE department_id IS NOT NULL
ORDER BY department_id, job_id;`,
      explanation: "DISTINCT applies to the entire combination of selected columns (department_id + job_id tuple), not just the first column. Must appear immediately following the SELECT keyword."
    }
  ],

  where_clause: [
    {
      title: "1. Case-Sensitive Text & Date Literal Filtering",
      sql: `-- Filter records with strict case-matching and standard Oracle date format
SELECT employee_id, first_name, job_id, hire_date
FROM employees
WHERE job_id = 'IT_PROG'
  AND hire_date >= '01-JAN-2020';`,
      explanation: "Text literals like 'IT_PROG' are strictly case-sensitive in Oracle. Single quotes are mandatory; double quotes would cause ORA-00904 (invalid identifier)."
    },
    {
      title: "2. Enforcing Operator Precedence with Parentheses (AND / OR)",
      sql: `-- Select high-earning sales reps OR any employee in IT with salary > 8000
SELECT first_name, job_id, salary
FROM employees
WHERE (job_id = 'SA_REP' OR job_id = 'IT_PROG')
  AND salary > 8000;`,
      explanation: "AND has higher precedence than OR. Without parentheses, Oracle would evaluate (job_id = 'IT_PROG' AND salary > 8000) first, returning all SA_REP rows regardless of salary."
    },
    {
      title: "3. Inclusive Range Filtering with BETWEEN ... AND ...",
      sql: `-- Filter salaries between 5,000 and 12,000 (inclusive boundaries)
SELECT employee_id, first_name, salary
FROM employees
WHERE salary BETWEEN 5000 AND 12000
ORDER BY salary ASC;`,
      explanation: "BETWEEN is inclusive (salary >= 5000 AND salary <= 12000). The smaller boundary must always come first; specifying 'BETWEEN 12000 AND 5000' produces zero rows without error."
    },
    {
      title: "4. Pattern Matching with LIKE & NULL Safeguards",
      sql: `-- Find employees whose name has 'a' as 2nd letter and has an assigned manager
SELECT employee_id, first_name, manager_id
FROM employees
WHERE first_name LIKE '_a%'
  AND manager_id IS NOT NULL;`,
      explanation: "Underscore (_) matches exactly one character, while percent (%) matches 0 or more characters. IS NOT NULL correctly checks for existing managers (writing '= NULL' returns 0 rows)."
    }
  ],

  order_by_clause: [
    {
      title: "1. Multi-Column Sorting with Opposing Directions",
      sql: `-- Sort departments descending by budget, then employees ascending by salary
SELECT department_id, last_name, salary
FROM employees
WHERE department_id IN (50, 80, 90)
ORDER BY department_id DESC, salary ASC;`,
      explanation: "Evaluates left to right: first groups rows by department in descending order (90, 80, 50). When ties occur within a department, rows are sorted by salary ascending."
    },
    {
      title: "2. Sorting by SELECT Column Alias",
      sql: `-- Calculate annual bonus and sort directly by the computed alias name
SELECT first_name, 
       salary, 
       salary * 12 * 0.15 AS annual_bonus
FROM employees
ORDER BY annual_bonus DESC;`,
      explanation: "Valid in Oracle because ORDER BY executes after the SELECT clause in SQL logical execution order. (Note: using annual_bonus in WHERE would raise ORA-00904)."
    },
    {
      title: "3. Positional Sorting by Column Index",
      sql: `-- Sort by the 3rd and 1st expressions in the SELECT projection
SELECT department_id, first_name, hire_date
FROM employees
WHERE department_id IS NOT NULL
ORDER BY 3 DESC, 1 ASC;`,
      explanation: "1-based positional indexing sorts by hire_date (column 3) newest first, then by department_id (column 1). Useful in set operations or long expressions."
    },
    {
      title: "4. Explicit NULL Ranking (NULLS FIRST / NULLS LAST)",
      sql: `-- Display highest commission earners first, pushing NULL commissions to bottom
SELECT first_name, salary, commission_pct
FROM employees
ORDER BY commission_pct DESC NULLS LAST;`,
      explanation: "In Oracle, NULLs rank highest by default in ascending/descending order. 'NULLS LAST' explicitly overrides default ranking, placing employees without commission at the end."
    }
  ],

  character_functions: [
    {
      title: "1. Case-Insensitive Search using UPPER and LOWER",
      sql: `-- Match user email regardless of whether input is lowercase, uppercase, or mixed
SELECT employee_id, first_name, email
FROM employees
WHERE UPPER(email) = UPPER('sking');`,
      explanation: "Normalizes both the database column and search term to uppercase, bypassing Oracle's default case sensitivity without modifying underlying table data."
    },
    {
      title: "2. Extracting Trailing Characters with SUBSTR Negative Offset",
      sql: `-- Extract the last 4 characters of a telephone number
SELECT first_name, 
       phone_number,
       SUBSTR(phone_number, -4) AS last_four_digits
FROM employees
WHERE phone_number IS NOT NULL;`,
      explanation: "A negative start position in SUBSTR(-4) instructs Oracle to count backwards from the end of the string. Omitting the 3rd parameter extracts through the end."
    },
    {
      title: "3. Locating Character Positions with INSTR",
      sql: `-- Extract the username portion before the '@' symbol from email
SELECT email,
       INSTR(email, '@') AS at_position,
       SUBSTR(email, 1, INSTR(email, '@') - 1) AS username
FROM employees
WHERE email LIKE '%@%';`,
      explanation: "INSTR finds the 1-based index of '@'. Subtracting 1 provides the exact length parameter for SUBSTR to extract the username prefix."
    },
    {
      title: "4. Padding and Trimming Formats with LPAD and TRIM",
      sql: `-- Format employee IDs with leading zeros and strip trailing whitespace
SELECT LPAD(TO_CHAR(employee_id), 6, '0') AS padded_emp_id,
       TRIM(BOTH ' ' FROM first_name) AS clean_name
FROM employees;`,
      explanation: "LPAD fills the left side up to 6 total characters with '0' (e.g., 100 becomes 000100). TRIM removes extra whitespace padding from both ends."
    }
  ],

  numeric_functions: [
    {
      title: "1. Decimal and Whole Place Rounding with ROUND",
      sql: `-- Round to 2 decimals, whole integer, and nearest hundred (-2)
SELECT 1458.765 AS original_val,
       ROUND(1458.765, 2) AS round_two_dec,
       ROUND(1458.765, 0) AS round_whole,
       ROUND(1458.765, -2) AS round_hundred
FROM dual;`,
      explanation: "Positive index rounds right of decimal. Zero rounds to nearest integer (1459). Negative index (-2) evaluates tens digit (5) to round to nearest hundred (1500)."
    },
    {
      title: "2. Precision Truncation with TRUNC",
      sql: `-- Cut off digits without mathematical rounding
SELECT 1458.765 AS original_val,
       TRUNC(1458.765, 2) AS trunc_two_dec,
       TRUNC(1458.765, -2) AS trunc_hundred
FROM dual;`,
      explanation: "TRUNC strictly chops digits without rounding up. TRUNC(1458.765, 2) outputs 1458.76. TRUNC(1458.765, -2) replaces tens and units with zero, yielding 1400."
    },
    {
      title: "3. Odd / Even Batch Processing with MOD",
      sql: `-- Filter alternating records for parallel batch workload distribution
SELECT employee_id, first_name, salary
FROM employees
WHERE MOD(employee_id, 2) = 1; -- Selects odd employee IDs`,
      explanation: "MOD(m, n) returns the remainder of m divided by n. MOD(id, 2) = 0 filters even records; MOD(id, 2) = 1 filters odd records."
    },
    {
      title: "4. Ceiling and Floor Integer Boundaries",
      sql: `-- Calculate minimum shipping boxes needed (1 box per 12 items)
SELECT 25 AS total_items,
       CEIL(25 / 12) AS boxes_needed,
       FLOOR(25 / 12) AS full_boxes_only
FROM dual;`,
      explanation: "25 / 12 = 2.083. CEIL rounds UP to nearest integer (3 boxes needed to fit all items). FLOOR rounds DOWN to nearest integer (2 completely filled boxes)."
    }
  ],

  date_functions: [
    {
      title: "1. Day & Fractional Hour Arithmetic with SYSDATE",
      sql: `-- Calculate future deadlines with days, hours, and minutes
SELECT SYSDATE AS current_time,
       SYSDATE + 7 AS one_week_later,
       SYSDATE + (12 / 24) AS twelve_hours_later,
       SYSDATE + (30 / 1440) AS thirty_mins_later
FROM dual;`,
      explanation: "In Oracle, date arithmetic uses integer days. Adding (12/24) adds half a day (12 hours). Adding (30/1440) adds 30 minutes (1440 minutes in a day)."
    },
    {
      title: "2. Tenure & Month Differences with MONTHS_BETWEEN",
      sql: `-- Calculate employee tenure in exact years and months
SELECT first_name, 
       hire_date,
       ROUND(MONTHS_BETWEEN(SYSDATE, hire_date), 1) AS months_served,
       TRUNC(MONTHS_BETWEEN(SYSDATE, hire_date) / 12) AS complete_years
FROM employees
WHERE department_id = 90;`,
      explanation: "MONTHS_BETWEEN(date1, date2) subtracts date2 from date1. If date1 is more recent, the result is positive. Dividing by 12 and truncating gives completed years of service."
    },
    {
      title: "3. Stepping Calendar Months with ADD_MONTHS",
      sql: `-- Project 6-month probation and annual review dates
SELECT first_name, 
       hire_date,
       ADD_MONTHS(hire_date, 6) AS probation_end,
       ADD_MONTHS(hire_date, 12) AS one_year_review
FROM employees
WHERE hire_date >= '01-JAN-2022';`,
      explanation: "ADD_MONTHS preserves day-of-month where possible. If the starting date is on the last day of the month (e.g. Feb 28), it snaps to the last day of the target month (Aug 31)."
    },
    {
      title: "4. Weekday Lookups & Month Truncation",
      sql: `-- Find next pay-cycle Friday and snap date to first of current month
SELECT SYSDATE,
       NEXT_DAY(SYSDATE, 'FRIDAY') AS next_payday,
       LAST_DAY(SYSDATE) AS month_end,
       TRUNC(SYSDATE, 'MONTH') AS first_day_of_month
FROM dual;`,
      explanation: "NEXT_DAY locates the next specified calendar day. LAST_DAY returns the month's final date. TRUNC(date, 'MONTH') resets the day to 01 and time to 00:00:00."
    }
  ],

  conversion_functions: [
    {
      title: "1. Rich Date Formatting with TO_CHAR",
      sql: `-- Format database dates for business executive presentation
SELECT first_name,
       TO_CHAR(hire_date, 'FMDDth "of" Month, YYYY') AS readable_hire_date,
       TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS') AS timestamp_iso
FROM employees
WHERE ROWNUM <= 5;`,
      explanation: "FM (Fill Mode) suppresses extra trailing padding in month names and leading zeros. Quoted text inside format models like \"of\" appears literally in output."
    },
    {
      title: "2. Safe String-to-Date Conversion with RR Century Window",
      sql: `-- Safely parse 2-digit historical and modern year strings
SELECT TO_DATE('15-OCT-95', 'DD-MON-RR') AS resolved_1995,
       TO_DATE('15-OCT-24', 'DD-MON-RR') AS resolved_2024
FROM dual;`,
      explanation: "Using 'RR' with current year 2026 resolves years 50-99 to the 1900s (1995), and years 00-49 to the 2000s (2024). 'YY' would have resolved both to the 2000s."
    },
    {
      title: "3. Currency Formatting with TO_CHAR and Number Parsing",
      sql: `-- Format numbers as localized currency strings and parse them back
SELECT TO_CHAR(24500.50, '$999,999.00') AS formatted_currency,
       TO_NUMBER('$24,500.50', '$999,999.00') AS parsed_number
FROM dual;`,
      explanation: "TO_CHAR adds currency symbols, commas, and fixed decimals. TO_NUMBER parses formatted strings back into raw database numbers when provided matching format masks."
    },
    {
      title: "4. Multi-Stage Fallback with COALESCE and CASE",
      sql: `-- Determine primary contact method and map salary grades
SELECT first_name,
       COALESCE(phone_number, email, 'No Contact Listed') AS primary_contact,
       CASE 
         WHEN salary >= 15000 THEN 'Executive Tier'
         WHEN salary >= 8000  THEN 'Mid-Level Tier'
         ELSE 'Entry Tier'
       END AS pay_grade
FROM employees;`,
      explanation: "COALESCE returns the first non-NULL expression from left to right. CASE provides clean conditional evaluation; mandatory END completes the expression."
    }
  ],

  group_functions: [
    {
      title: "1. Standard Aggregates & NULL Handling with NVL",
      sql: `-- Compare raw aggregate average vs NVL-adjusted average
SELECT COUNT(*) AS total_rows,
       COUNT(commission_pct) AS non_null_comm_rows,
       ROUND(AVG(commission_pct), 4) AS avg_non_null_only,
       ROUND(AVG(NVL(commission_pct, 0)), 4) AS avg_across_all_staff
FROM employees;`,
      explanation: "Standard group functions automatically ignore NULLs. AVG(commission_pct) divides sum only by rows with commission. Wrapping with NVL includes all employees in the average denominator."
    },
    {
      title: "2. Departmental Aggregations with GROUP BY",
      sql: `-- Compute workforce statistics grouped by department
SELECT department_id,
       COUNT(*) AS head_count,
       MIN(salary) AS min_pay,
       MAX(salary) AS max_pay,
       ROUND(AVG(salary), 2) AS avg_pay
FROM employees
WHERE department_id IS NOT NULL
GROUP BY department_id
ORDER BY head_count DESC;`,
      explanation: "Golden Rule: Every unaggregated column in the SELECT list (department_id) MUST be included in the GROUP BY clause, or Oracle raises ORA-00937."
    },
    {
      title: "3. Group Filtering with HAVING vs WHERE",
      sql: `-- Filter individual rows first (WHERE), then filter grouped results (HAVING)
SELECT department_id, 
       ROUND(AVG(salary), 2) AS dept_avg_salary
FROM employees
WHERE salary > 3000 -- Row filter: excludes low earners before grouping
GROUP BY department_id
HAVING AVG(salary) > 8000 -- Group filter: only shows departments with high avg
ORDER BY dept_avg_salary DESC;`,
      explanation: "WHERE filters rows before aggregation. HAVING filters grouped rows after aggregation. Group functions are strictly forbidden in WHERE (ORA-00934)."
    },
    {
      title: "4. Unique Value Counting with COUNT(DISTINCT)",
      sql: `-- Count total orders vs distinct customers who placed orders
SELECT department_id,
       COUNT(job_id) AS total_jobs_assigned,
       COUNT(DISTINCT job_id) AS unique_roles_in_dept
FROM employees
GROUP BY department_id;`,
      explanation: "COUNT(DISTINCT col) filters out duplicates within each group before counting, returning the number of distinct job roles active in that department."
    }
  ],

  joins: [
    {
      title: "1. Three-Table Inner Join with Table Aliases (ANSI JOIN ... ON)",
      sql: `-- Join employees, departments, and locations with explicit qualifiers
SELECT e.employee_id,
       e.first_name,
       d.department_name,
       l.city
FROM employees e
JOIN departments d ON e.department_id = d.department_id
JOIN locations l ON d.location_id = l.location_id
ORDER BY e.employee_id;`,
      explanation: "Shared columns like department_id and location_id must be qualified with their table alias (e. or d.) to prevent ORA-00918 (column ambiguously defined)."
    },
    {
      title: "2. Hierarchical Self-Join (Employee to Manager)",
      sql: `-- Find each employee and their direct manager's name from the same table
SELECT e.first_name AS employee_name,
       NVL(m.first_name, 'TOP EXECUTIVE') AS manager_name
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.employee_id
ORDER BY e.first_name;`,
      explanation: "Self-joins require aliasing the same table twice (e for employee, m for manager). A LEFT JOIN ensures the CEO/President without a manager is still preserved."
    },
    {
      title: "3. Preserving Unmatched Rows with LEFT OUTER JOIN",
      sql: `-- List all departments including those with zero assigned employees
SELECT d.department_id,
       d.department_name,
       COUNT(e.employee_id) AS employee_count
FROM departments d
LEFT OUTER JOIN employees e ON d.department_id = e.department_id
GROUP BY d.department_id, d.department_name
ORDER BY employee_count ASC;`,
      explanation: "Preserves every record from the left table (departments). If a department has no matching employees, e.employee_id returns NULL, resulting in a count of 0."
    },
    {
      title: "4. Non-Equijoin on Salary Grade Bands",
      sql: `-- Match employees to salary grade bands using relational inequalities
SELECT e.first_name,
       e.salary,
       j.grade_level
FROM employees e
JOIN job_grades j ON e.salary BETWEEN j.lowest_sal AND j.highest_sal;`,
      explanation: "Non-equijoins use conditions other than '=' (here: BETWEEN). Joins rows based on continuous numerical boundaries rather than primary/foreign key matches."
    }
  ],

  subqueries: [
    {
      title: "1. Single-Row Subquery in WHERE Filter",
      sql: `-- Select all employees earning strictly more than the company-wide average
SELECT employee_id, first_name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees)
ORDER BY salary DESC;`,
      explanation: "The inner query executes first and returns a single numeric value (e.g., 6461). The outer query then filters employees earning more than that benchmark."
    },
    {
      title: "2. Multi-Row Comparison with ANY / ALL",
      sql: `-- Find employees earning more than ALL IT programmers
SELECT first_name, job_id, salary
FROM employees
WHERE salary > ALL (SELECT salary FROM employees WHERE job_id = 'IT_PROG')
  AND job_id <> 'IT_PROG';`,
      explanation: "> ALL means greater than the maximum value returned by the subquery (> MAX). Conversely, > ANY would mean greater than the minimum (> MIN)."
    },
    {
      title: "3. Safeguarding NOT IN against NULL Poisoning",
      sql: `-- Find departments that currently have no assigned employees
SELECT department_id, department_name
FROM departments
WHERE department_id NOT IN (
    SELECT department_id 
    FROM employees 
    WHERE department_id IS NOT NULL -- Mandatory NULL filter!
);`,
      explanation: "If the subquery returns even a single NULL, NOT IN evaluates to UNKNOWN for every row, returning 0 total rows. Filtering 'IS NOT NULL' in the subquery is mandatory."
    },
    {
      title: "4. High-Performance Correlated Subquery with NOT EXISTS",
      sql: `-- Locate employees who do not manage any subordinate staff
SELECT e.employee_id, e.first_name
FROM employees e
WHERE NOT EXISTS (
    SELECT 1 
    FROM employees m 
    WHERE m.manager_id = e.employee_id
);`,
      explanation: "Correlated subquery references the outer query row (e.employee_id). NOT EXISTS short-circuits on first match and is completely immune to NULL poisoning."
    }
  ],

  set_operators: [
    {
      title: "1. Deduplicating and Sorting with UNION",
      sql: `-- Combine historical jobs and current job titles without duplicates
SELECT employee_id, job_id FROM employees
UNION
SELECT employee_id, job_id FROM job_history
ORDER BY 1, 2;`,
      explanation: "UNION eliminates duplicate rows and automatically sorts the result set in ascending order on the first column. Column count and data types must match."
    },
    {
      title: "2. Fast Merge Preserving Duplicates with UNION ALL",
      sql: `-- Merge two audit tables rapidly without deduplication overhead
SELECT transaction_id, user_id, action_date FROM current_audit_log
UNION ALL
SELECT transaction_id, user_id, action_date FROM archived_audit_log;`,
      explanation: "UNION ALL preserves all duplicate records and skips the expensive sorting step, executing significantly faster than UNION on large datasets."
    },
    {
      title: "3. Finding Common Overlap with INTERSECT",
      sql: `-- Find employees who have changed roles but returned to their initial department
SELECT employee_id, department_id FROM employees
INTERSECT
SELECT employee_id, department_id FROM job_history;`,
      explanation: "INTERSECT returns only rows that exist in both the top and bottom query results, removing duplicates automatically."
    },
    {
      title: "4. Set Subtraction with MINUS and End ORDER BY",
      sql: `-- Identify departments that have no employees assigned to them
SELECT department_id FROM departments
MINUS
SELECT department_id FROM employees
ORDER BY 1;`,
      explanation: "MINUS returns rows from the first query that do not appear in the second query. In Oracle, ORDER BY can only appear once, at the very end of the compound statement."
    }
  ],

  dml_and_transactions: [
    {
      title: "1. Safe Explicit Column INSERT with Subquery",
      sql: `-- Populate an employee archive table from active records
INSERT INTO employee_archive (emp_id, full_name, hire_date, final_salary)
SELECT employee_id, 
       first_name || ' ' || last_name, 
       hire_date, 
       salary
FROM employees
WHERE department_id = 50;`,
      explanation: "Explicitly naming column targets prevents ORA-00947 (not enough values) and protects against table schema alterations such as adding default columns."
    },
    {
      title: "2. Multiple Column UPDATE with Comma Separation",
      sql: `-- Update salary and commission in a single atomic statement
UPDATE employees
SET salary = salary * 1.10,
    commission_pct = NVL(commission_pct, 0) + 0.05
WHERE department_id = 80;`,
      explanation: "Assignments in the SET clause MUST be separated by commas. Using 'AND' (e.g. SET col1 = val1 AND col2 = val2) raises ORA-00933."
    },
    {
      title: "3. Atomic UPSERT with Oracle MERGE",
      sql: `-- Insert new client records or update contact info if already existing
MERGE INTO client_master c
USING new_client_feed f
ON (c.client_id = f.client_id)
WHEN MATCHED THEN
  UPDATE SET c.phone = f.phone,
             c.address = f.address
WHEN NOT MATCHED THEN
  INSERT (client_id, client_name, phone, address)
  VALUES (f.client_id, f.client_name, f.phone, f.address);`,
      explanation: "MERGE combines INSERT and UPDATE into one statement. Note: The join column in the ON clause (client_id) cannot be updated in the WHEN MATCHED block (ORA-38104)."
    },
    {
      title: "4. Partial Rollback with Transaction SAVEPOINT",
      sql: `-- Execute DML, create checkpoints, and undo only the faulty step
UPDATE accounts SET balance = balance - 500 WHERE account_id = 101;
SAVEPOINT sp_step1;

UPDATE accounts SET balance = balance + 500 WHERE account_id = 999; -- Typo in ID
ROLLBACK TO SAVEPOINT sp_step1; -- Reverses only step 2; step 1 remains active

COMMIT; -- Permanently saves step 1 deduction`,
      explanation: "SAVEPOINT marks a checkpoint within an open transaction. ROLLBACK TO SAVEPOINT undoes subsequent modifications without rolling back prior uncommitted changes."
    }
  ],

  ddl_and_constraints: [
    {
      title: "1. Table Creation with Primary Key & Complex CHECK Constraints",
      sql: `-- Create a robust schema with multi-column constraint integrity
CREATE TABLE store_orders (
    order_id      NUMBER(10) GENERATED ALWAYS AS IDENTITY,
    order_date    DATE DEFAULT SYSDATE NOT NULL,
    customer_id   NUMBER(8) NOT NULL,
    order_total   NUMBER(12, 2) NOT NULL,
    status        VARCHAR2(20) DEFAULT 'PENDING',
    CONSTRAINT pk_store_orders PRIMARY KEY (order_id),
    CONSTRAINT chk_order_total CHECK (order_total >= 0),
    CONSTRAINT chk_order_status CHECK (status IN ('PENDING', 'SHIPPED', 'CANCELLED'))
);`,
      explanation: "Defines primary key, NOT NULL, DEFAULT values, and CHECK constraints. CHECK constraints validate rows on INSERT/UPDATE; subqueries and SYSDATE are illegal in CHECK rules."
    },
    {
      title: "2. Foreign Key with ON DELETE CASCADE Referential Integrity",
      sql: `-- Child table where deleting parent order deletes all line items
CREATE TABLE order_items (
    item_id       NUMBER(10) PRIMARY KEY,
    order_id      NUMBER(10) NOT NULL,
    product_name  VARCHAR2(100) NOT NULL,
    quantity      NUMBER(4) DEFAULT 1,
    CONSTRAINT fk_order_items_orders FOREIGN KEY (order_id)
        REFERENCES store_orders(order_id)
        ON DELETE CASCADE
);`,
      explanation: "ON DELETE CASCADE guarantees referential integrity: deleting a row in store_orders automatically deletes its corresponding child rows in order_items without ORA-02292."
    },
    {
      title: "3. Disabling & Re-enabling Constraints for High-Speed Bulk Load",
      sql: `-- Disable foreign key for high-speed batch load, then re-enable
ALTER TABLE order_items DISABLE CONSTRAINT fk_order_items_orders;

-- [Execute heavy bulk INSERT batch here]

ALTER TABLE order_items ENABLE VALIDATE CONSTRAINT fk_order_items_orders;`,
      explanation: "Disabling constraints during bulk loading eliminates per-row validation overhead. ENABLE VALIDATE checks both existing and new data upon completion."
    },
    {
      title: "4. Dropping Tables & Recovery via Oracle Recycle Bin",
      sql: `-- Drop a table without permanent purge, then restore it
DROP TABLE test_metrics;

-- Inspect Recycle Bin
SELECT object_name, original_name, droptime FROM user_recyclebin;

-- Restore table and its data completely
FLASHBACK TABLE test_metrics TO BEFORE DROP;`,
      explanation: "In Oracle, DROP TABLE moves the table to the Recycle Bin under a BIN$... identifier. FLASHBACK TABLE restores the table unless DROP TABLE was executed with the PURGE option."
    }
  ],

  views_and_other_objects: [
    {
      title: "1. Enforcing View Data Integrity with WITH CHECK OPTION",
      sql: `-- View that restricts visibility and prevents DML violating the WHERE clause
CREATE OR REPLACE VIEW it_programmers_view AS
SELECT employee_id, first_name, last_name, email, job_id, salary
FROM employees
WHERE job_id = 'IT_PROG'
WITH CHECK OPTION CONSTRAINT chk_it_prog_only;`,
      explanation: "WITH CHECK OPTION blocks any INSERT or UPDATE through the view that would change job_id to anything other than 'IT_PROG' (raises ORA-01402)."
    },
    {
      title: "2. Creating a Secure Read-Only Multi-Table View",
      sql: `-- Multi-table joined reporting view with total DML lockdown
CREATE OR REPLACE VIEW dept_summary_ro_view AS
SELECT d.department_name,
       COUNT(e.employee_id) AS total_staff,
       ROUND(AVG(e.salary), 2) AS average_salary
FROM departments d
LEFT JOIN employees e ON d.department_id = e.department_id
GROUP BY d.department_name
WITH READ ONLY;`,
      explanation: "WITH READ ONLY completely forbids any INSERT, UPDATE, or DELETE through the view, raising ORA-42399 upon any DML attempt."
    },
    {
      title: "3. Generating Incremental Primary Keys with SEQUENCES",
      sql: `-- Create a standalone sequence and populate table keys
CREATE SEQUENCE order_seq
    START WITH 1000
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

-- Use sequence in INSERT statement
INSERT INTO orders (order_id, order_date, customer_id)
VALUES (order_seq.NEXTVAL, SYSDATE, 501);`,
      explanation: "order_seq.NEXTVAL fetches the next available number. In a session, NEXTVAL must be called at least once before CURRVAL can be referenced (or ORA-08002 is raised)."
    },
    {
      title: "4. Optimizing Queries with Function-Based Indexes",
      sql: `-- Accelerate UPPER(email) queries and low-cardinality status filtering
CREATE INDEX idx_emp_upper_email ON employees(UPPER(email));

-- Query that directly utilizes the function-based index:
SELECT employee_id, first_name FROM employees WHERE UPPER(email) = 'SKING';`,
      explanation: "Standard B-Tree indexes on 'email' are suppressed when the query applies a function like UPPER(email). A function-based index stores precomputed uppercase keys to ensure index scans."
    }
  ],

  advanced_sql: [
    {
      title: "1. Department Top-Earners with DENSE_RANK & Inline View",
      sql: `-- Extract the top 2 highest-paid employees in each department (handling ties)
SELECT department_id, first_name, salary, salary_rank
FROM (
    SELECT department_id,
           first_name,
           salary,
           DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS salary_rank
    FROM employees
    WHERE department_id IS NOT NULL
)
WHERE salary_rank <= 2
ORDER BY department_id, salary_rank;`,
      explanation: "Analytic functions cannot be used directly in a WHERE clause (ORA-30483). Wrapping the ranking in an inline view allows the outer query to filter by the assigned alias 'salary_rank'."
    },
    {
      title: "2. Period-over-Period Trend Analysis with LAG",
      sql: `-- Compare each month's sales directly against the previous month
SELECT order_month,
       total_revenue,
       LAG(total_revenue, 1, 0) OVER (ORDER BY order_month) AS prev_month_revenue,
       total_revenue - LAG(total_revenue, 1, 0) OVER (ORDER BY order_month) AS revenue_diff
FROM monthly_sales_summary
ORDER BY order_month;`,
      explanation: "LAG(col, 1, 0) accesses the value from 1 row prior in sort order. The 3rd parameter (0) provides a fallback default instead of NULL for the very first row."
    },
    {
      title: "3. Cumulative Running Total with Default Window Framing",
      sql: `-- Calculate a day-by-day running total of department salary costs
SELECT employee_id,
       first_name,
       salary,
       SUM(salary) OVER (ORDER BY hire_date) AS running_total_payroll,
       SUM(salary) OVER () AS company_grand_total
FROM employees
ORDER BY hire_date;`,
      explanation: "SUM() OVER (ORDER BY hire_date) defaults to RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW, creating a running total. SUM() OVER () with empty parentheses calculates the company grand total on every row."
    },
    {
      title: "4. Lead Navigation for Expiration Date Gap Calculations",
      sql: `-- Find when each promotion expires based on the start date of the next promotion
SELECT promo_id,
       promo_name,
       start_date,
       LEAD(start_date, 1) OVER (ORDER BY start_date) - 1 AS auto_expire_date
FROM promotions
ORDER BY start_date;`,
      explanation: "LEAD(col, 1) looks forward 1 row into the future. Subtracting 1 day from the subsequent promotion's start date automatically generates the end date for the current promotion."
    }
  ]
};
