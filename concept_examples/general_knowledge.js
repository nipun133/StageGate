module.exports = {
  1: [
    {
      sql: "SELECT department_id, COUNT(*) AS dept_count\nFROM employees\nWHERE salary > 3000\nGROUP BY department_id\nHAVING COUNT(*) >= 2\nORDER BY dept_count DESC;",
      output: "DEPARTMENT_ID  DEPT_COUNT\n-------------  ----------\n           50           5\n           80           3\n           60           2"
    }
  ]
};
