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
CREATE OR REPLACE FUNCTION create_department(
    IN req_employee_id INTEGER,
    IN req_name VARCHAR,
    IN req_position_id INTEGER
    IN req_employee_tax INTEGER

   )
   LANGUAGE PLPGSQL
   AS $$
   BEGIN
   INSERT INTO Departments(employee_id,name,position_id,employee_tax)
        VALUES (req_employee_id,req_name,req_position_id,req_employee_tax)

        RETURNING * INTO result
   END
   $$



   CREATE OR REPLACE FUNCTION update_department(
    IN req_employee_id INTEGER,
    IN req_name VARCHAR,
    IN req_position_id INTEGER,
    IN req_employee_tax INTEGER
   )

   LANGUAGE PLPGSQL
   AS $$
   BEGIN
   UPDATE Departments
   SET employee_id = req_employee_id,
  name = req_name,
  employee_tax = req_employee_tax,
  position_id = req_position_id
   
   RETURNING * INTO result
   END
   $$


   CREATE OR REPLACE FUNCTION delete_department(
    IN d_id INTEGER
   )
   LANGUAGE PLPGSQL
   AS $$
   BEGIN
  DELETE FROM Departments
  WHERE id  = d_id
   END
   $$

   `,
    []
);
