const { Client } = require("pg");
const config  = require("config")
const winston = require("winston")
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
CREATE OR REPLACE FUNCTION create_leave(
    IN req_employee_id INTEGER,
    IN req_"from" VARCHAR,
    IN req_ IN req_"to" INTEGER
   )
   LANGUAGE PLPGSQL
   AS $$
   BEGIN
   INSERT INTO leaves(employee_id,"from","to")
        VALUES (req_employee_id,req_"from",req_"to")

        RETURNING * INTO result INTO result
   END
   $$

   CREATE OR REPLACE FUNCTION update_leave(
    IN req_employee_id INTEGER,
    IN req_"from" VARCHAR, 
    IN req_"to" INTEGER
   )

   LANGUAGE PLPGSQL
   AS $$
   BEGIN
   UPDATE leaves
   SET employee_id = req_employee_id,
   "from" = req_"from",
   "to" = req_"to"
   
   RETURNING * INTO result INTO result
   END
   $$


   CREATE OR REPLACE FUNCTION delete_leave(
    IN b_id INTEGER
   )
   LANGUAGE PLPGSQL
   AS $$
   BEGIN
  DELETE FROM leaves
  WHERE id  = b_id
   END
   $$

   `,
    []
  )
})();
