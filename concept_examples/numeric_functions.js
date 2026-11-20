module.exports = {
  "1": [
    {
      "sql": "-- Standard: Positive decimal places round to specified precision (>= 5 rounds up)\nSELECT ROUND(45.923, 2) AS r_down,\n       ROUND(45.926, 2) AS r_up\nFROM dual;",
      "output": "    R_DOWN      R_UP\n----------  --------\n     45.92     45.93"
    },
    {
      "sql": "-- Standard: 0 or omitted decimal places rounds to nearest whole integer\nSELECT ROUND(45.4) AS r_int_down,\n       ROUND(45.5) AS r_int_up\nFROM dual;",
      "output": "R_INT_DOWN  R_INT_UP\n----------  --------\n        45        46"
    },
    {
      "sql": "-- Feature: Negative places round left of decimal to tens (-1) or hundreds (-2)\nSELECT ROUND(67, -1) AS near_ten,\n       ROUND(768.45, -2) AS near_hundred\nFROM dual;",
      "output": "  NEAR_TEN  NEAR_HUNDRED\n----------  ------------\n        70           800"
    }
  ],
  "2": [
    {
      "sql": "-- Standard: Positive decimal places chop off digits without rounding\nSELECT TRUNC(45.923, 2) AS t_down,\n       TRUNC(45.929, 2) AS t_still_down\nFROM dual;",
      "output": "    T_DOWN  T_STILL_DOWN\n----------  ------------\n     45.92         45.92"
    },
    {
      "sql": "-- Standard: 0 or omitted decimal places discards all decimal portions\nSELECT TRUNC(45.99) AS t_int FROM dual;",
      "output": "     T_INT\n----------\n        45"
    },
    {
      "sql": "-- Feature: Negative places replace whole place values with zero without rounding up\nSELECT TRUNC(159.85, -1) AS trunc_ten,\n       TRUNC(768.45, -2) AS trunc_hundred\nFROM dual;",
      "output": " TRUNC_TEN  TRUNC_HUNDRED\n----------  -------------\n       150            700"
    }
  ],
  "3": [
    {
      "sql": "-- Standard: MOD(m, n) returns remainder; common for even/odd testing\nSELECT MOD(11, 4) AS remainder,\n       MOD(10, 2) AS even_check,\n       MOD(11, 2) AS odd_check\nFROM dual;",
      "output": " REMAINDER  EVEN_CHECK  ODD_CHECK\n----------  ----------  ---------\n         3           0          1"
    },
    {
      "sql": "-- Exam Trap: In Oracle, MOD(m, n) takes the mathematical sign of the dividend (m)\nSELECT MOD(-11, 4) AS neg_dividend,\n       MOD(11, -4) AS neg_divisor\nFROM dual;",
      "output": "NEG_DIVIDEND  NEG_DIVISOR\n------------  -----------\n          -3            3"
    }
  ],
  "4": [
    {
      "sql": "-- Standard: CEIL rounds up to next integer; FLOOR rounds down to previous integer\nSELECT CEIL(4.2) AS ceil_pos,\n       FLOOR(7.9) AS floor_pos\nFROM dual;",
      "output": "  CEIL_POS  FLOOR_POS\n----------  ---------\n         5          7"
    },
    {
      "sql": "-- Exam Trap: Negative numbers (CEIL pushes toward zero; FLOOR pushes toward negative infinity)\nSELECT CEIL(-7.2) AS ceil_neg,\n       FLOOR(-7.2) AS floor_neg\nFROM dual;",
      "output": "  CEIL_NEG  FLOOR_NEG\n----------  ---------\n        -7         -8"
    }
  ]
};
