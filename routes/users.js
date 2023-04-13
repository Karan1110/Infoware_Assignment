const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

router.get("/me",[auth,isAdmin],async (req, res) => {
    const id = req.user.id;

    const { rows } = await req.db.query(
        `
        SELECT 
        e.id,
        e.name,
        e.email,
        e.phone,
        e.password,
        e.education,
        e.age,
        e.isadmin,
        s.name AS status_name,
        p.employee_id,
        array_agg(sk.name) AS skills,
        array_agg(l.name) as skill_level,
        d.position,
        ex.company,
        b.package
      FROM Employees e
      JOIN Performances p ON p.employee_id = e.id 
      JOIN Statuses s ON p.status_id = s.id
      JOIN Benefits b ON b.employee_id = e.id
      JOIN Departments d ON d.employee_id = e.id
      JOIN Experiences ex ON ex.employee_id = e.id
      JOIN Skills sk ON sk.employee_id = e.id
      JOIN Levels l ON sk.level_id = l.id
      WHERE e.id = $1
      GROUP BY e.id,
      e.name, 
      e.email, 
      e.phone,
      e.password, 
      e.education, 
      e.age, 
      e.isadmin, 
      s.name,
      p.employee_id, 
      d.position, 
      ex.company, 
      b.package;

       `
        ,
        [
            id
        ]);
    // we can select the employee's skill and it's skill_level using the same index for both arrays.
        res.status(200).send({"employee details":rows[0]});
});

router.get("/:id", [auth, isAdmin], async (req, res) => {
    
    const { rows } = await req.db.query(`
   
    e.id,
    e.name,
    e.email,
    e.phone,
    e.password,
    e.education,
    e.age,
    e.isadmin,
    s.name AS status_name,
    p.employee_id,
    array_agg(sk.name) AS skills,
    array_agg(l.name) as skill_level,
    d.position,
    ex.company,
    b.package
  FROM Employees e
  JOIN Performances p ON p.employee_id = e.id 
  JOIN Statuses s ON p.status_id = s.id
  JOIN Benefits b ON b.employee_id = e.id
  JOIN Departments d ON d.employee_id = e.id
  JOIN Experiences ex ON ex.employee_id = e.id
  JOIN Skills sk ON sk.employee_id = e.id
  JOIN Levels l ON sk.level_id = l.id
  WHERE e.id = $1
  GROUP BY e.id,
  e.name, 
  e.email, 
  e.phone,
  e.password, 
  e.education, 
  e.age, 
  e.isadmin, 
  s.name,
  p.employee_id, 
  d.position, 
  ex.company, 
  b.package;
    `,
        [
            req.params.id
        ]);
    res.status(200).send(rows[0]);
});

router.get("/",  [auth,isAdmin],async (req, res) => {
   const {rows} =  await req.db.query(`
   SELECT  
   e.id,
   e.name,
   e.email,
   e.phone,
   e.password,
   e.education,
   e.age,
   e.isadmin,
   s.name AS status_name,
   p.employee_id,
   array_agg(sk.name) AS skills,
   array_agg(l.name) as skill_level,
   d.position,
   ex.company,
   b.package
 FROM Employees e
 JOIN Performances p ON p.employee_id = e.id 
 JOIN Statuses s ON p.status_id = s.id
 JOIN Benefits b ON b.employee_id = e.id
 JOIN Departments d ON d.employee_id = e.id
 JOIN Experiences ex ON ex.employee_id = e.id
 JOIN Skills sk ON sk.employee_id = e.id
 JOIN Levels l ON sk.level_id = l.id
 WHERE e.id = $1
 GROUP BY e.id,
 e.name, 
 e.email, 
 e.phone,
 e.password, 
 e.education, 
 e.age, 
 e.isadmin, 
 s.name,
 p.employee_id, 
 d.position, 
 ex.company, 
 b.package;
LIMIT $1 OFFSET $2
    `,
        [
            req.query.l,
            req.query.s
        ]);
    res.status(200).send(rows[0]);
});

router.post("/",  async (req, res) => {

    const { ifExists } = await req.db.query(
        `
    SELECT EXISTS (SELECT * FROM Employees WHERE name = $1 OR email = $2 OR phone = $3);
  `, [
        req.body.name,
        req.body.email,
        req.body.phone
    ]);

    if (ifExists) return res.status(400).send("User already exists.");

    const salt = await bcrypt.genSalt(10);
    const p = await bcrypt.hash(req.body.password, salt);

    const {rows} = await req.db.query(`
        INSERT INTO Employees(name, email,phone, password,education, age, isAdmin)
        VALUES ($1, $2, $3, $4, $5, $6,$7)
        RETURNING *
  `, [
        req.body.name,
        req.body.email,
        req.body.phone,
        p,
        req.body.education,
        req.body.age,
        req.body.isAdmin
      ]);
      
      const { id,name, email, education, age, isAdmin } = rows[0];
    req.user = { id: id, isAdmin: isAdmin };

    const token = jwt.sign({ id: id, isAdmin: isAdmin }, config.get("jwtPrivateKey"));
      
      res.status(200).send(token);
  });

router.put("/:id" ,auth,[auth,isAdmin],async (req, res) => {
    const { rows } = await req.db.query(`
UPDATE Employees
SET name = $1,
email = $2,
phone = $3
education = $4,
age = $5,
WHERE id = $6
RETURNING *
    `,
        [
            req.body.name,
            req.body.email,
            req.body.phone,
            req.body.education,
            req.body.age,
            req.params.id
        ]);
    
        const {id, name, email,education, age,isAdmin} = rows[0];
    res
        .header("x-auth-token",token)
        .status(200)
        .send({id, name, email,education, age,isAdmin});
});


router.delete("/:id" , auth,async (req, res) => {
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