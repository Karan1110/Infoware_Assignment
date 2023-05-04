const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");
const email_verified = require("../middlewares/isMailCode");
const config = require("config")
const {prisma} = require("../startup/db");

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

    const Employee = prisma.employee.create({
        data: {
            name: req.body.name,
            email: req.body.email,
            password: p,
            salary: req.body.salary,
            age: req.body.age,
            phone: req.body.phone,
            isAdmin : req.body.isAdmin
        }
    });

    const token = jwt.sign({ id: id, isAdmin: isAdmin }, config.get("jwtPrivateKey"));
      
    res.status(200).send({ token: token ,Employee : Employee});
  });

router.put("/:id", auth, [auth, isAdmin], async (req, res) => {
    
    const user = await prisma.employee.update({
        where: {
            id : req.params.id
        },
        data: {
            name : req.body.name,
            email : req.body.email,
            phone : req.body.phone,
            education : req.body.education,
            age :   req.body.age,
            salary: req.body.salary,
            isAdmin : req.body.isAdmin
        }
    });
    
    res
        .header("x-auth-token",token)
        .status(200)
        .send(user);
});


router.delete("/:id" , auth,async (req, res) => {
    await prisma.employees.delete({
        where: {
            id: req.params.id
        }
    });
    res.status(200).send("Deleted successfully");
});



module.exports = router;