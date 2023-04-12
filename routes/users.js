const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get("/" ,async (req, res) => {
    const { rows } = await req.db.query(`
    SELECT *
    FROM Employees e1
    JOIN Performances ON e1.id = Performances.employee_id 
    JOIN Statuses ON Performances.status_id = Statuses.id
    JOIN Departments ON Departments.employee_id = e1.id
    JOIN Experience ON Experience.employee_id = e1.id
    JOIN Skills ON Skills.employee_id = e1.id
    JOIN Levels ON Levels.employee_id = Skills.employee_id AND Levels.id = Skills.level_id
    JOIN Benefits ON Benefits.employee_id = e1.id
    WHERE e1.id = 1;
    
    `,
        []);
        res.status(200).send(rows);
    });

router.get("/:id" ,async (req, res) => {
   const {rows} =  await req.db.query(`
SELECT * FROM Employees WHERE id = $1
    `,
        [
            req.params.id
        ]);
    res.status(200).send(rows);
});

router.get("/",  async (req, res) => {
   const {rows} =  await req.db.query(`
SELECT * FROM Employees LIMIT $1 OFFSET $2
    `,
        [
            req.query.l,
            req.query.s
        ]);
    res.status(200).send(rows);
});

router.post("/", async (req, res) => {
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

router.put("/:id" ,async (req, res) => {
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


router.delete("/:id" ,async (req, res) => {
    await req.db.query(`
DELETE FROM Employees
WHERE id = $1;
    `,
        [
            req.params.id
        ]);
    
    res.status(200).send("Deleted successfully");
});


module.exports = router;