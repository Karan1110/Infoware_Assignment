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
CREATE OR REPLACE FUNCTION create_benefit(
    IN req_employee_id INTEGER,
    IN req_name VARCHAR,
    IN req_ IN req_benefit_type_id INTEGER INTEGER

   )
   LANGUAGE PLPGSQL
   AS $$
   BEGIN
   INSERT INTO benefits(employee_id,name,benefit_type_id)
        VALUES (req_employee_id,req_name,req_benefit_type_id)

        RETURNING *
   END
   $$

   CREATE OR REPLACE FUNCTION update_benefit(
    IN req_employee_id INTEGER,
    IN req_name VARCHAR, 
    IN req_benefit_type_id INTEGER
   )

   LANGUAGE PLPGSQL
   AS $$
   BEGIN
   UPDATE benefits
   SET employee_id = req_employee_id,
   name = req_name,
   benefit_type_id = req_benefit_type_id
   
   RETURNING *
   END
   $$


   CREATE OR REPLACE FUNCTION delete_benefit(
    IN b_id INTEGER
   )
   LANGUAGE PLPGSQL
   AS $$
   BEGIN
  DELETE FROM benefits
  WHERE id  = b_id
   END
   $$

   `,
    []
);
