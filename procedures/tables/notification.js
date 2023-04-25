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

(async function func() { await client.query(`
CREATE OR REPLACE FUNCTION create_notification(
    IN req_employee_id INTEGER,
    IN req_message_id INTEGER
   )
   LANGUAGE PLPGSQL
   AS $$
   BEGIN
   INSERT INTO notifications(employee_id, message_id)
        VALUES (req_employee_id,req_message_id)

        RETURNING * INTO result INTO result
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
   
   RETURNING * INTO result INTO result
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
)})();
