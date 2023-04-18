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
CREATE OR REPLACE FUNCTION create_working_day(
    IN req_employee_id INTEGER,
    IN req_"from" VARCHAR,
    IN req_ IN req_"to" INTEGER
   )
   LANGUAGE PLPGSQL
   AS $$
   BEGIN
   INSERT INTO working_days(employee_id,"from","to")
        VALUES (req_employee_id,req_"from",req_"to")

        RETURNING *
   END
   $$

   CREATE OR REPLACE FUNCTION update_working_day(
    IN req_employee_id INTEGER,
    IN req_"from" VARCHAR, 
    IN req_"to" INTEGER
   )

   LANGUAGE PLPGSQL
   AS $$
   BEGIN
   UPDATE working_days
   SET employee_id = req_employee_id,
   "from" = req_"from",
   "to" = req_"to"
   
   RETURNING *
   END
   $$


   CREATE OR REPLACE FUNCTION delete_working_day(
    IN b_id INTEGER
   )
   LANGUAGE PLPGSQL
   AS $$
   BEGIN
  DELETE FROM working_days
  WHERE id  = b_id
   END
   $$

   `,
    []
);
