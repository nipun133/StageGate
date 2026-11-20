# Date Functions - Notes

## 1. Date Arithmetic
- Oracle `DATE` datatype internally stores century, year, month, day, hours, minutes, and seconds.
- The unit `1` represents **1 whole day** (24 hours).
- `date + n`: Adds `n` days to the date (returns a Date).
- `date - n`: Subtracts `n` days from the date (returns a Date).
- `date1 - date2`: Calculates difference between dates (returns **number of days** as a numeric value).
- Adding fractional time: 1 hour = `1/24`, 1 minute = `1/(24*60)`.
- Example: `SELECT SYSDATE - hire_date AS "TOTAL DAYS" FROM employees;`

## 2. Calculating Months (MONTHS_BETWEEN)
- **Syntax**: `MONTHS_BETWEEN(date1, date2)`
- Returns the number of months between two dates.
- **Sign Rule**:
  - Positive if `date1` is later than `date2`.
  - Negative if `date1` is earlier than `date2`.
- Returns an exact whole integer if both dates share the same day of the month or are both month-end dates; otherwise returns a decimal.
- Example: `SELECT MONTHS_BETWEEN('01-JAN-2024', '01-JUL-2024') FROM DUAL;` returns `-6`.

## 3. Adding / Subtracting Months (ADD_MONTHS)
- **Syntax**: `ADD_MONTHS(start_date, n)`
- Moves a date forward (if `n > 0`) or backward (if `n < 0`) by `n` calendar months.
- **Month-End Rules**:
  - If `start_date` is on the last day of the month, the result is automatically the last day of the target month (e.g., `ADD_MONTHS('28-FEB-2023', 1)` → `'31-MAR-2023'`).
  - If the target month has fewer days than the starting day, it adjusts to that month's final day (e.g., `ADD_MONTHS('31-AUG-2024', 1)` → `'30-SEP-2024'`).

## 4. Key Date Finders (NEXT_DAY & LAST_DAY)
- **NEXT_DAY(date, 'day_of_week')**: Returns the date of the next specified weekday after the given date (e.g., `'FRIDAY'`, or number `1-7` where 1 = Sunday).
- **LAST_DAY(date)**: Returns the date of the last day of the month containing `date` (handles leap years automatically).
- Remaining days in current month formula: `LAST_DAY(SYSDATE) - SYSDATE`.
- Example: `SELECT LAST_DAY('05-FEB-2023') FROM DUAL;` returns `'28-FEB-2023'`.

## 5. Date Rounding & Truncation (ROUND & TRUNC)
- Applied to dates using format models such as `'MONTH'` or `'YEAR'`.
- **Default to Day**: `ROUND(date)` without format model rounds to nearest day (cutoff is 12:00 PM / noon).
- **With `'MONTH'`**:
  - `ROUND`: Days 1-15 round down to 1st of current month; days 16-31 round up to 1st of next month.
  - `TRUNC`: Always chops down to the 1st of the current month.
- **With `'YEAR'`**:
  - `ROUND`: Jan-Jun rounds down to 01-JAN current year; Jul-Dec rounds up to 01-JAN next year.
  - `TRUNC`: Always chops down to 01-JAN of current year.
- Example:
  - `ROUND('25-OCT-2024', 'MONTH')` → `'01-NOV-2024'`
  - `TRUNC('25-OCT-2024', 'MONTH')` → `'01-OCT-2024'`
