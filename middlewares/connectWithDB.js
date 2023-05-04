const winston = require("winston");
const { Client } = require("pg");
const config  = require("config");
const debug = require("debug")("db")

    const client = new Client({
        connectionString: "postgres://rnmqvabj:BE1S5huRkjmo7h8w7MgE1wFfmkrOTcBC@mahmud.db.elephantsql.com/rnmqvabj",
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