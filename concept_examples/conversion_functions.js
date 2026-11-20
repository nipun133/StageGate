module.exports = {
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
};
