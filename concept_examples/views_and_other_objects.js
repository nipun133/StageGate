module.exports = {
  "1": [
    {
      "sql": "-- Standard: Simple view (1 table, no group functions, no GROUP BY) permits DML\nCREATE VIEW emp_v10 AS\nSELECT employee_id, first_name, salary, department_id\nFROM employees\nWHERE department_id = 10;\nUPDATE emp_v10 SET salary = salary + 100 WHERE employee_id = 200;",
      "output": "View created.\n1 row updated.\nNote: Simple view DML directly modifies the underlying EMPLOYEES base table."
    },
    {
      "sql": "-- Exam Trap: DML is strictly prohibited on views containing GROUP BY, aggregates, or DISTINCT (raises error)\nCREATE VIEW dept_sal_summary AS\nSELECT department_id, AVG(salary) AS avg_sal\nFROM employees\nGROUP BY department_id;\nDELETE FROM dept_sal_summary WHERE department_id = 10;\n-- Error: data manipulation operation not legal on this view",
      "output": "View created.\nError: data manipulation operation not legal on this view\nCause: Views containing GROUP BY or aggregate functions cannot undergo DML."
    }
  ],
  "2": [
    {
      "sql": "-- Feature: WITH READ ONLY blocks all DML through the view (raises error)\nCREATE VIEW v_secure_emp AS\nSELECT employee_id, last_name, salary FROM employees\nWITH READ ONLY;\nDELETE FROM v_secure_emp WHERE employee_id = 100;\n-- Error: cannot perform a DML operation on a read-only view",
      "output": "View created.\nError: cannot perform a DML operation on a read-only view\nCause: WITH READ ONLY prevents any INSERT, UPDATE, or DELETE through the view."
    },
    {
      "sql": "-- Exam Trap: WITH CHECK OPTION prevents DML from violating the view's WHERE clause (raises error)\nCREATE VIEW v_dept20 AS\nSELECT employee_id, last_name, department_id FROM employees WHERE department_id = 20\nWITH CHECK OPTION;\nUPDATE v_dept20 SET department_id = 30 WHERE employee_id = 201;\n-- Error: view WITH CHECK OPTION where-clause violation",
      "output": "View created.\nError: view WITH CHECK OPTION where-clause violation\nCause: Attempting to move the employee to Dept 30 would remove the row from the view's scope."
    }
  ],
  "3": [
    {
      "sql": "-- Standard: Sequences generate unique integers for surrogate primary keys\nCREATE SEQUENCE order_seq START WITH 1000 INCREMENT BY 1;\nSELECT order_seq.NEXTVAL, order_seq.CURRVAL FROM dual;",
      "output": "Sequence created.\n\n   NEXTVAL    CURRVAL\n----------  ---------\n      1000       1000"
    },
    {
      "sql": "-- Exam Trap: Referencing CURRVAL before NEXTVAL in a new session raises error\nSELECT order_seq.CURRVAL FROM dual;\n-- Error: sequence ORDER_SEQ.CURRVAL is not yet defined in this session",
      "output": "Error: sequence ORDER_SEQ.CURRVAL is not yet defined in this session\nCause: CURRVAL is session-specific and cannot be read until NEXTVAL is invoked in that session."
    },
    {
      "sql": "-- Architecture: Sequences guarantee uniqueness, NOT contiguous numbers (gaps occur on rollback)\nINSERT INTO orders (order_id) VALUES (order_seq.NEXTVAL);  -- Takes 1001\nROLLBACK;  -- 1001 is lost forever; next insert gets 1002!",
      "output": "1 row created.\nRollback complete.\nNote: Rolling back a transaction never rolls back a sequence generator."
    }
  ],
  "4": [
    {
      "sql": "-- Standard: B-Tree index speeds up equality and range lookups on high-cardinality columns\nCREATE INDEX idx_emp_lname ON employees(last_name);\nSELECT * FROM employees WHERE last_name = 'King';",
      "output": "Index created.\n(Oracle optimizer uses INDEX RANGE SCAN via ROWID instead of Full Table Scan)"
    },
    {
      "sql": "-- Exam Trap: Applying a function or calculation to an indexed column suppresses the B-Tree index\nSELECT * FROM employees WHERE UPPER(last_name) = 'KING';  -- Suppresses idx_emp_lname!",
      "output": "Note: B-Tree index is ignored; Oracle falls back to Full Table Scan (FTS)."
    },
    {
      "sql": "-- Remedy: Create a Function-Based Index matching the exact expression\nCREATE INDEX idx_emp_upper_lname ON employees(UPPER(last_name));\nSELECT * FROM employees WHERE UPPER(last_name) = 'KING';",
      "output": "Index created.\n(Oracle optimizer now successfully uses Function-Based Index SCAN)"
    }
  ],
  "5": [
    {
      "sql": "-- Standard: Synonyms provide aliases for objects to mask ownership and simplify SQL\nCREATE SYNONYM emp FOR hr.employees;\nSELECT employee_id, last_name FROM emp WHERE employee_id = 100;",
      "output": "Synonym created.\n\nEMPLOYEE_ID  LAST_NAME\n-----------  ---------\n        100  King     "
    },
    {
      "sql": "-- Architecture: 4-Step Name Resolution Order (Local Object -> Private Synonym -> Public Synonym -> Error)\nSELECT * FROM non_existent_table;\n-- Error: table or view does not exist",
      "output": "Error: table or view does not exist\nOrder: 1. User Schema Object -> 2. Private Synonym -> 3. Public Synonym -> 4. Error."
    }
  ]
};
