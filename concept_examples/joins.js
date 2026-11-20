module.exports = {
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
};
