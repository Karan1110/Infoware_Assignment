const { Client } = require("pg");
const config  = require("config")
const winston = require("winston");
const debug = require("debug")("seed")

const client = new Client({
  connectionString:
    "postgres://unqgsqcj:PwOgL9DnYvPXdz5K_h6Wqddr_C4gGybz@mahmud.db.elephantsql.com/unqgsqcj",
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

(async function func() {
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

        RETURNING * INTO result INTO result
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
   
   RETURNING * INTO result INTO result
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
  )
})()
