module.exports = {
  "1": [
    {
      "sql": "-- Standard: Character storage: VARCHAR2(size) vs CHAR(size) with blank padding\nSELECT 'ABC' AS var_val, LENGTH('ABC') AS var_len,\n       CAST('ABC' AS CHAR(10)) AS char_val, LENGTH(CAST('ABC' AS CHAR(10))) AS char_len\nFROM dual;",
      "output": "VAR_VAL  VAR_LEN  CHAR_VAL    CHAR_LEN\n-------  -------  ----------  --------\nABC            3  ABC               10\nNote: CHAR(10) pads trailing spaces up to 10 characters."
    },
    {
      "sql": "-- Standard: NUMBER(p, s): Excess fractional digits are automatically rounded to scale (s)\nCREATE TABLE num_demo (amount NUMBER(5, 2));\nINSERT INTO num_demo VALUES (123.456);\nSELECT * FROM num_demo;",
      "output": "Table created.\n1 row created.\n\n    AMOUNT\n----------\n    123.46  (Rounded from 123.456 to 2 decimal places)"
    },
    {
      "sql": "-- Exam Trap: Integer digits exceed (p - s) places; raises error\nINSERT INTO num_demo VALUES (1234.5);\n-- Error: value larger than specified precision allowed for this column",
      "output": "Error: value larger than specified precision allowed for this column\nCause: NUMBER(5, 2) allows max 5 - 2 = 3 integer digits, but 1234 has 4 integer digits."
    }
  ],
  "2": [
    {
      "sql": "-- Standard: PRIMARY KEY and composite key defined at table level (out-of-line)\nCREATE TABLE project_members (\n  project_id  NUMBER(6),\n  employee_id NUMBER(6),\n  role_desc   VARCHAR2(30) NOT NULL,\n  CONSTRAINT pk_proj_member PRIMARY KEY (project_id, employee_id)\n);",
      "output": "Table created.\nNote: Composite keys must be declared at the table level."
    },
    {
      "sql": "-- Core Rule: UNIQUE permits multiple rows to contain NULL without constraint violation\nCREATE TABLE vendor (\n  vendor_id NUMBER PRIMARY KEY,\n  tax_id    VARCHAR2(20) UNIQUE\n);\nINSERT INTO vendor VALUES (1, NULL);\nINSERT INTO vendor VALUES (2, NULL);  -- Succeeds!",
      "output": "Table created.\n1 row created.\n1 row created.\nNote: In Oracle, two NULLs are not equal, so UNIQUE allows multiple NULL entries."
    },
    {
      "sql": "-- Exam Trap: Duplicate primary key value raises error\nINSERT INTO vendor VALUES (1, 'TAX-999');\n-- Error: unique constraint violated",
      "output": "Error: unique constraint (HR.SYS_C001122) violated\nCause: vendor_id = 1 already exists in the table."
    }
  ],
  "3": [
    {
      "sql": "-- Standard: CHECK constraint validates row criteria (allows TRUE and NULL; rejects FALSE)\nCREATE TABLE staff (\n  staff_id NUMBER PRIMARY KEY,\n  salary   NUMBER CHECK (salary > 0)\n);",
      "output": "Table created."
    },
    {
      "sql": "-- Exam Trap: Subqueries are strictly prohibited in CHECK constraints (raises error)\nALTER TABLE staff ADD CONSTRAINT chk_subq CHECK (salary > (SELECT AVG(salary) FROM employees));\n-- Error: subquery not allowed here",
      "output": "Error: subquery not allowed here\nCause: CHECK constraints can only reference columns within the same row of the current table."
    },
    {
      "sql": "-- Exam Trap: Non-deterministic/system functions like SYSDATE are prohibited in CHECK constraints (raises error)\nALTER TABLE staff ADD CONSTRAINT chk_dt CHECK (hire_date <= SYSDATE);\n-- Error: date or system variable wrongly specified in CHECK constraint",
      "output": "Error: date or system variable wrongly specified in CHECK constraint\nCause: SYSDATE changes continuously, violating the deterministic rule for CHECK constraints."
    }
  ],
  "4": [
    {
      "sql": "-- Exam Trap: Inserting child record without corresponding parent key raises error\nINSERT INTO employees (employee_id, last_name, department_id)\nVALUES (999, 'Test', 9999);\n-- Error: integrity constraint violated - parent key not found",
      "output": "Error: integrity constraint (HR.EMP_DEPT_FK) violated - parent key not found\nCause: department_id = 9999 does not exist in the parent DEPARTMENTS table."
    },
    {
      "sql": "-- Exam Trap: Deleting parent row when active child records exist raises error (default restrict)\nDELETE FROM departments WHERE department_id = 10;\n-- Error: integrity constraint violated - child record found",
      "output": "Error: integrity constraint (HR.EMP_DEPT_FK) violated - child record found\nCause: Employees currently exist assigned to Department 10."
    },
    {
      "sql": "-- Feature: ON DELETE CASCADE automatically removes child records when parent is deleted\nCREATE TABLE order_items (\n  item_id  NUMBER PRIMARY KEY,\n  order_id NUMBER REFERENCES orders(order_id) ON DELETE CASCADE\n);",
      "output": "Table created.\nNote: Deleting an order automatically purges all corresponding order items."
    }
  ],
  "5": [
    {
      "sql": "-- Standard: Adding new columns and modifying existing column widths using ALTER TABLE\nALTER TABLE departments ADD (status VARCHAR2(10));\nALTER TABLE departments MODIFY (status VARCHAR2(25));",
      "output": "Table altered.\nTable altered."
    },
    {
      "sql": "-- Syntax Rule: Adding NOT NULL requires MODIFY clause (NOT NULL is a column-level attribute)\nALTER TABLE departments MODIFY (status NOT NULL);",
      "output": "Table altered."
    },
    {
      "sql": "-- Architecture: Disabling constraints speeds up bulk data loading; ENABLE verifies integrity afterward\nALTER TABLE employees DISABLE CONSTRAINT emp_dept_fk;\n-- (Perform high-speed batch data ingestion here)\nALTER TABLE employees ENABLE CONSTRAINT emp_dept_fk;",
      "output": "Table altered.\nTable altered."
    },
    {
      "sql": "-- Exam Trap: Dropping referenced primary key fails unless CASCADE is specified\nALTER TABLE departments DROP PRIMARY KEY CASCADE;",
      "output": "Table altered.\nNote: CASCADE drops the primary key and simultaneously drops all dependent foreign keys in child tables."
    }
  ],
  "6": [
    {
      "sql": "-- Standard: DROP TABLE moves table to the Oracle Recycle Bin (prefixed with BIN$...)\nDROP TABLE audit_temp;\nSELECT object_name, original_name, type FROM user_recyclebin;",
      "output": "Table dropped.\n\nOBJECT_NAME                    ORIGINAL_NAME  TYPE \n-----------------------------  -------------  -----\nBIN$d9sF3k+8Tg==$0            AUDIT_TEMP     TABLE"
    },
    {
      "sql": "-- Feature: Restoring accidentally dropped table from Recycle Bin\nFLASHBACK TABLE audit_temp TO BEFORE DROP;",
      "output": "Flashback complete."
    },
    {
      "sql": "-- Exam Trap: Dropping parent table referenced by child FKs requires CASCADE CONSTRAINTS; PURGE bypasses bin\nDROP TABLE departments CASCADE CONSTRAINTS PURGE;",
      "output": "Table dropped.\nNote: CASCADE CONSTRAINTS drops foreign key dependencies; PURGE permanently releases disk space."
    }
  ]
};
