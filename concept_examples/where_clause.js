module.exports = {
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
};
