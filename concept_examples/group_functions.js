module.exports = {
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
};
