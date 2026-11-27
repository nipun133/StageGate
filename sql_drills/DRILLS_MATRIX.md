# Master SQL Drills Matrix (Accurately Targeted Calibration)

> **Shared Template (`0/X` format):** This file stays reset at `0` on GitHub so anyone downloading the repository can run drills from scratch. Your personal scores and question history are stored locally in `sql_drills/DRILLS_MATRIX.local.md` (gitignored and never pushed).

## 1. Topic: SELECT Statement
- [ ] **1.1 Basic Projection (`SELECT` with `*` vs. specific columns, statement termination `;`)** | Practical: 0/0 | MCQ: 0/1
  - *History*: (None yet)
- [ ] **1.2 Column Aliases & Quote Rules (Renaming headers, optional `AS`, double quotes for case/spaces, single-quote trap)** | Practical: 0/0 | MCQ: 0/3
  - *History*: (None yet)
- [ ] **1.3 Arithmetic Operators & NULL Propagation (Math operations `+ - * /` and `NULL` arithmetic rules)** | Practical: 0/0 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **1.4 Handling NULL in Arithmetic with `NVL()` (Datatype compatibility, safeguarding numeric calculations)** | Practical: 0/0 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **1.5 String Concatenation (`||`) & Text Literals (Combining columns and single-quoted strings)** | Practical: 0/0 | MCQ: 0/1
  - *History*: (None yet)
- [ ] **1.6 The Oracle `DUAL` Table (Mandatory `FROM` requirement, `DUMMY` column, and function/math evaluation)** | Practical: 0/0 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **1.7 Duplicate Elimination with `DISTINCT` (Multi-column uniqueness, syntax placement right after `SELECT`)** | Practical: 0/0 | MCQ: 0/2
  - *History*: (None yet)

## 2. Topic: WHERE Clause
- [ ] **2.1 Basic Filtering & Comparison Operators (`=, >, <, >=, <=, <>, !=`)** | Practical: 0/0 | MCQ: 0/1
  - *History*: (None yet)
- [ ] **2.2 Text and Date Literal Filtering (Strict case sensitivity and single-quote formatting)** | Practical: 0/0 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **2.3 Logical Operators (`AND` & `OR` evaluation)** | Practical: 0/0 | MCQ: 0/1
  - *History*: (None yet)
- [ ] **2.4 Operator Precedence (`AND` evaluated before `OR`, overriding with parentheses)** | Practical: 0/1 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **2.5 Range Filtering with `BETWEEN ... AND ...` (Inclusive boundaries, lower-bound first requirement)** | Practical: 0/0 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **2.6 List Matching with `IN` and `NOT IN` (Discrete set matching, negative inclusion)** | Practical: 0/0 | MCQ: 0/1
  - *History*: (None yet)
- [ ] **2.7 Pattern Matching with `LIKE` (`%` multi-character, `_` single-character, case sensitivity)** | Practical: 0/1 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **2.8 NULL Evaluation with `IS NULL` and `IS NOT NULL` (Illegal `= NULL` trap)** | Practical: 0/0 | MCQ: 0/2
  - *History*: (None yet)

## 3. Topic: ORDER BY Clause
- [ ] **3.1 Basic Sorting with `ASC` and `DESC` (Default ascending order, positioning at end of query)** | Practical: 0/0 | MCQ: 0/1
  - *History*: (None yet)
- [ ] **3.2 Multi-Column Sorting (Tie-breaking evaluation and independent sort directions)** | Practical: 0/0 | MCQ: 0/1
  - *History*: (None yet)
- [ ] **3.3 Sorting by Aliases & Positional Numbers (Execution order vs. WHERE error, 1-based indices)** | Practical: 0/0 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **3.4 Sorting with NULLs (`NULLS FIRST` vs. `NULLS LAST`, Oracle default NULL ranking)** | Practical: 0/0 | MCQ: 0/2
  - *History*: (None yet)

## 4. Topic: Character Functions
- [ ] **4.1 Case Conversion (`UPPER`, `LOWER`, `INITCAP`, and case-insensitive search pattern)** | Practical: 0/0 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **4.2 String Length (`LENGTH()` character counting and `NULL` behavior)** | Practical: 0/0 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **4.3 Substring Extraction (`SUBSTR()` 1-based indexing, optional length, and negative backward indexing)** | Practical: 0/1 | MCQ: 0/3
  - *History*: (None yet)
- [ ] **4.4 Substring Search Position (`INSTR()` occurrence parameters, 0 for missing substrings)** | Practical: 0/0 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **4.5 String Padding (`LPAD` and `RPAD`, total length expansion and truncation behavior)** | Practical: 0/0 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **4.6 String Trimming (`TRIM()` leading/trailing/both, and the single-character constraint trap)** | Practical: 0/0 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **4.7 Substring Replacement (`REPLACE()` pattern replacement and string character deletion)** | Practical: 0/0 | MCQ: 0/2
  - *History*: (None yet)

## 5. Topic: Numeric Functions
- [ ] **5.1 Rounding Numbers (`ROUND()` positive decimals, whole numbers, and negative tens/hundreds)** | Practical: 0/0 | MCQ: 0/3
  - *History*: (None yet)
- [ ] **5.2 Truncating Numbers (`TRUNC()` cutting digits without rounding, negative place truncation)** | Practical: 0/0 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **5.3 Modulo Remainder (`MOD()` division remainder and even/odd filtering pattern)** | Practical: 0/1 | MCQ: 0/1
  - *History*: (None yet)
- [ ] **5.4 Integer Ceilings and Floors (`CEIL()` and `FLOOR()`, boundary behaviors with negative numbers)** | Practical: 0/0 | MCQ: 0/2
  - *History*: (None yet)

## 6. Topic: Date Functions
- [ ] **6.1 Date Storage & Day Arithmetic (Century to second storage, integer day addition, fractional hours/minutes)** | Practical: 0/1 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **6.2 Month Differences (`MONTHS_BETWEEN()` positive/negative sign rule, exact whole numbers vs decimals)** | Practical: 0/0 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **6.3 Adding Calendar Months (`ADD_MONTHS()` forward/backward stepping and month-end adjustment rules)** | Practical: 0/0 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **6.4 Weekday and Month Boundaries (`NEXT_DAY()` weekday lookup and `LAST_DAY()` month-end/leap year rules)** | Practical: 0/0 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **6.5 Date Rounding & Truncation (`ROUND()` and `TRUNC()` on dates with `'MONTH'` and `'YEAR'` format models)** | Practical: 0/1 | MCQ: 0/2
  - *History*: (None yet)

## 7. Topic: Conversion Functions
- [ ] **7.1 Implicit vs. Explicit Conversion (Performance impacts, index suppression, explicit function destination principle)** | Practical: 0/0 | MCQ: 0/1
  - *History*: (None yet)
- [ ] **7.2 Date Formatting (`TO_CHAR()` with dates: `YYYY`, `MM` vs `MI`, `DD`, `DAY`, punctuation preservation)** | Practical: 0/1 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **7.3 Number Formatting (`TO_CHAR()` with numbers: `9`, `0`, `$`, `L`, `,`, `.`, and the `###` overflow trap)** | Practical: 0/0 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **7.4 String to Date Conversion (`TO_DATE()` and `RR` vs `YY` 50-year century resolution window)** | Practical: 0/0 | MCQ: 0/3
  - *History*: (None yet)
- [ ] **7.5 String to Number Conversion (`TO_NUMBER()` matching formats and `invalid number` error trap)** | Practical: 0/0 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **7.6 Coalescing Expressions (`COALESCE()` first non-null evaluation, datatype consistency, short-circuiting)** | Practical: 0/0 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **7.7 Null Comparison with `NULLIF()` (Equality nullification and division-by-zero protection)** | Practical: 0/0 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **7.8 Conditional `CASE` Expressions (Searched vs Simple CASE, `WHEN ... THEN`, default `ELSE`, mandatory `END`)** | Practical: 0/1 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **7.9 Oracle Proprietary `DECODE()` (Equality-only restriction, NULL equality handling, comparison with CASE)** | Practical: 0/0 | MCQ: 0/2
  - *History*: (None yet)

## 8. Topic: Group Functions & Aggregation
- [ ] **8.1 Standard Aggregates (`AVG`, `SUM`, `MIN`, `MAX`, `COUNT` behavior on numbers, strings, and dates)** | Practical: 0/0 | MCQ: 0/1
  - *History*: (None yet)
- [ ] **8.2 Group Functions & NULL Handling (`COUNT(*)` vs `COUNT(col)`, automatic NULL omission in `AVG`/`SUM`, `NVL` inclusion)** | Practical: 0/1 | MCQ: 0/3
  - *History*: (None yet)
- [ ] **8.3 Duplicate Elimination in Aggregates (`COUNT(DISTINCT col)`, `AVG(DISTINCT col)`)** | Practical: 0/0 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **8.4 Grouping Rows with `GROUP BY` (The Golden Rule: unaggregated columns in SELECT must be in GROUP BY, error)** | Practical: 0/1 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **8.5 Group Filtering with `HAVING` vs `WHERE` (`WHERE` row filter vs `HAVING` group filter, error trap)** | Practical: 0/2 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **8.6 Nesting Group Functions (2-level maximum nesting limit and the prohibition of individual columns in SELECT)** | Practical: 0/1 | MCQ: 0/2
  - *History*: (None yet)

## 9. Topic: Joins
- [ ] **9.1 Cartesian Product & `CROSS JOIN` (Row multiplication formula, omitted join predicate consequence)** | Practical: 0/0 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **9.2 `NATURAL JOIN` (Automatic matching on identical columns and the strict qualifier prohibition error)** | Practical: 0/0 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **9.3 The `JOIN ... USING` Clause (Explicit shared columns in parentheses and qualifier restriction error)** | Practical: 0/0 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **9.4 The `JOIN ... ON` Syntax (Inner joins, column disambiguation requirement, error ambiguous column trap)** | Practical: 0/2 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **9.5 Self Joins (Hierarchical self-referencing, mandatory two distinct aliases for the same table)** | Practical: 0/2 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **9.6 Non-Equijoins (Joining tables on ranges using `BETWEEN` or relational inequalities)** | Practical: 0/1 | MCQ: 0/1
  - *History*: (None yet)
- [ ] **9.7 `LEFT OUTER JOIN` (Preserving unmatched left rows, NULL-padded right table columns, anti-join pattern)** | Practical: 0/2 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **9.8 `RIGHT` and `FULL OUTER JOIN` (Preserving unmatched right rows, full bilateral preservation)** | Practical: 0/1 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **9.9 Oracle Proprietary `(+)` Operator (Placement on deficient side, bilateral ban error, IN/OR restrictions)** | Practical: 0/0 | MCQ: 0/3
  - *History*: (None yet)

## 10. Topic: Subqueries
- [ ] **10.1 Single-Row Subqueries (Parentheses requirement, execution sequence, single-row operators `=, >, <`)** | Practical: 0/1 | MCQ: 0/1
  - *History*: (None yet)
- [ ] **10.2 Single-Row Subquery Error Trap (`single-row subquery returns more than one row`)** | Practical: 0/0 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **10.3 Multiple-Row Subqueries with `IN` (Evaluating against dynamic inner lists)** | Practical: 0/0 | MCQ: 0/1
  - *History*: (None yet)
- [ ] **10.4 Multi-Row Comparison with `ANY` and `ALL` (`> ANY` vs `> ALL`, `< ANY` vs `< ALL`)** | Practical: 0/1 | MCQ: 0/3
  - *History*: (None yet)
- [ ] **10.5 The `NOT IN` with NULL Trap (Boolean AND/OR mechanics, zero-row result, mandatory IS NOT NULL safeguard)** | Practical: 0/1 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **10.6 Multiple-Column Pairwise Subqueries (Atomic tuple evaluation `(col1, col2) IN (...)` vs non-pairwise joins)** | Practical: 0/1 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **10.7 Correlated Subqueries & `EXISTS` / `NOT EXISTS` (Outer reference execution, short-circuiting, NULL immunity)** | Practical: 0/2 | MCQ: 0/2
  - *History*: (None yet)

## 11. Topic: Set Operators
- [ ] **11.1 Set Operator Compatibility Rules (Equal column count error, compatible types error, first query headers)** | Practical: 0/0 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **11.2 `UNION` vs. `UNION ALL` (Duplicate elimination, automatic ascending sort overhead, performance differences)** | Practical: 0/0 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **11.3 `INTERSECT` and Oracle `MINUS` (Common overlap vs set difference, order sensitivity `A MINUS B` != `B MINUS A`)** | Practical: 0/1 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **11.4 `ORDER BY` Placement Rule in Set Queries (Single placement at statement end, referencing 1st query headers/positions)** | Practical: 0/0 | MCQ: 0/2
  - *History*: (None yet)

## 12. Topic: DML & Transactions
- [ ] **12.1 The `INSERT` Statement (Explicit column lists vs omitted lists, default/null behavior, value count mismatch)** | Practical: 0/0 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **12.2 The `UPDATE` Statement (Modifying columns, comma separation in SET vs invalid `AND` error, missing WHERE trap)** | Practical: 0/1 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **12.3 The `DELETE` Statement vs. `TRUNCATE` (DML vs DDL, WHERE support, rollback/undo generation, HWM reset, triggers)** | Practical: 0/0 | MCQ: 0/3
  - *History*: (None yet)
- [ ] **12.4 The Oracle `MERGE` Statement (UPSERT mechanics, `WHEN MATCHED` / `WHEN NOT MATCHED`, error ON-clause update ban)** | Practical: 0/1 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **12.5 Transaction Control Language (TCL) (`COMMIT`, `ROLLBACK`, implicit DDL commits, partial rollback with `SAVEPOINT`)** | Practical: 0/0 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **12.6 Row-Level Locking & `SELECT ... FOR UPDATE` (Exclusive row locks, lock lifecycle, contention `NOWAIT` error, `WAIT n`)** | Practical: 0/0 | MCQ: 0/2
  - *History*: (None yet)

## 13. Topic: DDL & Integrity Constraints
- [ ] **13.1 Oracle Built-in Datatypes & `NUMBER(p, s)` (VARCHAR2 vs CHAR padding, DATE/TIMESTAMP, rounding vs error)** | Practical: 0/0 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **13.2 `PRIMARY KEY`, `UNIQUE`, and `NOT NULL` (Column vs table level, composite keys, multiple NULLs in UNIQUE rule)** | Practical: 0/1 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **13.3 The `CHECK` Constraint & Prohibited Expressions (Subquery ban error, non-deterministic `SYSDATE` ban error)** | Practical: 0/0 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **13.4 `FOREIGN KEY` Referential Integrity (Parent/child relationships, default error restrict, `CASCADE`, `SET NULL`)** | Practical: 0/0 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **13.5 Modifying Tables & Constraints (`ALTER TABLE` column resizing, `MODIFY` for NOT NULL, bulk loading DISABLE/ENABLE, `DROP PK CASCADE`)** | Practical: 0/1 | MCQ: 0/3
  - *History*: (None yet)
- [ ] **13.6 Dropping Tables & The Oracle Recycle Bin (`DROP TABLE`, `FLASHBACK TABLE`, `PURGE`, dropping parents with `CASCADE CONSTRAINTS`)** | Practical: 0/0 | MCQ: 0/2
  - *History*: (None yet)

## 14. Topic: Views & Other Database Objects
- [ ] **14.1 Simple vs. Complex Views & DML Restrictions (Single table vs joins/aggregates, `GROUP BY` DML ban error)** | Practical: 0/0 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **14.2 View Integrity Clauses (`WITH READ ONLY` error, `WITH CHECK OPTION` where-clause violation error)** | Practical: 0/1 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **14.3 Database Sequences (`START WITH`, `INCREMENT BY`, `CACHE`/`NOCACHE`, `CYCLE`/`NOCYCLE`, session trap error, gap causes)** | Practical: 0/1 | MCQ: 0/3
  - *History*: (None yet)
- [ ] **14.4 Database Indexes & Index Suppression (B-Tree vs Bitmap cardinality, OLTP locking, function index suppression & function indexes)** | Practical: 0/0 | MCQ: 0/3
  - *History*: (None yet)
- [ ] **14.5 Database Synonyms & Name Resolution Order (Private vs Public, object masking, 4-step resolution order)** | Practical: 0/0 | MCQ: 0/2
  - *History*: (None yet)

## 15. Topic: Advanced SQL & Analytic (Window) Functions
- [ ] **15.1 Ranking Functions: `ROW_NUMBER` vs `RANK` vs `DENSE_RANK` (Tie handling, rank gap behaviors, N-th highest problems)** | Practical: 0/2 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **15.2 `PARTITION BY` & SQL Execution Order Filter Trap (Window functions in WHERE error, alias in WHERE error, inline view fix)** | Practical: 0/1 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **15.3 Positional Navigation Functions: `LEAD` and `LAG` (Forward/backward offsets, fallback default values, boundary conditions)** | Practical: 0/2 | MCQ: 0/2
  - *History*: (None yet)
- [ ] **15.4 Aggregate Window Functions & Default Framing (`OVER ()` grand total vs `OVER (ORDER BY ...)` cumulative running total)** | Practical: 0/2 | MCQ: 0/2
  - *History*: (None yet)
