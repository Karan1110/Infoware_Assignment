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
CREATE OR REPLACE FUNCTION create_Goal(
    IN user_id INTEGER
   )
   LANGUAGE PLPGSQL
   AS $$
   BEGIN
   INSERT INTO Goals(employee_id,name,status)
        VALUES ($1, $2,'done')

        RETURNING * INTO result


        CREATE EVENT TRIGGER on_status_complete
        ON UPDATE ON goals.status
        FOR EACH ROW
        EXECUTE FUNCTION update_goals_status();
        


   END
   $$



   CREATE OR REPLACE FUNCTION update_Goal(
    IN req_employee_id INTEGER,
    IN req_name VARCHAR,
    IN req_status VARCHAR
   )

   LANGUAGE PLPGSQL
   AS $$
   BEGIN
   UPDATE Goals
   SET employee_id = req_employee_id,
   name = req_name,
   status = req_status
   
   RETURNING * INTO result
   END
   $$


   CREATE OR REPLACE FUNCTION delete_Goal(
    IN user_id INTEGER
   )
   LANGUAGE PLPGSQL
   AS $$
   BEGIN
  DELETE FROM Goals
  WHERE id  = user_id
   END
   $$

   `,
    []
);
