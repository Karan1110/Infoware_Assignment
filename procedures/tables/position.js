const { Client } = require("pg");
const config  = require("config");
const winston = require("winston");
const debug = require("debug")("seed");

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
CREATE OR REPLACE FUNCTION create_position(
    IN req_name varchar
   )
   LANGUAGE PLPGSQL
   AS $$
   BEGIN
   INSERT INTO positions(name)
        VALUES (name)

        RETURNING * INTO result
   END
   $$



   CREATE OR REPLACE FUNCTION update_position(
    IN req_name varchar
   )

   LANGUAGE PLPGSQL
   AS $$
   BEGIN
   UPDATE positions
   SET name = req_name
   
   RETURNING * INTO result
   END
   $$


  CREATE OR REPLACE FUNCTION delete_position(
      IN req_name varchar
   )
   LANGUAGE PLPGSQL
   AS $$
   BEGIN
  DELETE FROM positions
  WHERE id  = user_id
   END
   $$

   `,
    []
);
