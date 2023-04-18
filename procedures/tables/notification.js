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
CREATE OR REPLACE FUNCTION create_notification(
    IN req_employee_id INTEGER,
    IN req_message_id INTEGER
   )
   LANGUAGE PLPGSQL
   AS $$
   BEGIN
   INSERT INTO notifications(employee_id, message_id)
        VALUES (req_employee_id,req_message_id)

        RETURNING *
   END
   $$



   CREATE OR REPLACE FUNCTION update_notification(
    IN req_employee_id INTEGER,
    IN req_message_id INTEGER
   )

   LANGUAGE PLPGSQL
   AS $$
   BEGIN
   UPDATE notifications
   SET employee_id = req_employee_id,
   message_id  = req_message_id
   
   RETURNING *
   END
   $$


  CREATE OR REPLACE FUNCTION delete_notification(
      IN mm_id INTEGER
   )
   LANGUAGE PLPGSQL
   AS $$
   BEGIN
  DELETE FROM notifications
  WHERE id  = mm_id
   END
   $$

   `,
    []
);
