# Character Functions - Notes

## 1. Case Conversion Functions
- **UPPER(str)**: Converts all letters to uppercase (`UPPER('sql')` → `'SQL'`).
- **LOWER(str)**: Converts all letters to lowercase (`LOWER('SQL')` → `'sql'`).
- **INITCAP(str)**: Capitalizes the first letter of each word and sets the rest to lowercase (`INITCAP('stage gate')` → `'Stage Gate'`).
- **Case-Insensitive Search Pattern**: Use `UPPER()` or `LOWER()` in the `WHERE` clause to bypass Oracle's strict case sensitivity:
  `SELECT * FROM users WHERE LOWER(email) = 'admin@deloitte.com';`

## 2. String Length (LENGTH)
- **Syntax**: `LENGTH(string)`
- Returns the total count of characters as an integer (spaces are included).
- `LENGTH(NULL)` returns `NULL` (not 0).
- Example: `SELECT * FROM user_accounts WHERE LENGTH(password) < 8;`

## 3. Substring Extraction (SUBSTR)
- **Syntax**: `SUBSTR(string, start_position [, length])`
- `start_position`: 1-based index (1 is the first character).
- `length` (optional): Count of characters to extract; if omitted, extracts to the end of the string.
- **Negative Index**: Counts backwards from the end of the string (`-1` is the last character).
- **Start Position 0**: Oracle treats a start position of `0` as `1` (e.g., `SUBSTR('Oracle', 0, 3)` returns `'Ora'`).
- Character case is preserved from the original string.
- Example: `SUBSTR('Database', -3, 2)` starts 3 characters from the end ('a') and takes 2 characters → `'as'`.

## 4. Finding String Positions (INSTR)
- **Syntax**: `INSTR(string, substring [, start_position [, occurrence]])`
- Returns the numeric 1-based index where the substring is located.
- Returns `0` if the substring is not found (not NULL, not an error).
- `start_position` (default 1): Index where the search begins.
- `occurrence` (default 1): Which instance to find (e.g., `2` for second appearance).
- Example: `SELECT INSTR('Stage Gate Exam', 'a', 1, 2) FROM DUAL;` returns `8` (2nd 'a' is at index 8).

## 5. String Padding (LPAD & RPAD)
- **Syntax**: `LPAD(string, total_length, pad_char)` and `RPAD(string, total_length, pad_char)`
- `LPAD`: Fills the left side with `pad_char` until the string reaches `total_length`.
- `RPAD`: Fills the right side with `pad_char` until the string reaches `total_length`.
- **Truncation Behavior**: If `total_length` is less than the string's actual length, Oracle truncates the string to that length without error (e.g., `LPAD('Deloitte', 4, '*')` → `'Delo'`).
- Example: `SELECT RPAD('Oracle', 8, '-') FROM DUAL;` returns `'Oracle--'`.

## 6. Trimming Characters (TRIM)
- **Syntax**: `TRIM([LEADING | TRAILING | BOTH] [trim_char FROM] string)`
- Default `TRIM(str)` removes leading and trailing whitespace.
- Can remove a specific character from the front (`LEADING`), back (`TRAILING`), or `BOTH`.
- **Strict Constraint**: `TRIM` can only accept **one single character**. Passing multiple characters (e.g., `TRIM('12' FROM ...)`) raises: `trim set should have only one character`.
- Example: `SELECT TRIM(LEADING '0' FROM '00045') FROM DUAL;` returns `'45'`.

## 7. Substring Replacement (REPLACE)
- **Syntax**: `REPLACE(source_string, search_string [, replacement_string])`
- Searches the entire string and replaces all occurrences of `search_string`.
- Can handle multi-character patterns.
- If `replacement_string` is omitted, all occurrences of `search_string` are deleted.
- Example: `SELECT REPLACE('Stage Gate Exam', ' ', '_') FROM DUAL;` returns `'Stage_Gate_Exam'`.
