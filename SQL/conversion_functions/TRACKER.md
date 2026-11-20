# Concepts Covered
- Implicit vs Explicit Conversion and Destination Naming Principle (TO_CHAR, TO_DATE, TO_NUMBER)
- Date Formatting with TO_CHAR (YYYY, MM, DD, MON, DAY, and MM vs MI distinction)
- Number Formatting with TO_CHAR (9, 0, $, L, comma, decimal, and ### overflow trap)
- Converting Strings to Dates with TO_DATE and the RR vs YY Century Rule
- Converting Strings to Numbers with TO_NUMBER and Matching Format Models
- General Functions with COALESCE (first non-null evaluation and short-circuiting)
- General Functions with NULLIF (equality to NULL conversion and preventing division-by-zero)
- Conditional Logic with CASE Expressions (WHEN, THEN, ELSE, END)
- Oracle Proprietary DECODE Function (equality matching and DECODE vs CASE distinction)

# Practice Questions Completed
- 1. Identify target data type conversion function (TO_DATE for string to date) - Solved
- 2. Format date into custom string using TO_CHAR(hire_date, 'YYYY/MM/DD') - Solved
- 3. Format numeric currency using TO_CHAR(8450, '$9,999') - Solved
- 4. Determine century resolution using RR format model (1985) - Solved
- 5. Convert formatted currency string to number using TO_NUMBER and '$9,999' - Solved
- 6. Evaluate multi-argument COALESCE to find first non-null value (50) - Solved
- 7. Evaluate NULLIF equality vs inequality outputs (NULL and Apple) - Solved
- 8. Write conditional logic using CASE expression with ELSE and END - Solved
- 9. Identify limitation of DECODE requiring CASE for range comparisons - Solved
