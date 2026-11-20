module.exports = {
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
};
