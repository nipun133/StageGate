module.exports = {
  "1": [
    {
      "sql": "-- Standard: Date arithmetic operates in units of whole days (24 hours)\nSELECT TO_DATE('15-NOV-2026') + 7 AS plus_seven_days,\n       TO_DATE('15-NOV-2026') - 10 AS minus_ten_days\nFROM dual;",
      "output": "PLUS_SEVEN_DAYS  MINUS_TEN_DAYS\n---------------  --------------\n22-NOV-26        05-NOV-26     "
    },
    {
      "sql": "-- Standard: Date minus Date returns total number of days as a numeric value\nSELECT TO_DATE('25-DEC-2026') - TO_DATE('15-NOV-2026') AS day_diff FROM dual;",
      "output": "  DAY_DIFF\n----------\n        40"
    },
    {
      "sql": "-- Feature: Fractional time arithmetic (1 hour = 1/24; 1 minute = 1/(24*60))\nSELECT TO_CHAR(TO_DATE('15-NOV-2026 10:00', 'DD-MON-YYYY HH24:MI') + (4/24), 'DD-MON-YYYY HH24:MI') AS plus_4_hrs,\n       TO_CHAR(TO_DATE('15-NOV-2026 10:00', 'DD-MON-YYYY HH24:MI') + (30/(24*60)), 'DD-MON-YYYY HH24:MI') AS plus_30_mins\nFROM dual;",
      "output": "PLUS_4_HRS         PLUS_30_MINS    \n-----------------  ----------------\n15-NOV-2026 14:00  15-NOV-2026 10:30"
    }
  ],
  "2": [
    {
      "sql": "-- Standard: MONTHS_BETWEEN(dt1, dt2) returns exact integer if both dates have same day of month\nSELECT MONTHS_BETWEEN(TO_DATE('01-JUL-2026'), TO_DATE('01-JAN-2026')) AS mths_pos FROM dual;",
      "output": "  MTHS_POS\n----------\n         6"
    },
    {
      "sql": "-- Rule: Sign rule: Positive if dt1 > dt2; Negative if dt1 < dt2\nSELECT MONTHS_BETWEEN(TO_DATE('01-JAN-2026'), TO_DATE('01-JUL-2026')) AS mths_neg FROM dual;",
      "output": "  MTHS_NEG\n----------\n        -6"
    },
    {
      "sql": "-- Exam Trap: Month-end rule: If BOTH dates are month-end dates, Oracle yields an exact whole integer\nSELECT MONTHS_BETWEEN(TO_DATE('31-MAR-2023'), TO_DATE('28-FEB-2023')) AS mths_month_end FROM dual;",
      "output": "MTHS_MONTH_END\n--------------\n             1"
    },
    {
      "sql": "-- Fractional: If day numbers differ and are not month-ends, Oracle calculates fraction based on a 31-day month\nSELECT ROUND(MONTHS_BETWEEN(TO_DATE('15-FEB-2026'), TO_DATE('01-JAN-2026')), 4) AS mths_frac FROM dual;\n-- Calculation: 1 month + (14 days / 31) = 1.4516",
      "output": " MTHS_FRAC\n----------\n    1.4516"
    }
  ],
  "3": [
    {
      "sql": "-- Standard: ADD_MONTHS moves date forward (>0) or backward (<0) by calendar months\nSELECT ADD_MONTHS(TO_DATE('15-JAN-2026'), 3) AS fwd_3_mths,\n       ADD_MONTHS(TO_DATE('15-JAN-2026'), -2) AS back_2_mths\nFROM dual;",
      "output": "FWD_3_MTHS  BACK_2_MTHS\n----------  -----------\n15-APR-26   15-NOV-25  "
    },
    {
      "sql": "-- Exam Trap: If starting date is the last day of the month, result is strictly the last day of target month\nSELECT ADD_MONTHS(TO_DATE('28-FEB-2023'), 1) AS eom_target FROM dual;",
      "output": "EOM_TARGET\n----------\n31-MAR-23 "
    },
    {
      "sql": "-- Rule: If target month has fewer days than starting day, Oracle adjusts to target month's final day\nSELECT ADD_MONTHS(TO_DATE('31-AUG-2026'), 1) AS adjusted_sept FROM dual;",
      "output": "ADJUSTED_SEPT\n-------------\n30-SEP-26    "
    }
  ],
  "4": [
    {
      "sql": "-- Standard: NEXT_DAY returns next specified weekday (accepts day name or day number 1-7 where 1=Sunday)\nSELECT NEXT_DAY(TO_DATE('13-NOV-2026'), 'FRIDAY') AS next_fri_named,\n       NEXT_DAY(TO_DATE('13-NOV-2026'), 6) AS next_fri_num\nFROM dual;",
      "output": "NEXT_FRI_NAMED  NEXT_FRI_NUM\n--------------  ------------\n20-NOV-26       20-NOV-26   "
    },
    {
      "sql": "-- Standard: LAST_DAY returns the final date of the month (automatically handles leap years)\nSELECT LAST_DAY(TO_DATE('15-FEB-2024')) AS leap_feb,\n       LAST_DAY(TO_DATE('15-FEB-2023')) AS normal_feb\nFROM dual;",
      "output": "LEAP_FEB   NORMAL_FEB\n---------  ----------\n29-FEB-24  28-FEB-23 "
    },
    {
      "sql": "-- Practical Formula: Calculating remaining days in the month\nSELECT LAST_DAY(TO_DATE('13-NOV-2026')) - TO_DATE('13-NOV-2026') AS days_left FROM dual;",
      "output": " DAYS_LEFT\n----------\n        17"
    }
  ],
  "5": [
    {
      "sql": "-- Standard: TRUNC rolls date back to the start of the specified period (01 of month or 01-JAN of year)\nSELECT TRUNC(TO_DATE('25-DEC-2026'), 'MONTH') AS trunc_mth,\n       TRUNC(TO_DATE('25-DEC-2026'), 'YEAR') AS trunc_yr\nFROM dual;",
      "output": "TRUNC_MTH  TRUNC_YR \n---------  ---------\n01-DEC-26  01-JAN-26"
    },
    {
      "sql": "-- Exam Trap: ROUND to 'MONTH': Days 1-15 round DOWN to 1st of month; Days 16+ round UP to 1st of next month\nSELECT ROUND(TO_DATE('15-SEP-2026'), 'MONTH') AS r_mth_down,\n       ROUND(TO_DATE('16-SEP-2026'), 'MONTH') AS r_mth_up\nFROM dual;",
      "output": "R_MTH_DOWN  R_MTH_UP \n----------  ---------\n01-SEP-26   01-OCT-26"
    },
    {
      "sql": "-- Exam Trap: ROUND to 'YEAR': Months 1-6 round DOWN to 01-JAN; Months 7-12 round UP to next 01-JAN\nSELECT ROUND(TO_DATE('15-JUN-2026'), 'YEAR') AS r_yr_down,\n       ROUND(TO_DATE('01-JUL-2026'), 'YEAR') AS r_yr_up\nFROM dual;",
      "output": "R_YR_DOWN  R_YR_UP  \n---------  ---------\n01-JAN-26  01-JAN-27"
    },
    {
      "sql": "-- Feature: Default ROUND without format model rounds to nearest day based on 12:00 PM (noon) cutoff\nSELECT ROUND(TO_DATE('15-NOV-2026 11:59', 'DD-MON-YYYY HH24:MI')) AS r_morn,\n       ROUND(TO_DATE('15-NOV-2026 12:01', 'DD-MON-YYYY HH24:MI')) AS r_aft\nFROM dual;",
      "output": "R_MORN     R_AFT    \n---------  ---------\n15-NOV-26  16-NOV-26"
    }
  ]
};
