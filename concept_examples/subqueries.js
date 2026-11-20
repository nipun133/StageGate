module.exports = {
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
};
