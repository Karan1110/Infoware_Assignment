const winston = require("winston");
const { Client } = require("pg");
const config  = require("config");
const debug = require("debug")("db")

    const client = new Client({
        connectionString: config.get('dbURL'),
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