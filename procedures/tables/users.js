const { Client } = require("pg")
const winston = require("winston")

const client = new Client({
  connectionString:
    "postgres://gbpaytdx:bhl8nviSImZ0Xwk0w9xPbRl11VpOaqax@lallah.db.elephantsql.com/gbpaytdx",
  ssl: {
    rejectUnauthorized: false,
  },
})

client
  .connect()
  .then(() => {
    winston.info("Connected to DB")
  })
  .catch((ex) => {
    winston.error(ex)
  });

client.query(`
CREATE OR REPLACE FUNCTION average_salary()
LANGUAGE PLPGSQL
AS $$
BEGIN
SELECT AVG(salary) FROM Employees
END 
$$;

CREATE OR REPLACE FUNCTION average_salary(IN user_id INTEGER)
LANGUAGE PLPGSQL
AS $$
BEGIN
SELECT 
e.id,
e.name,
e.email,
e.phone,
e.salary,
e.password,
e.education,
e.age,
e.isadmin,
s.name AS performance_status,
d.name AS department,
d.position AS position,
array_agg(sk.name) AS skills,
array_agg(l.name) as skill_level,
ex.company,
b.package
FROM Employees e
JOIN Performances p ON p.employee_id = e.id 
JOIN Statuses s ON p.status_id = s.id
JOIN Benefits b ON b.employee_id = e.id
JOIN Departments d ON d.employee_id = e.id
JOIN Experiences ex ON ex.employee_id = e.id
JOIN Skills sk ON sk.employee_id = e.id
JOIN Levels l ON sk.level_id = l.id
WHERE e.id = user_id
GROUP BY e.id,
e.name, 
e.email, 
e.phone,
e.salary,
e.password, 
e.education, 
e.age, 
e.isadmin, 
s.name,
p.employee_id, 
d.name,
d.position, 
ex.company, 
b.package;
END 
$$;

CREATE OR REPLACE FUNCTION create_user(
  IN u_name VARCHAR,
  IN u_email VARCHAR,
  IN phone SMALLINT,
  IN password VARCHAR,
  IN u_education VARCHAR,
  IN u_age SMALLINT,
  IN u_isAdmin BOOL,
  IN u_total_working_days INT,
  IN u_working_days INT,
  IN u_total_leaves INT,
  IN u_leaves INT,
  IN manager_id INT
  )

LANGUAGE PLPGSQL
AS $$
BEGIN
INSERT INTO Employees(name, email,phone,salary, password,education, age, isAdmin,total_working_days, working_days,total_leaves,leaves,manager_id)
VALUES (u_name, u_email,u_phone,u_salary, u_password,u_education, u_age, u_isAdmin,u_total_working_days, u_working_days,u_total_leaves,u_leaves,u_manager_id)
RETURNING *
END
$$;

CREATE OR REPLACE FUNCTION update_user(
  IN u_name VARCHAR,
  IN u_email VARCHAR,
  IN phone SMALLINT,
  IN password VARCHAR,
  IN u_education VARCHAR,
  IN u_age SMALLINT,
  IN u_isAdmin BOOL
  IN u_id INTEGER
    )
LANGUAGE PLPGSQL
AS $$
BEGIN
UPDATE Employees
SET name = u_name,
email = u_email,
phone = u_phone,
education = u_phone,
age = u_age,
salary = u_isAdmin

WHERE id = u_id
RETURNING *
END 
$$;

CREATE OR REPLACE FUNCTION(
 IN user_id INTEGER
)
LANGUAGE PLPGSQL
AS $$
BEGIN
DELETE FROM Employees
WHERE id = 
END
$$

`, [

]);