const express = require("express");
const app = express();
const winston = require("winston");

require("./startup/logging")();
require("./startup/routes")(app);
// Database
const db = require('./config/database');

app.listen(3001, () => {
    winston.info("Listening on  http://localhost:3001")
});
     
db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err));