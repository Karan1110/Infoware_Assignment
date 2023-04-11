const express = require("express");
const users = require("../routes/users");
const error = require("../middlewares/error");
const db = require("../middlewares/connectWithDB");

module.exports = function (app) {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(db);
    app.use("/users", users);
    app.use(error);
}

