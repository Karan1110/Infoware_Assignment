const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");
// const email_verified = require("../middlewares/isMailCode");
// const config = require("config")
const Employee = require("../models/employee");
const Education = require("../models/education");
const Experience = require("../models/Experience");
const Ticket = require("../models/Ticket");
const Skill = require("../models/skills");
const Benefit = require("../models/benefits");
const Meeting = require("../models/meeting");
const Notification = require("../models/notifications");
const Performance = require("../models/Performance");
const Department = require("../models/department");
const sequelize = require("../startup/db");

router.get("/average_salary", [auth, isAdmin], async (req, res) => {
  const Users = await Employee.findAll({
    attributes: {
      include: [
        [sequelize.fn("AVG", sequelize.col("salary")), "average_salary"],
      ],
    },
  });

  res.status(200).send(Users.average_salary);
});

router.get("/me", [auth, isAdmin], async (req, res) => {
  const me = await Employee.findOne({
    where: {
      id: 1,
    },
    include: [
      // {
      //   model: Employee,
      //   as: "Manager",
      // },
      // {
      //   model: Education,
      //   as: "Education",
      // },
      // {
      //   model: Experience,
      //   as: "Experience",
      // },
      // {
      //   model: Notification,
      //   as: "Notifications",
      // },
      // {
      //   model: Ticket,
      //   as: "Ticket",
      // },
      {
        model: Skill,
        as: "Skills",
      },
      // {
      //   model: Benefit,
      //   as: "Benefit",
      // },
      // {
      //   model: Meeting,
      //   as: "Meeting",
      // },
      // {
      //   model: Department,
      //   as: "Department",
      // },
      // {
      //   model: Performance,
      //   as: "Performance",
      // },
    ],
  });

  res.status(200).send(me);
});

router.get("/:id", [auth, isAdmin], async (req, res) => {
  const employee = Employee.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      { model: Manager },
      { model: Education },
      { model: Experience },
      { model: Notification },
      { model: Ticket },
      { model: Skill },
      { model: Benefit },
      { model: Meeting },
      { model: Department },
      { model: Performance },
    ],
  });
  res.status(200).send(employee);
});
// performance department employee_id
router.get("/", [auth, isAdmin], async (req, res) => {
  const employee = await Employee.findAll({
    order: [["age", "ASC"]], // Sort by name in ascending order
    offset: 10, // Skip the first 10 records
    imit: 5,
    include: [
      { model: Manager },
      { model: Education },
      { model: Experience },
      { model: Notification },
      { model: Ticket },
      { model: Skill },
      { model: Benefit },
      { model: Meeting },
      { model: Department },
      { model: Performance },
    ],
  });

  res.status(200).send(employee);
});

router.post("/", async (req, res) => {
  const userExists = await Employee.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (userExists) {
    return res.status(400).send("User already registered.");
  } else {
    console.log("sus");
  }

  const salt = await bcrypt.genSalt(10);
  const p = await bcrypt.hash(req.body.password, salt);

  const employee = await Employee.create({
    name: req.body.name,
    email: req.body.email,
    password: p,
    salary: req.body.salary,
    age: req.body.age,
    phone: req.body.phone,
    isAdmin: req.body.isadmin,
  });

  const token = Employee.generateAuthToken();

  res.status(200).send({ token: token, Employee: employee });
});

router.put("/:id", auth, [auth, isAdmin], async (req, res) => {
  const userExists = await Employee.findOne({
    where: {
      email: req.body.email,
    },
  });

  const _user = await Employee.findByPk(req.user.id);
  if (!_user) return res.status(200).send("User Not Found.");

  if (userExists) return res.status(200).send("email already in use");

  const { password } = _user;
  const p = await bcrypt.compare(req.body.password, password);

  if (!p) return res.status(400).send("invalid credentials.");

  const salt = await bcrypt.genSalt(10);
  const pw = await bcrypt.hash(req.body.password, salt);

  const user = await Employee.update(
    {
      where: {
        id: req.params.id,
      },
    },
    {
      name: req.body.name,
      email: req.body.email,
      password: pw,
      isadmin: req.body.isAdmin,
    }
  );

  const token = user.generateAuthToken();

  res.header("x-auth-token", token).status(200).send(user);
});

router.delete("/:id", auth, async (req, res) => {
  const employee = await Employee.destroy({
    where: {
      id: req.params.id,
    },
  });

  res.status(200).send({ Deleted: employee });
});

module.exports = router;
