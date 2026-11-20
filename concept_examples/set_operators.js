module.exports = {
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
};
