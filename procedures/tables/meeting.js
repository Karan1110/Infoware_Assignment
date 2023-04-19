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
CREATE OR REPLACE FUNCTION create_meeting(
    IN req_employee_id INTEGER,
    IN req_meeting_id  INTEGER,
    IN req_link VARCHAR,
    IN req_name VARCHAR

   )
   LANGUAGE PLPGSQL
   AS $$
   BEGIN
   INSERT INTO meetings(employee_id,meeting_id ,link,name)
        VALUES (req_employee_id,req_meeting_id ,req_link,req_name)

        RETURNING *

        BEGIN TRANSACTION

        SELECT e.id,mm.meeting_id,mm.id
        JOIN meeting_members mm ON m.employee_id = e.id
        FROM Employees e
        WHERE e.id = user_id

        SELECT m.name,m.link
        JOIN meeting_members mm ON mm.meeting_id = m.id 
        FROM meetings m
        WHERE e.id = mm.id


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
   
   RETURNING *
   END
   $$


   CREATE OR REPLACE FUNCTION delete_meeting(
    IN m_id INTEGER
   )
   LANGUAGE PLPGSQL
   AS $$
   BEGIN
  DELETE FROM meetings
  WHERE id  = d_id
   END
   $$

   `,
    []
);
