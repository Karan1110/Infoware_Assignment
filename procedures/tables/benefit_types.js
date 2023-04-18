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
CREATE OR REPLACE FUNCTION create_benefit(
    IN req_name varchar
   )
   LANGUAGE PLPGSQL
   AS $$
   BEGIN
   INSERT INTO benefits(name)
        VALUES (name)

        RETURNING *
   END
   $$



   CREATE OR REPLACE FUNCTION update_benefit(
    IN req_name varchar
   )

   LANGUAGE PLPGSQL
   AS $$
   BEGIN
   UPDATE benefits
   SET name = req_name
   
   RETURNING *
   END
   $$


  CREATE OR REPLACE FUNCTION delete_benefit(
      IN req_name varchar
   )
   LANGUAGE PLPGSQL
   AS $$
   BEGIN
  DELETE FROM benefits
  WHERE id  = user_id
   END
   $$

   `,
    []
);
