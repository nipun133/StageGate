# Concepts Covered
- Simple vs. Complex Views and DML Permissions (single table vs multi-table/aggregates, and ORA-01732 restriction)
- View Integrity Clauses: WITH CHECK OPTION and WITH READ ONLY (ORA-42399 and ORA-01402 where-clause violations)
- Database Sequences (NEXTVAL, CURRVAL, CACHE/CYCLE parameters, ORA-08002 session trap, and gap mechanics)
- Database Indexes (B-Tree vs Bitmap cardinality, OLTP locking trap, index suppression by functions, and function-based indexes)
- Database Synonyms (Private vs. Public synonyms, object masking, privilege requirements, and Oracle name resolution order)

# Practice Questions Completed
- 1. Identify DELETE failure on complex view containing GROUP BY and aggregate functions (ORA-01732) - Solved
- 2. Identify INSERT failure violating WITH CHECK OPTION condition (ORA-01402) - Solved
- 3. Identify CURRVAL error in new session before NEXTVAL is called (ORA-08002) - Solved
- 4. Identify index suppression when applying functions on indexed columns in WHERE clause - Solved
- 5. Determine object resolution precedence between local table and public synonym - Solved
