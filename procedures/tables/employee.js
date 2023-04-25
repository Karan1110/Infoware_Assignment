const { Client } = require("pg");
const config  = require("config")
const winston = require("winston")
const debug = require("debug")("seed")

const client = new Client({
  connectionString:
    config.get('dbURL'),
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
    debug(ex)
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
RETURNING * INTO result





END
$$;


CREATE OR REPLACE FUNCTION update_user()
AS $$
LANGUAGE PLPGSQL
BEGIN

BEGIN TRANSACTION 
SELECT e.salary - d.employee_tax AS in_hand_salary
LEFT JOIN Departments d ON e.id = d.employee_id
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
RETURNING * INTO result
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

CREATE OR REPLACE FUNCTION all_employee_details()
LANGUAGE PLPGSQL
AS $$
BEGIN
  RETURN QUERY
  SELECT e.name, 
  array_agg(sk.name), 
  array_agg(l.name),
  DATE_PART(wd."from",wd."to") AS working_days,
  em.name AS manager_name,
  d.name AS Department,
  p.name AS position,
  ARRAY_AGG(m.message) AS notifications 
  DATE_PART(o."from",o."to") AS over_time_periods
  m.name AS Meeting,
  m.link AS Meeting_link,
  b.name AS Benefit,
  bt.name AS Benefit_Type
  FROM Employees e
  LEFT JOIN Employees em ON em.id = e.manager_id
  LEFT JOIN Working_days wd ON wd.employee_id = e.id
  LEFT JOIN Skills sk ON sk.employee_id = e.id
  LEFT JOIN Levels l ON l.id = sk.level_id
  LEFT JOIN Experiences ex ON ex.employee_id = e.id
  LEFT JOIN Departments d ON d.employee_id = e.id
  LEFT JOIN Positions p ON p.department_id = d.id
  LEFT JOIN Notifications n ON n.employee_id = e.id
  LEFT JOIN Messages m ON m.notification_id = n.id
  LEFT JOIN Over_times o ON o.employee_id = e.id
  LEFT JOIN Leaves lea ON lea.employee_id = e.id
  LEFT JOIN Goals g ON g.employee_id = e.id
  LEFT JOIN Performances per ON per.employee_id = e.id
  LEFT JOIN Statuses s ON s.id = per.status_id 
  LEFT JOIN Meeting_member mm ON e.id = mm.employee_id
  LEFT JOIN Meeting m ON mm.meeting_id = m.id
  LEFT JOIN Benefits b ON b.employee_id = e.id
  LEFT JOIN Benefit_types bt ON b.benefit_type_id = bt.id
  GROUP BY e.name, sk.name, l.name,working_days,em.name
  ORDER BY e.id
END
$$;


 CREATE OR REPLACE FUNCTION employee_details()
 LANGUAGE PLPGSQL
 AS $$
 BEGIN
   RETURN QUERY
   SELECT e.name, 
   array_agg(sk.name), 
   array_agg(l.name),
   DATE_PART(wd."from",wd."to") AS working_days,
   em.name AS manager_name,
   d.name AS Department,
   p.name AS position,
   ARRAY_AGG(m.message) AS notifications 
   DATE_PART(o."from",o."to") AS over_time_periods
   m.name AS Meeting,
   m.link AS Meeting_link,
   b.name AS Benefit,
   bt.name AS Benefit_Type
   FROM Employees e
   LEFT JOIN Employees em ON em.id = e.manager_id
   LEFT JOIN Working_days wd ON wd.employee_id = e.id
   LEFT JOIN Skills sk ON sk.employee_id = e.id
   LEFT JOIN Levels l ON l.id = sk.level_id
   LEFT JOIN Experiences ex ON ex.employee_id = e.id
   LEFT JOIN Departments d ON d.employee_id = e.id
   LEFT JOIN Positions p ON p.department_id = d.id
   LEFT JOIN Notifications n ON n.employee_id = e.id
   LEFT JOIN Messages m ON m.notification_id = n.id
   LEFT JOIN Over_times o ON o.employee_id = e.id
   LEFT JOIN Leaves lea ON lea.employee_id = e.id
   LEFT JOIN Goals g ON g.employee_id = e.id
   LEFT JOIN Performances per ON per.employee_id = e.id
   LEFT JOIN Statuses s ON s.id = per.status_id 
   LEFT JOIN Meeting_member mm ON e.id = mm.employee_id
   LEFT JOIN Meeting m ON mm.meeting_id = m.id
   LEFT JOIN Benefits b ON b.employee_id = e.id
   LEFT JOIN Benefit_types bt ON b.benefit_type_id = bt.id
   GROUP BY e.name, sk.name, l.name,working_days,em.name
 END
 $$;
 



CREATE OR REPLACE FUNCTION employee_details_pagination(
  IN req_limit INTEGER, 
  IN req_offset INTEGER
)
RETURNS TABLE (
  name TEXT, 
  skills TEXT[], 
  levels TEXT[]
)
LANGUAGE PLPGSQL
AS $$
BEGIN
  -- The SELECT statement should be inside the RETURN TABLE clause
  RETURN QUERY
  SELECT e.name, 
  array_agg(sk.name), 
  array_agg(l.name),
  DATE_PART(wd."from",wd."to") AS working_days,
  em.name AS manager_name,
  d.name AS Department,
  p.name AS position,
  ARRAY_AGG(m.message) AS notifications 
  DATE_PART(o."from",o."to") AS over_time_periods
  m.name AS Meeting,
  m.link AS Meeting_link,
  b.name AS Benefit,
  bt.name AS Benefit_Type
  FROM Employees e
  LEFT JOIN Employees em ON em.id = e.manager_id
  LEFT JOIN Working_days wd ON wd.employee_id = e.id
  LEFT JOIN Skills sk ON sk.employee_id = e.id
  LEFT JOIN Levels l ON l.id = sk.level_id
  LEFT JOIN Experiences ex ON ex.employee_id = e.id
  LEFT JOIN Departments d ON d.employee_id = e.id
  LEFT JOIN Positions p ON p.department_id = d.id
  LEFT JOIN Notifications n ON n.employee_id = e.id
  LEFT JOIN Messages m ON m.notification_id = n.id
  LEFT JOIN Over_times o ON o.employee_id = e.id
  LEFT JOIN Leaves lea ON lea.employee_id = e.id
  LEFT JOIN Goals g ON g.employee_id = e.id
  LEFT JOIN Performances per ON per.employee_id = e.id
  LEFT JOIN Statuses s ON s.id = per.status_id 
  LEFT JOIN Meeting_member mm ON e.id = mm.employee_id
  LEFT JOIN Meeting m ON mm.meeting_id = m.id
  LEFT JOIN Benefits b ON b.employee_id = e.id
  LEFT JOIN Benefit_types bt ON b.benefit_type_id = bt.id
  GROUP BY e.name, sk.name, l.name,working_days,em.name
  ORDER BY 
    e.id
  LIMIT 
    req_limit 
  OFFSET 
    req_offset;
END
$$;



`, [

]);