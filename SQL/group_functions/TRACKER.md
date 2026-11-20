# Concepts Covered
- Standard Group Functions (AVG, SUM, MIN, MAX, COUNT) and Datatype Support
- Group Functions and NULLs (COUNT(*) vs COUNT(col) and AVG with NVL)
- DISTINCT Keyword inside Group Functions (COUNT(DISTINCT col))
- Grouping Rows with GROUP BY and the 'not a single-group group function' Error Rule
- Filtering Groups with HAVING (HAVING vs WHERE and 'group function is not allowed here' error)
- Nesting Group Functions (2-level limit and prohibition of individual columns in SELECT list)

# Practice Questions Completed
- 1. Calculate maximum salary and most recent date using MAX() - Solved
- 2. Predict output of COUNT(*) vs COUNT(col) with NULL values (10 and 7) - Solved
- 3. Count unique entities using COUNT(DISTINCT customer_id) - Solved
- 4. Identify query failure when unaggregated column (job_id) is omitted from GROUP BY - Solved
- 5. Filter aggregated groups using HAVING COUNT(*) > 5 - Solved
- 6. Identify failure when individual column is selected with nested group functions - Solved
