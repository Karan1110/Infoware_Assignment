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
CREATE OR REPLACE FUNCTION create_position(
    IN req_name varchar
   )
   LANGUAGE PLPGSQL
   AS $$
   BEGIN
   INSERT INTO positions(name)
        VALUES (name)

        RETURNING *
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
   
   RETURNING *
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
