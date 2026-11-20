module.exports = {
  "1": [
    {
      "sql": "-- Standard: Case conversion functions (UPPER, LOWER, INITCAP)\nSELECT UPPER('stage gate') AS u_val,\n       LOWER('STAGE GATE') AS l_val,\n       INITCAP('stage gate exam') AS init_val\nFROM dual;",
      "output": "U_VAL       L_VAL       INIT_VAL\n----------  ----------  ---------------\nSTAGE GATE  stage gate  Stage Gate Exam"
    },
    {
      "sql": "-- Practical Pattern: Case-insensitive search using UPPER() in WHERE clause\nSELECT first_name, last_name, email\nFROM employees\nWHERE UPPER(last_name) = 'KING';",
      "output": "FIRST_NAME  LAST_NAME  EMAIL\n----------  ---------  --------\nSteven      King       SKING\nJanette     King       JKING"
    }
  ],
  "2": [
    {
      "sql": "-- Standard: LENGTH counts total characters including spaces\nSELECT LENGTH('Oracle SQL') AS len_with_space,\n       LENGTH('Database') AS len_word\nFROM dual;",
      "output": "LEN_WITH_SPACE  LEN_WORD\n--------------  --------\n            10         8"
    },
    {
      "sql": "-- Exam Trap: LENGTH(NULL) returns NULL (not zero!)\nSELECT LENGTH(NULL) AS null_len FROM dual;",
      "output": "NULL_LEN\n--------\n  <NULL>"
    }
  ],
  "3": [
    {
      "sql": "-- Standard: SUBSTR(str, start_pos, length) with 1-based indexing\nSELECT SUBSTR('Database', 1, 4) AS extract_val FROM dual;",
      "output": "EXTRACT_VAL\n-----------\nData"
    },
    {
      "sql": "-- Feature: Omitted length parameter extracts from start position through the end\nSELECT SUBSTR('Database', 5) AS tail_val FROM dual;",
      "output": "TAIL_VAL\n--------\nbase"
    },
    {
      "sql": "-- Feature: Negative start position counts backwards from the end of the string\nSELECT SUBSTR('Database', -3, 2) AS neg_extract FROM dual;\n-- Starts 3 from end ('a') and takes 2 characters",
      "output": "NEG_EXTRACT\n-----------\nas"
    },
    {
      "sql": "-- Oracle Edge Case: Start position 0 is treated as 1\nSELECT SUBSTR('Oracle', 0, 3) AS zero_start FROM dual;",
      "output": "ZERO_START\n----------\nOra"
    },
    {
      "sql": "-- Edge Case: Start position greater than string length returns NULL (no error)\nSELECT SUBSTR('Oracle', 10, 2) AS out_of_bounds FROM dual;",
      "output": "OUT_OF_BOUNDS\n-------------\n       <NULL>"
    }
  ],
  "4": [
    {
      "sql": "-- Standard: INSTR returns 1-based numeric position of first occurrence\nSELECT INSTR('Corporate Floor', 'or') AS first_pos FROM dual;",
      "output": "FIRST_POS\n---------\n        2"
    },
    {
      "sql": "-- Parameter: Occurrence parameter finds the N-th instance\nSELECT INSTR('Corporate Floor', 'or', 1, 2) AS second_pos FROM dual;",
      "output": "SECOND_POS\n----------\n         5"
    },
    {
      "sql": "-- Parameter: Custom start position controls where search begins\nSELECT INSTR('Corporate Floor', 'or', 3) AS from_pos_three FROM dual;",
      "output": "FROM_POS_THREE\n--------------\n             5"
    },
    {
      "sql": "-- Exam Trap: Substring not found returns 0 (not NULL, not an error!)\nSELECT INSTR('Oracle', 'xyz') AS missing_pos FROM dual;",
      "output": "MISSING_POS\n-----------\n          0"
    }
  ],
  "5": [
    {
      "sql": "-- Standard: LPAD and RPAD pad string up to total target length\nSELECT LPAD('123', 6, '0') AS left_padded,\n       RPAD('Oracle', 10, '*') AS right_padded\nFROM dual;",
      "output": "LEFT_PADDED  RIGHT_PADDED\n-----------  ------------\n000123       Oracle****  "
    },
    {
      "sql": "-- Exam Trap: When total length is shorter than original string, Oracle truncates without error\nSELECT LPAD('Deloitte', 4, '*') AS trunc_lpad,\n       RPAD('Deloitte', 4, '*') AS trunc_rpad\nFROM dual;",
      "output": "TRUNC_LPAD  TRUNC_RPAD\n----------  ----------\nDelo        Delo      "
    }
  ],
  "6": [
    {
      "sql": "-- Standard: Default TRIM removes leading and trailing spaces\nSELECT '[' || TRIM('   Stage Gate   ') || ']' AS clean_str FROM dual;",
      "output": "CLEAN_STR\n------------\n[Stage Gate]"
    },
    {
      "sql": "-- Feature: Targeted trim removes specified character from LEADING, TRAILING, or BOTH\nSELECT TRIM(LEADING '0' FROM '00045') AS no_lead_zero,\n       TRIM(BOTH '*' FROM '***Exam***') AS no_stars\nFROM dual;",
      "output": "NO_LEAD_ZERO  NO_STARS\n------------  --------\n45            Exam    "
    },
    {
      "sql": "-- Exam Trap: TRIM strictly accepts only ONE single character; multi-character raises error\nSELECT TRIM('12' FROM '1212Apple12') FROM dual;\n-- Error: trim set should have only one character",
      "output": "Error: trim set should have only one character\nCause: The trim character argument must be a single character literal. (Use REPLACE for multi-character)."
    }
  ],
  "7": [
    {
      "sql": "-- Standard: REPLACE substitutes all occurrences of search pattern\nSELECT REPLACE('Stage Gate Exam', ' ', '_') AS underscore_str FROM dual;",
      "output": "UNDERSCORE_STR\n---------------\nStage_Gate_Exam"
    },
    {
      "sql": "-- Feature: Omitting replacement string deletes all occurrences of search pattern\nSELECT REPLACE('2024-Q1-REPORT-FINAL', '-') AS stripped_str FROM dual;",
      "output": "STRIPPED_STR\n------------------\n2024Q1REPORTFINAL"
    },
    {
      "sql": "-- Multi-Character: Replaces multi-character words throughout the string\nSELECT REPLACE('Red Car, Red House, Red Light', 'Red', 'Blue') AS swapped_str FROM dual;",
      "output": "SWAPPED_STR\n--------------------------------\nBlue Car, Blue House, Blue Light"
    }
  ]
};
