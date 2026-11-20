# Concepts Covered
- Single-Row Subqueries (syntax, parentheses, single-row comparison operators)
- The Single-Row Subquery Error Trap ('single-row subquery returns more than one row')
- Multiple-Row Subqueries with IN operator
- Multiple-Row Operators: ANY and ALL (> ANY, < ANY, > ALL, < ALL)
- The NOT IN with NULL Trap (AND expansion, UNKNOWN poisoning, and 0-row result)
- Multiple-Column Subqueries (pairwise comparison preventing cross-group false matches)
- Correlated Subqueries & EXISTS / NOT EXISTS (row-by-row correlation and immunity to NULLs)

# Practice Questions Completed
- 1. Query employees earning more than a specific person using a single-row subquery - Solved
- 2. Identify failure when subquery returns multiple rows with single-row operator (=) - Solved
- 3. Filter outer query using multiple-row subquery with IN operator - Solved
- 4. Evaluate > ALL operator behavior against list of values (more than 4000) - Solved
- 5. Predict query output for NOT IN containing NULL values (0 rows) - Solved
- 6. Match pairwise tuples (category_id, price) using multiple-column subquery - Solved
- 7. Find records with zero child matches using correlated NOT EXISTS - Solved
