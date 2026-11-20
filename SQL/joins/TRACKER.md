# Concepts Covered
- Cartesian Product & CROSS JOIN (unconditional row multiplication)
- NATURAL JOIN (automatic matching on identical names/types and qualifier prohibition rule)
- Joining with USING clause (selective common column matching and qualifier restriction)
- JOIN ... ON (Inner Join, column disambiguation with qualifiers, 'column ambiguously defined' error)
- Self Joins (joining a table to itself using distinct table aliases)
- Non-Equijoins (joining on ranges with BETWEEN ... AND ... or inequality operators)
- Outer Joins: LEFT OUTER JOIN (preserving unmatched rows from the left table)
- RIGHT OUTER JOIN and FULL OUTER JOIN (symmetric and bilateral unmatched row preservation)
- Oracle Proprietary (+) Outer Join Operator (deficient side rule and prohibition of bilateral (+) for full outer join)

# Practice Questions Completed
- 1. Calculate row count for Cartesian product using CROSS JOIN (5 * 4 = 20) - Solved
- 2. Identify failure due to table qualifier on NATURAL JOIN column - Solved
- 3. Predict execution validity with USING clause qualifiers (Query 1 succeeds, Query 2 fails) - Solved
- 4. Write JOIN ... ON query with table aliases to avoid ambiguous column definition - Solved
- 5. Query employee and manager data using Self Join on employees table - Solved
- 6. Match student scores against grade ranges using Non-Equijoin with BETWEEN - Solved
- 7. Predict row preservation in LEFT OUTER JOIN with unmatched rows - Solved
- 8. Select appropriate outer join (FULL OUTER JOIN) to preserve unmatched rows from both sides - Solved
- 9. Translate Oracle (+) syntax to ANSI LEFT OUTER JOIN - Solved
