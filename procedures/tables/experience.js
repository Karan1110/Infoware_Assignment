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
CREATE OR REPLACE FUNCTION create_experience(
    IN req_employee_id INTEGER,
    IN req_company VARCHAR,
    IN req_"From" INTEGER
    IN req_"To" INTEGER

   )
   LANGUAGE PLPGSQL
   AS $$
   BEGIN
   INSERT INTO experiences(employee_id,company,"From","To")
        VALUES (req_employee_id,req_company,req_"From",req_"To")

        RETURNING *
   END
   $$



   CREATE OR REPLACE FUNCTION update_experience(
    IN req_employee_id INTEGER,
    IN req_company VARCHAR,
    IN req_"From" INTEGER,
    IN req_"To" INTEGER
   )

   LANGUAGE PLPGSQL
   AS $$
   BEGIN
   UPDATE experiences
   SET employee_id = req_employee_id,
  company = req_company,
  "To" = req_"To",
  "From" = req_"From"
   
   RETURNING *
   END
   $$


   CREATE OR REPLACE FUNCTION delete_experience(
    IN d_id INTEGER
   )
   LANGUAGE PLPGSQL
   AS $$
   BEGIN
  DELETE FROM experiences
  WHERE id  = d_id
   END
   $$

   `,
    []
);
