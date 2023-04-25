const winston = require("winston");
const { Client } = require("pg");
const config  = require("config");
const debug = require("debug")("db")

    const client = new Client({
        connectionString: "postgres://unqgsqcj:PwOgL9DnYvPXdz5K_h6Wqddr_C4gGybz@mahmud.db.elephantsql.com/unqgsqcj",
        ssl: {
            rejectUnauthorized: false
        }
    });
    client.connect()
        .then(() => {
            winston.info("Connected to DB");
        })
        .catch((ex) => {
            debug(ex);
        });


module.exports = (req, res, next) => {
    req.db = client;
    next();
}