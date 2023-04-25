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
CREATE OR REPLACE FUNCTION decrement_remaining_leaves(IN to TIMESTAMP,IN m_id INT)
   LANGUAGE PLPGSQL
   AS $$
   BEGIN
   START TRANSACTION
   BEGIN

   CREATE EVENT TRIGGER delete_meeting_trigger
   ON SCHEDULE to
   DO INSTEAD
    DELETE from Meetings 
    WHERE id = m_id
   
   COMMIT
   END
   $$
   `,
    []
)
})()