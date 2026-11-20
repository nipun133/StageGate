# Concepts Covered
- Ranking Functions: ROW_NUMBER vs. RANK vs. DENSE_RANK (tie handling, rank gap behavior, and syntax)
- PARTITION BY and SQL Execution Order Filter Trap (window functions in WHERE ORA-30483, SELECT aliases in WHERE ORA-00904, and inline view resolution)
- Positional Navigation Functions: LEAD and LAG (forward/backward row access, offset, default value handling, and boundary behavior)
- Aggregate Window Functions and Default Framing (Grand Total with OVER () vs. Cumulative Running Total with OVER (ORDER BY))

# Practice Questions Completed
- 1. Calculate ranks for tied salary values using RANK (1, 2, 2, 4) and DENSE_RANK (1, 2, 2, 3) - Solved
- 2. Identify query failure when placing window functions in WHERE clause and fix via inline subquery - Solved
- 3. Calculate LEAD and LAG boundary values with explicit and default NULL fallbacks (0, NULL) - Solved
- 4. Calculate Grand Total (6000) vs Running Total (3000) using window framing defaults - Solved
