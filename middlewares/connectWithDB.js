const winston = require("winston");
const { Client } = require("pg");

    const client = new Client({
        connectionString: "postgres://gbpaytdx:bhl8nviSImZ0Xwk0w9xPbRl11VpOaqax@lallah.db.elephantsql.com/gbpaytdx",
        ssl: {
            rejectUnauthorized: false
        }
    });
    client.connect()
        .then(() => {
            winston.info("Connected to DB");
        })
        .catch((ex) => {
            winston.error(ex);
        });


module.exports = (req, res, next) => {
    req.db = client;
    next();
}