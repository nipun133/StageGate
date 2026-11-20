# SQL Practice Drills (Pure Random Mixed Questions)

## Question 1: Employees Earning More Than Their Managers

### Table: Employee
| Column Name | Type |
| :--- | :--- |
| `id` | NUMBER (PK) |
| `name` | VARCHAR2(50) |
| `salary` | NUMBER |
| `manager_id` | NUMBER |

### Sample Data:
| id | name | salary | manager_id |
| :--- | :--- | :--- | :--- |
| 1 | Joe | 70000 | 3 |
| 2 | Henry | 80000 | 4 |
| 3 | Sam | 60000 | NULL |
| 4 | Max | 90000 | NULL |

### Task:
Write an Oracle SQL query to find the employees who earn **more than their managers**.  
Return the result table with the column header aliased as **`Employee`**.
