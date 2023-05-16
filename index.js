const express = require("express");
const app = express();
const winston = require("winston");

require("./startup/logging")();
require("./startup/routes")(app);
// Database
const db = require('./startup/db');

app.listen(3001, () => {
    const winston = require("winston")
winston.info("Listening on  http://localhost:3001")
});
     
db.authenticate()
  .then(() => winston.info('Database connected...'))
  .catch(err => winston.info('Error: ' + err));