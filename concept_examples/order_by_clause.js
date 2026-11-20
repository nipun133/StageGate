module.exports = {
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
};
