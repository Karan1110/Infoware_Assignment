const { Client } = require("pg");
const config  = require("config");
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

(async function func() { await client.query(`
CREATE OR REPLACE FUNCTION create_skill(
    IN user_id INTEGER
   )
   LANGUAGE PLPGSQL
   AS $$
   BEGIN
   INSERT INTO Skills(employee_id,name,level_id)
        VALUES ($1, $2,$3)

        RETURNING * INTO result INTO result
   END
   $$



   CREATE OR REPLACE FUNCTION update_skill(
    IN req_employee_id INTEGER,
    IN req_name VARCHAR,
    IN level_id INTEGER
   )

   LANGUAGE PLPGSQL
   AS $$
   BEGIN
   UPDATE Skills
   SET employee_id = req_employee_id,
   name = req_name,
   level_id = req_level_id
   
   RETURNING * INTO result INTO result
   END
   $$


   CREATE OR REPLACE FUNCTION delete_skill(
    IN user_id INTEGER
   )
   LANGUAGE PLPGSQL
   AS $$
   BEGIN
  DELETE FROM Skills
  WHERE id  = user_id
   END
   $$

   `,
    []
)})();
