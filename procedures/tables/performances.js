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

(async function func() { await client.query(`
CREATE OR REPLACE FUNCTION create_performance(
    IN req_status_id INTEGER
   )
   LANGUAGE PLPGSQL
   AS $$
   BEGIN
   INSERT INTO performances(status_id)
        VALUES (status_id)

        RETURNING * INTO result INTO result
   END
   $$



   CREATE OR REPLACE FUNCTION update_performance(
    IN req_status_id INTEGER
   )

   LANGUAGE PLPGSQL
   AS $$
   BEGIN
   UPDATE performances
   SET status_id = req_status_id
   
   RETURNING * INTO result INTO result
   END
   $$


  CREATE OR REPLACE FUNCTION delete_performance(
      IN req_status_id INTEGER
   )
   LANGUAGE PLPGSQL
   AS $$
   BEGIN
  DELETE FROM performances
  WHERE id  = user_id
   END
   $$

   `,
    []
)})();
