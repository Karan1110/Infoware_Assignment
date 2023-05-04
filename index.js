const express = require("express");
const app = express();
const winston = require("winston");
require("./startup/logging")();
require("./startup/routes")(app);
const { prisma } = require("./startup/db")
prisma();


app.listen(3001, () => {
winston.info("Listening on  http://localhost:3001")
 });
