const express = require("express");
const app = express();
const winston = require("winston");
require("./startup/logging")();
require("./startup/routes")(app);


app.listen(3001, () => {
winston.info("Listening on  http://localhost:3001")
 });
