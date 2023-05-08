const express = require("express");
const employees = require("../routes/employees");
const benefits = require("../routes/benefits");
const performances = require("../routes/performances");
const departments = require("../routes/departments");
const experiences = require("../routes/experiences");
const skills = require("../routes/skills");
const error = require("../middlewares/error");
const mails = require("../routes/mail");

module.exports = function (app) {
    require("../web sockets/chat")(app);
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use("/employees", employees);
    app.use("/benefits", benefits);
    app.use("/departments", departments);
    app.use("/experiences", experiences);
    app.use("/levels", levels);
    app.use("/performances", performances);
    app.use("/skills", skills);
    app.use("/statuses", statuses);
    app.use("/verify-email", mails)
    app.use(error);
}