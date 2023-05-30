const express = require("express");
const app = express();
const db = require("./startup/db");
const winston = require("winston");
// app.s
// express.

require("./startup/logging")();
require("./startup/routes")(app);

app.listen(3001, () => {
  winston.info("Listening on  http://localhost:3001");
});

db.authenticate({force:true})
  .then(() => {
    winston.info("Database connected...");
    db.sync()
      .then(() => {
        winston.info("Tables created....");
      })
      .catch((ex) => {
        winston.info("Tables NOT created...", ex);
      });
  })
  .catch((ex) => {
    winston.error("Database NOT connected...", ex);
  });
