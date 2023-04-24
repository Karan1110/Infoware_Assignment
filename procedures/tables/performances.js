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
CREATE OR REPLACE FUNCTION create_performance(
    IN req_status_id INTEGER
   )
   LANGUAGE PLPGSQL
   AS $$
   BEGIN
   INSERT INTO performances(status_id)
        VALUES (status_id)

        RETURNING * INTO result
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
   
   RETURNING * INTO result
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
);
