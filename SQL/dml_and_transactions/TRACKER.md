# Concepts Covered
- Inserting Rows with INSERT (explicit column list vs omitted list and 'not enough values' error)
- The UPDATE Statement (modifying columns, comma separation in SET, and omission of WHERE trap)
- The DELETE Statement and DELETE vs TRUNCATE (DML vs DDL, rollback capability, High Water Mark, triggers)
- The MERGE Statement (UPSERT mechanics, WHEN MATCHED / WHEN NOT MATCHED, and the ORA-38104 ON-clause update restriction)
- Transaction Control Language (COMMIT, ROLLBACK, SAVEPOINT, partial rollback, and transaction life cycle)
- Row-Level Locking and SELECT FOR UPDATE (exclusive locks, NOWAIT, WAIT n, and lock release rules)

# Practice Questions Completed
- 1. Identify failure when values count mismatches table columns in INSERT - Solved
- 2. Identify failure when multiple SET assignments use AND instead of comma - Solved
- 3. Predict data outcome when executing DELETE followed by ROLLBACK - Solved
- 4. Identify MERGE statement failure due to updating a column used in the ON clause (ORA-38104) - Solved
- 5. Predict table row state after multi-step DML with SAVEPOINT, partial rollback, and COMMIT - Solved
- 6. Predict lock contention failure with SELECT FOR UPDATE NOWAIT (ORA-00054) - Solved
