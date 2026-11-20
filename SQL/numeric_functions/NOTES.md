# Numeric Functions - Notes

## 1. Rounding Numbers (ROUND)
- **Syntax**: `ROUND(number [, decimal_places])`
- Uses standard mathematical rounding (>= 5 rounds up, < 5 rounds down).
- `decimal_places = 0` (or omitted): Rounds to the nearest whole integer (e.g., `ROUND(45.6)` → `46`).
- `decimal_places > 0`: Rounds to decimal places to the right (e.g., `ROUND(45.926, 2)` → `45.93`).
- `decimal_places < 0`: Rounds left of the decimal point to whole place values:
  - `-1` = nearest 10 (e.g., `ROUND(67, -1)` → `70`).
  - `-2` = nearest 100 (e.g., `ROUND(768.45, -2)` → `800`).

## 2. Truncating Numbers (TRUNC)
- **Syntax**: `TRUNC(number [, decimal_places])`
- Chops off digits without any rounding.
- `decimal_places = 0` (or omitted): Discards all decimal values (e.g., `TRUNC(45.9)` → `45`).
- `decimal_places > 0`: Cuts off digits right of the specified position (e.g., `TRUNC(45.926, 2)` → `45.92`).
- `decimal_places < 0`: Replaces whole number places with zeros without rounding up (e.g., `TRUNC(159.85, -1)` → `150`).

## 3. Modulo Function (MOD)
- **Syntax**: `MOD(m, n)`
- Returns the remainder of `m` divided by `n`.
- **Sign of Result**: In Oracle, `MOD(m, n)` takes the mathematical sign of the first parameter `m` (dividend) (e.g., `MOD(-11, 4)` → `-3`, `MOD(11, -4)` → `3`).
- **Even/Odd Filter Pattern**:
  - Even: `MOD(column, 2) = 0`
  - Odd: `MOD(column, 2) = 1`
- Example: `SELECT transaction_id FROM transactions WHERE MOD(transaction_id, 2) = 1;`

## 4. Integer Boundaries (CEIL & FLOOR)
- **CEIL(n)**: Rounds UP to the nearest integer greater than or equal to `n` (e.g., `CEIL(4.2)` → `5`).
  - With negative numbers: `CEIL(-7.2)` → `-7` (pushes towards zero/positive).
- **FLOOR(n)**: Rounds DOWN to the nearest integer less than or equal to `n` (e.g., `FLOOR(7.9)` → `7`).
  - With negative numbers: `FLOOR(-7.2)` → `-8` (pushes towards more negative).
- Example: `SELECT CEIL(-7.2), FLOOR(7.9) FROM DUAL;` returns `-7` and `7`.
