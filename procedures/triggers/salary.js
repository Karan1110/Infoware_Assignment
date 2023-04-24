const { Client } = require("pg");
const config  = require("config")
const winston = require("winston");
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

await client.query(`
CREATE OR REPLACE FUNCTION decrement_remaining_leaves(IN e_id INTEGER)
   LANGUAGE PLPGSQL
   AS $$
   BEGIN
   START TRANSACTION
   BEGIN
SELECT (total_leaves - leaves) AS remaining_leaves FROM Employees WHERE id  = e_id
COMMIT
   END
   $$


   CREATE OR REPLACE FUNCTION increment_salary_over_time(IN e_id INTEGER)
   LANGUAGE PLPGSQL
   AS $$
   BEGIN
   START TRANSACTION
   BEGIN
   SELECT e.name,e.salary,o."from",o."to"
JOIN Over_times o ON o.employee_id  = id  
FROM Employees e WHERE id = e_id
GROUP BY  e.name,e.salary,o."from",o."to"

UPDATE Employees
SET salary = (e.salary + DATEDIFF(o."from",o."to"))
COMMIT
   END
   $$

CREATE OR REPLACE FUNCTION decrement_salary_leaves(IN e_id INTEGER)
   LANGUAGE PLPGSQL
   AS $$
   BEGIN

SELECT e.name,e.salary,l."from",l."to"
JOIN Leaves l ON l.employee_id  = id  
FROM Employees e WHERE id = e_id
GROUP BY  e.name,e.salary,l."from",l."to"

UPDATE Employees
SET salary = (e.salary - DATEDIFF(l."from",l."to"))

DELETE FROM Leaves
WHERE id = l.id

COMMIT
   END
   $$
   `,
    []
);
