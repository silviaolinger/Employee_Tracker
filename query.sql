Select
e.id AS ID,
e.first_name AS First,
e.last_name AS Last,
e.role1_id AS Role1,
r.salary AS Salary,
m.last_name AS Manager,
d.name AS Department

FROM employee e
LEFT JOIN employee m
ON e.manager_id = m.id

LEFT JOIN role1 r
on e.role1_id = r.title

LEFT JOIN department d 
on r.department_id = d.id
