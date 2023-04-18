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

        RETURNING *
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
   
   RETURNING *
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
