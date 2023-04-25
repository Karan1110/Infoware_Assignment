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
CREATE OR REPLACE FUNCTION create_meeting(
    IN req_employee_id INTEGER,
    IN req_meeting_id  INTEGER,
    IN req_link VARCHAR,
    IN req_name VARCHAR

   )
   LANGUAGE PLPGSQL
   AS $$
   BEGIN
   BEGIN TRANSACTION
   INSERT INTO meetings(employee_id,meeting_id ,link,name,meeting_id)
        VALUES (req_employee_id,req_meeting_id ,req_link,req_name)

        RETURNING * INTO result INTO result


        SELECT e.id,mm.meeting_id,mm.id
        JOIN meeting_members mm ON m.employee_id = employee_id
        FROM Employees e
        WHERE e.id = user_id

        SELECT m.name,m.link
        JOIN meeting_members mm ON mm.meeting_id = meeting_id 
        FROM meetings m
        WHERE e.id = mm.employee_id


        INSERT INTO Messages(message)
        VALUES('join the meeting' || m.name || 'here's the link'  || m.link)

        INSERT INTO Notifications(message_id,employee_id)
        VALUES(mm.id,e.id)

        COMMIT
   END
   $$



   CREATE OR REPLACE FUNCTION update_meeting(
    IN req_employee_id INTEGER,
    IN req_meeting_id  INTEGER,
    IN req_link VARCHAR,
    IN req_name VARCHAR
   )

   LANGUAGE PLPGSQL
   AS $$
   BEGIN
   UPDATE meetings
   SET employee_id = req_employee_id,
  meeting_id  = req_meeting_id ,
  name = req_name,
  link = req_link
   
   RETURNING * INTO result INTO result
   END
   $$;


   CREATE OR REPLACE FUNCTION delete_meeting(
    IN m_id INTEGER
   )
   LANGUAGE PLPGSQL
   AS $$
   BEGIN
  DELETE FROM meetings
  WHERE id  = d_id
   END
   $$;
   `,
    []
)})();
