const express = require("express");
const users = require("../routes/users");
const benefits = require("../routes/benefits");
const performances = require("../routes/performances");
const departments = require("../routes/departments");
const experiences = require("../routes/experiences");
const statuses = require("../routes/statuses");
const levels = require("../routes/levels");
const skills = require("../routes/skills");
const error = require("../middlewares/error");
const db = require("../middlewares/connectWithDB");

module.exports = function (app) {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(db);
    app.use("/users", users);
    app.use("/benefits", benefits);
    app.use("/departments", departments);
    app.use("/experiences", experiences);
    app.use("/levels", levels);
    app.use("/performances", performances);
    app.use("/skills", skills);
    app.use("/statuses", statuses);
    app.use(error);
}