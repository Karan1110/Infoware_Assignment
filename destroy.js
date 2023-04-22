const { Client } = require("pg")
const winston = require("winston")
const debug = require("debug")("destroy")

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

(async function destroy() {
    await client.query(
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