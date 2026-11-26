# Deloitte Stage Gate Preparation — SQL & PL/SQL Master Repository ⚡

Comprehensive preparation materials, interactive web application, topic notes, and practice drills for the **Deloitte Stage Gate examination** (Oracle Database standard).

- 🌐 **Live Web App**: [stage-gate-8a890.web.app](https://stage-gate-8a890.web.app)
- 🤖 **Agent Rules & Exam Guidelines**: [AGENTS.md](AGENTS.md)
- 🎯 **Practice Drills Matrix**: [sql_drills/DRILLS_MATRIX.md](sql_drills/DRILLS_MATRIX.md)

---

## 📚 Curriculum & Topic Notes (`SQL/`)

1. **[General Knowledge / Engine Essentials](SQL/general_knowledge/NOTES.md)** — Clauses order, logical processing, NVL vs COALESCE, 3-valued logic, data types (`NUMBER(p, s)`).
2. **[SELECT Statement](SQL/select_statement/NOTES.md)** — Column projection, arithmetic expressions, alias scoping rules, NULL propagation.
3. **[WHERE Clause](SQL/where_clause/NOTES.md)** — Comparison operators, LIKE / ESCAPE syntax, IN / NOT IN with NULL poisons, BETWEEN bounds.
4. **[ORDER BY Clause](SQL/order_by_clause/NOTES.md)** — Positional sorting, NULLS FIRST / LAST, expressions, alias legality in ORDER BY.
5. **[Character Functions](SQL/character_functions/NOTES.md)** — UPPER, LOWER, INITCAP, SUBSTR, INSTR, LPAD, RPAD, TRIM, REPLACE, TRANSLATE.
6. **[Numeric Functions](SQL/numeric_functions/NOTES.md)** — ROUND, TRUNC, MOD, CEIL, FLOOR, ABS, SIGN.
7. **[Date Functions](SQL/date_functions/NOTES.md)** — SYSDATE, date arithmetic, MONTHS_BETWEEN, ADD_MONTHS, NEXT_DAY, LAST_DAY, ROUND/TRUNC on dates.
8. **[Conversion Functions](SQL/conversion_functions/NOTES.md)** — TO_CHAR, TO_NUMBER, TO_DATE, format models (`YYYY`, `MM`, `MON`, `DY`, `HH24:MI:SS`).
9. **[Group Functions](SQL/group_functions/NOTES.md)** — COUNT(*), COUNT(col), SUM, AVG, MIN, MAX, GROUP BY, HAVING vs WHERE traps.
10. **[Joins](SQL/joins/NOTES.md)** — ANSI-92 vs Oracle-proprietary (`(+)`), INNER, LEFT/RIGHT/FULL OUTER, CROSS JOIN, NATURAL JOIN, USING vs ON.
11. **[Subqueries](SQL/subqueries/NOTES.md)** — Single-row, multi-row (`ANY`, `ALL`, `IN`), correlated subqueries, `EXISTS` vs `NOT EXISTS` immunity.
12. **[Set Operators](SQL/set_operators/NOTES.md)** — UNION, UNION ALL, INTERSECT, MINUS, column count & datatype matching rules.
13. **[DDL & Constraints](SQL/ddl_and_constraints/NOTES.md)** — CREATE, ALTER, DROP, TRUNCATE vs DELETE, column-level vs table-level constraints, ON DELETE CASCADE / SET NULL.
14. **[DML & Transactions](SQL/dml_and_transactions/NOTES.md)** — INSERT, UPDATE, DELETE, MERGE, COMMIT, ROLLBACK, SAVEPOINT, MVCC row-level locking (`SELECT ... FOR UPDATE`, `NOWAIT`, `WAIT n`).
15. **[Views & Other Database Objects](SQL/views_and_other_objects/NOTES.md)** — Simple vs complex views, `WITH CHECK OPTION`, `WITH READ ONLY`, Sequences, Indexes, Synonyms.
16. **[Advanced SQL (Window Functions)](SQL/advanced_sql/NOTES.md)** — Analytic functions (`ROW_NUMBER`, `RANK`, `DENSE_RANK`), `OVER (PARTITION BY ... ORDER BY ...)`, Running totals, `ROWS` vs `RANGE`.

---

## 🤖 Agent Guidelines (`AGENTS.md`)
The repository contains the strict execution protocols and teaching rules in [AGENTS.md](AGENTS.md):
- Core mission & technology focus (Oracle DB exclusively).
- Directory structure & topic tracking rules.
- Interactive teaching protocol (1 concept per turn, descriptive Oracle errors `ORA-XXXXX`).
- Master drills matrix & random interleaved testing protocol.
- Strict anti-spoiler & remediation workflows.
