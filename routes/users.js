const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");
const email_verified = require("../middlewares/isMailCode");
const config = require("config")
const {prisma} = require("../startup/db");
const { memoryStorage } = require("multer");

router.get("/average_salary",[auth,isAdmin],async (req, res) => {
    const avg_salary = prisma.employee.aggregate({
        avg: {
            salary: true
        }
    });
        res.status(200).send(avg_salary);
});

router.get("/me", [auth, isAdmin], async (req, res) => {
    const me = prisma.employee.find({
        where: {
           id  :req.user.id
       },
        include: {
            manager : true,
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
   });
    
    res.status(200).send(me);
});
    
router.get("/:id", [auth, isAdmin], async (req, res) => {
    const employee = prisma.employee.find({
        where: {
           id  :req.params.id
       },
        include: {
            manager : true,
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
   });
    res.status(200).send(employee);
});

router.get("/",  [auth,isAdmin],async (req, res) => {
    const employee = prisma.employee.findMany({
        include: {
            manager : true,
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
    });
    
    res.status(200).send(employee);
});

router.post("/", email_verified, async (req, res) => {
    
    const userExists = prisma.employee.findOne({
        where: {
            email: req.body.email
        }
    });

    if (userExists) return res.status(400).send("User already exists.");

    const salt = await bcrypt.genSalt(10);
    const p = await bcrypt.hash(req.body.password, salt);


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