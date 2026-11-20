# DDL and Integrity Constraints - Notes

## 1. Oracle Built-in Datatypes & the NUMBER(p, s) Rule
- **Core Datatypes**:
  - `VARCHAR2(size)`: Variable-length character string (up to 4,000 bytes). Only consumes bytes for characters actually stored.
  - `CHAR(size)`: Fixed-length character string (up to 2,000 bytes). Pads unused space with trailing blanks.
  - `DATE`: Stores century, year, month, day, hour, minute, second.
  - `TIMESTAMP`: Stores date components plus fractional seconds (up to 9 digits, default 6).
  - `CLOB` / `BLOB`: Large object storage (Character / Binary up to 128 TB).
- **The `NUMBER(p, s)` Precision and Scale Rules**:
  - `p` (Precision): Total number of significant digits (1 to 38).
  - `s` (Scale): Number of digits to the right of the decimal point.
  - Maximum allowed integer digits = `p - s`.
  - **Fractional Digits**: Excess decimal places are **automatically rounded** to `s` places without error.
  - **Integer Digits**: If the integer part exceeds `p - s` digits, Oracle raises:
    `value larger than specified precision allowed for this column`.
  - **Omitted Scale (`NUMBER(p)`)**: Defaults to `NUMBER(p, 0)` (pure integer). Decimal inputs are silently rounded to the nearest whole integer.
  - **Omitted Both (`NUMBER`)**: Defaults to floating-point number storing up to 38 digits of precision with no fixed scale.

## 2. PRIMARY KEY, UNIQUE, and NOT NULL Constraints
- **Constraint Declaration Levels**:
  - **Column-Level (Inline)**: Declared alongside the column definition. `NOT NULL` must always be declared at column level.
  - **Table-Level (Out-of-line)**: Declared after all columns are listed. Required for **composite keys** (multi-column constraints).
- **Composite Primary Keys (Multi-Column Keys)**:
  - **Definition**: A primary key formed by combining two or more columns to uniquely identify a row (crucial for many-to-many junction tables like `order_items (order_id, item_id)` or `student_courses (student_id, course_id)`).
  - **Mandatory Table-Level Syntax**: Composite keys **must** be declared at table level:
    ```sql
    CREATE TABLE order_items (
        order_id NUMBER,
        item_id  NUMBER,
        quantity NUMBER,
        CONSTRAINT pk_order_items PRIMARY KEY (order_id, item_id)
    );
    ```
  - **Exam Trap (Column-Level Syntax Failure)**: Attempting to specify `PRIMARY KEY` inline on multiple columns fails immediately:
    ```sql
    order_id NUMBER PRIMARY KEY,
    item_id  NUMBER PRIMARY KEY
    ```
    Raises: `ORA-02260: table can have only one primary key`.
  - **Duplicate Values Rule**: Individual columns *can repeat freely* (e.g., `order_id = 101` can appear 50 times, `item_id = 1` can appear 100 times). Only the composite pair `(order_id, item_id)` must be unique.
  - **Nullability**: Oracle automatically enforces `NOT NULL` on **all columns** participating in a composite primary key. None of the columns can contain `NULL`.
  - **Foreign Key Referencing**: Any child table referencing a composite primary key must also declare a composite foreign key matching the exact column count and compatible datatypes in identical order:
    `FOREIGN KEY (order_id, item_id) REFERENCES order_items(order_id, item_id)`.
  - **Limit**: An Oracle composite key can span up to a maximum of **32 columns**.
- **PRIMARY KEY vs. UNIQUE**:
  | Feature | `PRIMARY KEY` | `UNIQUE` |
  | :--- | :--- | :--- |
  | **Count per Table** | Maximum of **one** | **Multiple** allowed |
  | **Nullability** | Never allows `NULL` (Strictly unique + NOT NULL) | **Allows `NULL`** |
  | **Underlying Index** | Automatically creates a unique index | Automatically creates a unique index |
- **The Multiple NULL Rule in UNIQUE**:
  - In Oracle SQL, two `NULL`s are not considered equal.
  - Therefore, a `UNIQUE` column permits **multiple rows to contain `NULL`** without triggering a constraint violation error (unless `NOT NULL` is also explicitly specified).
- **Duplicate Key Violation**: Attempting to insert a duplicate value into a `PRIMARY KEY` or `UNIQUE` column raises: `unique constraint violated`.

## 3. The CHECK Constraint & Prohibited Expressions
- **Purpose**: Defines conditions that every row must satisfy. A row is allowed if the condition evaluates to `TRUE` or `UNKNOWN` (`NULL`), and rejected only if it evaluates to `FALSE`.
- **Strict Prohibitions in Oracle**:
  - **No Subqueries**: Cannot query tables (`subquery not allowed here`).
  - **No Non-Deterministic / Dynamic Functions**: Cannot reference `SYSDATE`, `CURRENT_DATE`, `SYSTIMESTAMP`, `USER`, `UID`, or `USERENV`.
    - Violation raises: `date or system variable wrongly specified in CHECK constraint`.
  - **No Pseudocolumns**: Cannot use `ROWNUM`, `ROWID`, `CURRVAL`, or `NEXTVAL`.
  - **Single Table Scope**: Can only evaluate columns within the same row of the table where the constraint is defined.

## 4. FOREIGN KEY & Referential Integrity Rules
- **Purpose**: Links a column in a child table to a `PRIMARY KEY` or `UNIQUE` key column in a parent table.
- **Child Insert/Update Rule (The Two Legal States)**:
  - **State 1 (Match Existing Parent Key)**: If a non-null value is inserted or updated, it must already exist in the referenced parent primary/unique key. Inserting an unlisted value (e.g., adding `dept_id = 40` when only `10, 20, 30` exist in parent) raises:
    `integrity constraint violated - parent key not found`.
  - **State 2 (NULL Permitted by Default)**: Foreign key columns allow `NULL` values by default (indicating an unassigned or unlinked state, such as a newly hired employee without a department).
  - **Mandatory Parent Requirement**: To prohibit `NULL` entries in child records, `NOT NULL` must be explicitly declared on the foreign key column (`REFERENCES dept(dept_id) NOT NULL`). Inserting `NULL` then raises: `cannot insert NULL into...`.
- **Parent Deletion Behaviors**:
  - **Default (No Action)**: Deletion is blocked if child records exist.
    - Violation raises: `integrity constraint violated - child record found`.
  - **`ON DELETE CASCADE`**: Deleting the parent row automatically deletes all matching child rows.
  - **`ON DELETE SET NULL`**: Deleting the parent row sets the child foreign key column to `NULL` (requires child column to be nullable).

## 5. Modifying Tables & Constraints (ALTER TABLE)
- **Column Modifications**:
  - `ADD`: Adds new columns (`ALTER TABLE emp ADD (city VARCHAR2(30));`).
  - `MODIFY`: Changes column definition (`ALTER TABLE emp MODIFY (city VARCHAR2(50));`).
    - **Width rule**: Can increase width anytime. Can only decrease width or change datatype if the column is entirely `NULL` across all rows.
  - **Adding `NOT NULL`**: Because it is a column attribute, it requires `MODIFY` syntax:
    `ALTER TABLE emp MODIFY (email NOT NULL);`
  - `DROP COLUMN`: Removes a column permanently (`ALTER TABLE emp DROP COLUMN city;`).
- **Constraint States & Bulk Loading**:
  - **`DISABLE CONSTRAINT`**: Temporarily turns off constraint checking.
    - *Why use it (Bulk Loading)?* When importing millions of rows (batch inserts/migrations), checking constraints row-by-row causes huge performance overhead. Disabling constraints speeds up ingestion and allows parent/child tables to load in any order.
  - **`ENABLE CONSTRAINT`**: Re-enables the constraint and verifies all existing table data against the rule.
- **Dropping Referenced Primary Keys**:
  - Dropping a primary/unique key referenced by active child foreign keys fails with:
    `this unique/primary key is referenced by some foreign keys`.
  - Adding **`CASCADE`** (`ALTER TABLE dept DROP PRIMARY KEY CASCADE;`) forces Oracle to drop the primary key and simultaneously drop all dependent child foreign keys.

## 6. Dropping Tables & The Oracle Recycle Bin (DROP TABLE)
- **Recycle Bin Behavior**:
  - `DROP TABLE table_name;`: Does not permanently delete data; moves the table to the Oracle Recycle Bin under an internal system name (`BIN$...`).
  - **Restoring**: Can be restored at any time via:
    `FLASHBACK TABLE table_name TO BEFORE DROP;`
  - **Permanent Deletion (`PURGE`)**:
    - Bypasses the Recycle Bin and immediately releases storage space:
      `DROP TABLE table_name PURGE;`
    - To empty the current user's Recycle Bin:
      `PURGE RECYCLEBIN;`
- **Dropping Referenced Parent Tables**:
  - Dropping a table that is referenced by active foreign key constraints in other tables fails with:
    `unique/primary keys in table referenced by foreign keys`.
  - **Resolution**: Append **`CASCADE CONSTRAINTS`**:
    `DROP TABLE table_name CASCADE CONSTRAINTS;`
    This drops the parent table and automatically deletes all dependent foreign key constraints defined on child tables.
