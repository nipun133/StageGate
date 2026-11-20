module.exports = {
  "1": [
    {
      "sql": "-- Standard: INSERT with explicit column list (omitted nullable columns receive NULL or DEFAULT)\nINSERT INTO departments (department_id, department_name)\nVALUES (280, 'Stage Gate Prep');",
      "output": "1 row created."
    },
    {
      "sql": "-- Exam Trap: Error raised when VALUES list contains fewer items than column list\nINSERT INTO departments (department_id, department_name, manager_id)\nVALUES (290, 'Data Science');\n-- Error: not enough values",
      "output": "Error: not enough values\nCause: 3 columns specified, but only 2 values supplied in VALUES clause."
    },
    {
      "sql": "-- Exam Trap: Error raised when VALUES list contains more items than column list\nINSERT INTO departments (department_id, department_name)\nVALUES (300, 'AI Research', 200, 1700);\n-- Error: too many values",
      "output": "Error: too many values\nCause: 2 columns specified, but 4 values supplied in VALUES clause."
    },
    {
      "sql": "-- Feature: Inserting multiple rows using a subquery (no VALUES keyword)\nINSERT INTO bonus_archive (emp_id, bonus_amt)\nSELECT employee_id, salary * 0.10 FROM employees WHERE department_id = 90;",
      "output": "3 rows created."
    }
  ],
  "2": [
    {
      "sql": "-- Standard: Modifying multiple columns separated by commas in SET clause\nUPDATE employees\nSET salary = salary * 1.10,\n    commission_pct = 0.15\nWHERE employee_id = 103;",
      "output": "1 row updated."
    },
    {
      "sql": "-- Exam Trap: Using AND instead of commas in SET clause raises error\nUPDATE employees\nSET salary = 5000 AND commission_pct = 0.2\nWHERE employee_id = 103;\n-- Error: SQL command not properly ended",
      "output": "Error: SQL command not properly ended\nCause: Multiple column assignments in SET must be comma-separated, never separated with AND."
    },
    {
      "sql": "-- Warning Trap: Omitting the WHERE clause silently updates every single row in the table\nUPDATE employees\nSET salary = 5000;\n-- 107 rows updated (Entire company salary overwritten!)",
      "output": "107 rows updated.\nNote: Always verify WHERE clause before executing UPDATE statements."
    }
  ],
  "3": [
    {
      "sql": "-- Standard: Filtered DELETE removes specific matching rows (DML: can be rolled back)\nDELETE FROM employees\nWHERE employee_id = 999;",
      "output": "1 row deleted."
    },
    {
      "sql": "-- Architecture: TRUNCATE TABLE is DDL (cannot rollback, resets HWM to 0, does not fire triggers)\nTRUNCATE TABLE audit_log;",
      "output": "Table truncated.\nNote: Deallocates extents immediately; issues an implicit COMMIT before and after execution."
    },
    {
      "sql": "-- Exam Trap: TRUNCATE does NOT support a WHERE clause; raises error\nTRUNCATE TABLE audit_log WHERE log_date < SYSDATE - 30;\n-- Error: SQL command not properly ended",
      "output": "Error: SQL command not properly ended\nCause: TRUNCATE is DDL that wipes the whole table segment; row-level filtering requires DELETE."
    }
  ],
  "4": [
    {
      "sql": "-- Standard: MERGE performs conditional UPSERT (UPDATE if matched, INSERT if not matched)\nMERGE INTO emp_summary t\nUSING emp_staging s\nON (t.emp_id = s.emp_id)\nWHEN MATCHED THEN\n  UPDATE SET t.salary = s.salary, t.status = s.status\nWHEN NOT MATCHED THEN\n  INSERT (emp_id, salary, status)\n  VALUES (s.emp_id, s.salary, s.status);",
      "output": "5 rows merged."
    },
    {
      "sql": "-- Exam Trap: Cannot update columns referenced in the ON (...) condition; raises error\nMERGE INTO emp_summary t\nUSING emp_staging s\nON (t.emp_id = s.emp_id)\nWHEN MATCHED THEN\n  UPDATE SET t.emp_id = s.emp_id, t.salary = s.salary;\n-- Error: Columns referenced in the ON Clause cannot be updated",
      "output": "Error: Columns referenced in the ON Clause cannot be updated\nCause: t.emp_id is the join key in the ON clause and cannot be modified in the UPDATE branch."
    }
  ],
  "5": [
    {
      "sql": "-- Standard: Transaction lifecycle begins with first DML and persists with COMMIT\nUPDATE employees SET salary = salary + 100 WHERE employee_id = 100;\nCOMMIT;",
      "output": "1 row updated.\nCommit complete."
    },
    {
      "sql": "-- Feature: Partial rollback to a SAVEPOINT (transaction remains active!)\nUPDATE accounts SET balance = balance - 500 WHERE acct_id = 1;\nSAVEPOINT sp_debit;\nUPDATE accounts SET balance = balance + 500 WHERE acct_id = 2;\nROLLBACK TO sp_debit;\nCOMMIT;  -- Only the debit is committed",
      "output": "1 row updated.\nSavepoint created.\n1 row updated.\nRollback complete.\nCommit complete."
    },
    {
      "sql": "-- Exam Trap: Any DDL statement (CREATE, ALTER, TRUNCATE) issues an IMPLICIT COMMIT\nUPDATE employees SET salary = 9000 WHERE employee_id = 100;\nCREATE TABLE temp_flag (id NUMBER);\nROLLBACK;  -- Cannot rollback the update! DDL already committed it.",
      "output": "1 row updated.\nTable created.\nRollback complete (Has no effect on update; DDL issued implicit commit)."
    }
  ],
  "6": [
    {
      "sql": "-- Standard: SELECT ... FOR UPDATE acquires exclusive row-level locks on matching records\nSELECT employee_id, salary\nFROM employees\nWHERE department_id = 10\nFOR UPDATE;",
      "output": "EMPLOYEE_ID  SALARY\n-----------  ------\n        200    4400\nNote: Row is locked until this session issues COMMIT or ROLLBACK."
    },
    {
      "sql": "-- Feature: NOWAIT raises error immediately if rows are locked by another session\nSELECT employee_id, salary\nFROM employees\nWHERE department_id = 10\nFOR UPDATE NOWAIT;\n-- Error: resource busy and acquire with NOWAIT specified or timeout expired",
      "output": "Error: resource busy and acquire with NOWAIT specified or timeout expired\nCause: Another active transaction holds locks on the requested rows."
    },
    {
      "sql": "-- Feature: WAIT <n> specifies seconds to wait for locks before timing out with Error\nSELECT employee_id, salary\nFROM employees\nWHERE department_id = 10\nFOR UPDATE WAIT 5;",
      "output": "Error: resource busy; acquire with WAIT timeout expired\nCause: Lock could not be obtained within the specified 5-second interval."
    }
  ]
};
