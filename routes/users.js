const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");
const email_verified = require("../middlewares/isMailCode");
const config = require("config")
const {prisma} = require("../startup/db")

router.get("/average_salary",[auth,isAdmin],async (req, res) => {
    const avg_salary = prisma.employee.aggregate({
        avg: {
            salary: true
        }
    });
        res.status(200).send(avg_salary);
});

router.get("/me", [auth, isAdmin], async (req, res) => {
    prisma.employee.findMany({
        include: {
            education: true,
            experience: true,
            notification: true,
            ticket: true,
            skills: true,
            level: true,
            benefit: true,
            benefit_type: true,
            meeting: true,
            meeting_member: true,
            department: true,
            position: true,
            performance: true,
            performance_status  : true

        }
    })
    res.status(200).send({ "employee details": rows[0] });
});
    
router.get("/:id", [auth, isAdmin], async (req, res) => {
    
    const { rows } = await req.db.query(`
    SELECT 
        e.id,
        e.name,
        e.email,
        e.phone,
        e.salary,
        e.password,
        e.education,
        e.age,
        e.isadmin,
        s.name AS performance_status,
        d.name AS department,
        d.position AS position,
        array_agg(sk.name) AS skills,
        array_agg(l.name) as skill_level,
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
      e.salary,
      e.password, 
      e.education, 
      e.age, 
      e.isadmin, 
      s.name,
      p.employee_id, 
      d.name,
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
   e.salary,
   e.password,
   e.education,
   e.age,
   e.isadmin,
   s.name AS performance_status,
   d.name AS department,
   d.position AS position,
   array_agg(sk.name) AS skills,
   array_agg(l.name) as skill_level,
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

 GROUP BY e.id,
 e.name, 
 e.email, 
 e.phone,
 e.salary,
 e.password, 
 e.education, 
 e.age, 
 e.isadmin, 
 s.name,
 p.employee_id, 
 d.name,
 d.position, 
 ex.company, 
 b.package;
LIMIT $1 OFFSET $2
    `,
        [
            req.query.l,
            req.query.s
        ]);
    res.status(200).send(rows);
});

router.post("/", email_verified, async (req, res) => {
    

    const { ifExists } = await req.db.query(
        `
    SELECT EXISTS (SELECT * FROM Employees WHERE name = $1 OR email = $2 OR phone = $3);
  `, [
        req.body.name,
        req.body.email,
            req.body.phone,
    ]);

    if (ifExists) return res.status(400).send("User already exists.");

    const salt = await bcrypt.genSalt(10);
    const p = await bcrypt.hash(req.body.password, salt);

    const {rows} = await req.db.query(`
        SELECT * FROM create_employee($1,$2,$3,$4,$5,$6,$7,$8);
  `, [
        req.body.name,
        req.body.email,
        req.body.phone,
        req.body.salary,
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
SELECT * FROM update_employee();
    `,
        [
            req.body.name,
            req.body.email,
            req.body.phone,
            req.body.education,
            req.body.age,
            req.body.salary,
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
SELECT * FROM delete_employee($1);
    `,
        [
            req.user.id
        ]);
    
    res.status(200).send("Deleted successfully");
});



module.exports = router;