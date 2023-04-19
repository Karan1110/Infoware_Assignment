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
SELECT name,salary
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
INSERT INTO Employees(name, email,phone,salary, password,education, age, isAdmin,total_working_days, working_days,total_leaves,leaves,manager_id,salary_debited)
VALUES (u_name, u_email,u_phone,u_salary, u_password,u_education, u_age, u_isAdmin,u_total_working_days, u_working_days,u_total_leaves,u_leaves,u_manager_id,u_salary_debited)
RETURNING *





END
$$;


CREATE OR REPLACE FUNCTION update_user()
AS $$
LANGUAGE PLPGSQL
BEGIN

BEGIN TRANSACTION 
SELECT e.salary - d.employee_tax AS in_hand_salary
JOIN Departments d ON e.id = d.employee_id
FROM Employees e

UPDATE Employees
SET salary_debited = true

COMMIT

END
$$;


CREATE OR REPLACE FUNCTION update_user(
  IN u_name VARCHAR,
  IN u_email VARCHAR,
  IN u_phone SMALLINT,
  IN u_password VARCHAR,
  IN u_education VARCHAR,
  IN u_age SMALLINT,
  IN u_isAdmin BOOL,
  IN u_id INTEGER,
  IN u_salary_debited BOOL,
  IN u_salary smallint
    )
LANGUAGE PLPGSQL
AS $$
BEGIN
UPDATE Employees
SET name = u_name,
email = u_email,
phone = u_phone,
education = u_education,
password = u_password,
age = u_age,
salary = u_salary
isAdmin = u_isAdmin
salary_debited = u_salary_debited

WHERE id = u_id
RETURNING *
END 
$$;

CREATE OR REPLACE FUNCTION delete_user(
 IN user_id INTEGER
)
LANGUAGE PLPGSQL
AS $$
BEGIN
DELETE FROM Employees
WHERE id = user_id
END
$$

`, [

]);