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
CREATE OR REPLACE FUNCTION create_message(
    IN req_name varchar
   )
   LANGUAGE PLPGSQL
   AS $$
   BEGIN
   INSERT INTO messages(name)
        VALUES (name)

        RETURNING * INTO result
   END
   $$



   CREATE OR REPLACE FUNCTION update_message(
    IN req_name varchar
   )

   LANGUAGE PLPGSQL
   AS $$
   BEGIN
   UPDATE messages
   SET name = req_name
   
   RETURNING * INTO result
   END
   $$


  CREATE OR REPLACE FUNCTION delete_message(
      IN req_name varchar
   )
   LANGUAGE PLPGSQL
   AS $$
   BEGIN
  DELETE FROM messages
  WHERE id  = user_id
   END
   $$

   `,
    []
);
