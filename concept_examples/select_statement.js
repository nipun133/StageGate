module.exports = {
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
};
