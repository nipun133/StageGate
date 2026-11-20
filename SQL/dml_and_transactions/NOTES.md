# DML and Transactions - Notes

## 1. The INSERT Statement
- **Purpose**: Adds new rows to an existing database table.
- **Explicit Column List (Best Practice)**:
  - Syntax: `INSERT INTO table_name (col1, col2) VALUES (val1, val2);`
  - Values match the specified column order.
  - Any column omitted automatically receives `NULL` (or its defined `DEFAULT` value).
- **Omitted Column List**:
  - Syntax: `INSERT INTO table_name VALUES (val1, val2, ...);`
  - Strict requirement: Must supply a value for **every single column** in the exact definition order of the table.
- **Common Oracle Error Traps**:
  - `not enough values`: Raised when the number of values in `VALUES(...)` is less than the columns specified (or less than total columns when column list is omitted).
  - `too many values`: Raised when the number of values in `VALUES(...)` exceeds the specified or available columns.

## 2. The UPDATE Statement
- **Purpose**: Modifies existing records in a table.
- **Syntax**:
  ```sql
  UPDATE table_name
  SET column1 = value1,
      column2 = value2
  WHERE condition;
  ```
- **Multiple Columns Syntax Trap**:
  - Multiple column assignments in the `SET` clause **must be separated by commas (`,`)**.
  - Using `AND` (e.g., `SET col1 = val1 AND col2 = val2`) is invalid SQL and raises:
    `SQL command not properly ended`.
- **The Missing WHERE Trap**:
  - If the `WHERE` clause is omitted, Oracle will silently update **every single row** across the entire table.

## 3. The DELETE Statement vs. TRUNCATE
- **The DELETE Statement**:
  - Purpose: Deletes specific rows matching a `WHERE` condition.
  - Syntax: `DELETE FROM table_name WHERE condition;` (`FROM` is optional in Oracle).
  - Missing `WHERE`: Deletes all rows in the table.
- **Comparison Table**:
  | Property | `DELETE` | `TRUNCATE` |
  | :--- | :--- | :--- |
  | **Language Category** | **DML** | **DDL** |
  | **Filtering** | Supports `WHERE` clause | No `WHERE` clause allowed (attempting `WHERE` raises `SQL command not properly ended`) |
  | **Transaction Control** | Can be rolled back via `ROLLBACK` | **Cannot** be rolled back (issues implicit `COMMIT`) |
  | **High Water Mark (HWM)**| Retains allocated extents; HWM unchanged | Deallocates extents; resets HWM to 0 |
  | **Triggers** | Fires `DELETE` triggers | Does **not** fire triggers |
  | **Speed** | Slower (logs row-by-row in undo) | Much faster (deallocates storage blocks directly) |

## 4. The MERGE Statement (UPSERT)
- **Purpose**: Combines conditional `INSERT` and `UPDATE` (and optionally `DELETE`) operations into a single atomic SQL statement based on match criteria.
- **Syntax**:
  ```sql
  MERGE INTO target_table t
  USING source_table s
  ON (t.id = s.id)
  WHEN MATCHED THEN
    UPDATE SET t.col1 = s.col1,
               t.col2 = s.col2
  WHEN NOT MATCHED THEN
    INSERT (id, col1, col2)
    VALUES (s.id, s.col1, s.col2);
  ```
- **Strict Oracle Restriction & Trap**:
  - **Cannot update match columns**: Any column referenced in the `ON (...)` condition cannot appear in the `UPDATE SET` clause.
  - Violation error:
    `Columns referenced in the ON Clause cannot be updated`.

## 5. Transaction Control Language (TCL)
- **Transaction Lifecycle in Oracle**:
  - **Begins**: Automatically with the first executable DML statement (`INSERT`, `UPDATE`, `DELETE`, `MERGE`).
  - **Explicit Ending**:
    - `COMMIT;`: Persists all pending DML changes permanently and releases row locks.
    - `ROLLBACK;`: Undoes all pending DML changes and releases row locks.
  - **Implicit Ending**:
    - Any DDL statement (`CREATE`, `ALTER`, `DROP`, `TRUNCATE`) or DCL statement (`GRANT`, `REVOKE`) executes an **implicit COMMIT** immediately before and after execution.
    - Normal disconnection / SQL*Plus exit executes an automatic `COMMIT`.
    - Session crash or abnormal disconnect causes an automatic `ROLLBACK`.
- **SAVEPOINT (Partial Rollback)**:
  - Syntax: `SAVEPOINT savepoint_name;`
  - Rollback to marker: `ROLLBACK TO savepoint_name;`
  - **Crucial Rule**: `ROLLBACK TO savepoint` does **not** terminate the transaction; the transaction remains active until a final `COMMIT` or complete `ROLLBACK` is issued.

## 6. Row-Level Locking and SELECT ... FOR UPDATE
- **Automatic Row Locks**: Oracle automatically places exclusive row locks whenever an `UPDATE` or `DELETE` executes. Readers never block writers, and writers never block readers (MVCC via Undo).
- **Explicit Row Locking (`FOR UPDATE`)**:
  - Syntax: `SELECT col1, col2 FROM table_name WHERE condition FOR UPDATE;`
  - Acquires exclusive locks on matching rows to prevent other sessions from updating or deleting them until the locking transaction ends.
- **Contention Clauses**:
  - **Default**: Session waits indefinitely until the other session commits or rolls back.
  - **`NOWAIT`**: Does not wait; immediately raises:
    `resource busy and acquire with NOWAIT specified or timeout expired`.
  - **`WAIT <n>`**: Waits up to `<n>` seconds before raising:
    `resource busy; acquire with WAIT timeout expired`.
- **Lock Release Rule**:
  - All acquired locks are retained throughout the transaction and are **strictly released only upon `COMMIT` or `ROLLBACK`** (or abnormal session termination).
