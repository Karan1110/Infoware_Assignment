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

(async function func() {
  await client.query(`
CREATE OR REPLACE FUNCTION create_benefit(
    IN req_employee_id INTEGER,
    IN req_name VARCHAR,
    IN req_benefit_type_id INTEGER
   )
   LANGUAGE PLPGSQL
   AS $$
   BEGIN
   INSERT INTO benefits(employee_id,name,benefit_type_id)
        VALUES (req_employee_id,req_name,req_benefit_type_id)

        RETURNING * INTO result INTO result 
   END
   $$;

  CREATE OR REPLACE FUNCTION update_benefit(
    IN req_employee_id INTEGER,
    IN req_name VARCHAR, 
    IN req_benefit_type_id INTEGER
  )
LANGUAGE PLPGSQL
AS $$
BEGIN
RETURN QUERY
    UPDATE benefits
    SET employee_id = req_employee_id,
        name = req_name,
        benefit_type_id = req_benefit_type_id;
    
    RETURNING * INTO result INTO result;
END
$$;

   CREATE OR REPLACE FUNCTION delete_benefit(
    IN b_id INTEGER
   )
   LANGUAGE PLPGSQL
   AS $$
   BEGIN
  DELETE FROM benefits
  WHERE id  = b_id
   END
   $$;

   `,
    []
  );
})();
