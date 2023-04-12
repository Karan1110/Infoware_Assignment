const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

router.get("/me",[auth,isAdmin],async (req, res) => {
    const id = req.user.id;
    const { rows } = await req.db.query(`
    SELECT *
    FROM Employees e
    JOIN Performances p ON e.id = Performances.id
    JOIN Statuses s ON p.status_id = s.id
    JOIN Benefits b ON b.employee_id = e.id
    JOIN Departments d ON d.employee_id = e.id
    JOIN Experiences ex ON ex.employee_id = e.id
    JOIN Skills sk ON s.employee_id = e.id
    JOIN Levels l ON l.id = sk.id
    WHERE id = $1
    `,
        [
            id
        ]);
        res.status(200).send(rows);
    });

router.get("/:id" ,[auth,isAdmin],async (req, res) => {
   const {rows} =  await req.db.query(`
   SELECT *
   FROM Employees e
   JOIN Performances p ON e.id = Performances.id
   JOIN Statuses s ON p.status_id = s.id
   JOIN Benefits b ON b.employee_id = e.id
   JOIN Departments d ON d.employee_id = e.id
   JOIN Experiences ex ON ex.employee_id = e.id
   JOIN Skills sk ON s.employee_id = e.id
   JOIN Levels l ON l.id = sk.level_id
   WHERE id = $1
    `,
        [
            req.params.id
        ]);
    res.status(200).send(rows);
});

router.get("/",  [auth,isAdmin],async (req, res) => {
   const {rows} =  await req.db.query(`
   SELECT *
   FROM Employees e
   LIMIT $1 OFFSET $2
   JOIN Performances p ON e.id = Performances.id
   JOIN Statuses s ON p.status_id = s.id
   JOIN Benefits b ON b.employee_id = e.id
   JOIN Departments d ON d.employee_id = e.id
   JOIN Experiences ex ON ex.employee_id = e.id
   JOIN Skills sk ON s.employee_id = e.id
   JOIN Levels l ON l.id = sk.id
    `,
        [
            req.query.l,
            req.query.s
        ]);
    res.status(200).send(rows);
});

router.post("/", auth,[auth,isAdmin],async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const p = await bcrypt.hash(req.body.password, salt);

    const {rows} = await req.db.query(`
        INSERT INTO Employees(name, email, password,education, age, isAdmin)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
  `, [
        req.body.name,
        req.body.email,
        p,
        req.body.education,
        req.body.age,
        req.body.isAdmin
      ]);
      
      const { name, email, password,  education, age, isAdmin } = rows[0];
      req.user = { name, email, password,  education, age, isAdmin };
      
      res.status(200).send(req.user);
  });

router.put("/:id" ,auth,[auth,isAdmin],async (req, res) => {
    const { rows } = await req.db.query(`
UPDATE Employees
SET name = $1,
email = $2,
education = $3,
age = $4,
WHERE id = $5
RETURNING *
    `,
        [
            req.body.name,
            req.body.email,
            req.body.education,
            req.body.age,
            req.params.id
        ]);
    
        const {id, name, email,education, age,isAdmin} = rows[0];
        req.user = { id:id,isAdmin:isAdmin };
    const token = jwt.sign({ id: id, isAdmin: isAdmin }, config.get("jwtPrivateKey"));
    res
        .header("x-auth-token",token)
        .status(200)
        .send(req.user);
});


router.delete("/:id" , auth,[auth,isAdmin],async (req, res) => {
    await req.db.query(`
DELETE FROM Employees
WHERE id = $1;
    `,
        [
            req.user.id
        ]);
    
    res.status(200).send("Deleted successfully");
});


module.exports = router;