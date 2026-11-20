# Concepts Covered
- Oracle Datatypes and the NUMBER(p, s) Precision & Scale Rules (fractional rounding vs integer overflow ORA-01438)
- PRIMARY KEY, UNIQUE, and NOT NULL Constraints (column-level vs table-level definitions, composite keys, and multiple NULLs in UNIQUE)
- The CHECK Constraint and Prohibited Expressions (subquery ban, non-deterministic date/system variables ban, and ORA-02436)
- FOREIGN KEY Constraints and Referential Deletion Rules (parent/child relationships, default ORA-02292 restriction, ON DELETE CASCADE, and ON DELETE SET NULL)
- Modifying Tables and Constraints with ALTER TABLE (column modification rules, MODIFY for NOT NULL, DISABLE/ENABLE states, and DROP PRIMARY KEY CASCADE)
- Dropping Tables and the Oracle Recycle Bin (FLASHBACK TABLE, PURGE, ORA-02449, and CASCADE CONSTRAINTS)

# Practice Questions Completed
- 1. Predict success vs precision failure with NUMBER(5, 2) and ORA-01438 - Solved
- 2. Verify that UNIQUE constraint permits multiple NULL rows - Solved
- 3. Identify CHECK constraint failure when using SYSDATE (ORA-02436) - Solved
- 4. Predict child row deletion outcome with ON DELETE CASCADE - Solved
- 5. Identify ALTER TABLE DROP PRIMARY KEY failure (ORA-02273) and resolve with CASCADE - Solved
- 6. Identify DROP TABLE failure due to referencing foreign keys (ORA-02449) and resolve with CASCADE CONSTRAINTS - Solved
