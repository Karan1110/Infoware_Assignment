const { Client } = require("pg");
const config  = require("config")
const winston = require("winston")
const debug = require("debug")("destroy")

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

    (async function func() { await client.query(
        `
    DROP TABLE  Departments, 
    Performances, 
    Statuses, 
    Benefits, 
    Skills, 
    Experiences, 
    Levels, 
    Employees,
    goals,
    meetings,
    meeting_members,
    message,
    notification,
    over_time,
    performance,
    workingDays;
  `,
        []
    )
})();