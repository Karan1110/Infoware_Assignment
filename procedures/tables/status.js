const { Client } = require("pg")
const winston = require("winston")
const debug = require("debug")("seed")

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
    debug(ex)
  });

await client.query(`
CREATE OR REPLACE FUNCTION create_meeting_member(
    IN req_employee_id varchar,
    IN req_name varchar
   )
   LANGUAGE PLPGSQL
   AS $$
   BEGIN
   INSERT INTO meeting_members(employee_id, name)
        VALUES (req_employee_id,req_name)

        RETURNING * INTO result
   END
   $$



   CREATE OR REPLACE FUNCTION update_meeting_member(
    IN req_employee_id varchar,
    IN req_name varchar
   )

   LANGUAGE PLPGSQL
   AS $$
   BEGIN
   UPDATE meeting_members
   SET employee_id = req_employee_id,
   name  = req_name
   
   RETURNING * INTO result
   END
   $$


  CREATE OR REPLACE FUNCTION delete_meeting_member(
      IN mm_id varchar
   )
   LANGUAGE PLPGSQL
   AS $$
   BEGIN
  DELETE FROM meeting_members
  WHERE id  = mm_id
   END
   $$

   `,
    []
);
