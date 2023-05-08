const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");
const email_verified = require("../middlewares/isMailCode");
const config = require("config")
const Employee = require("../models/employee");

router.get("/average_salary",[auth,isAdmin],async (req, res) => {
    const Users = await Employee.findAll({
        attributes: {
            include: [
                [
                    sequelize.fn('AVG', sequelize.col('salary')),
                    'average_salary'
                ]
            ]
        }
    });

        res.status(200).send(Users.average_salary);
});

router.get("/me", [auth, isAdmin], async (req, res) => {
    const me = await Employee.findOne({
        where: {
           id  :req.user.id
       },
        include: {
            Manager : true,
            Education: true,
            Experience: true,
            Notification: true,
            Ticket: true,
            EmployeeSkill: true,
            EmployeeBenefit: true,
            Benefit_type: true,
            Meeting_Member: true,
            Department: true,
            Position: true,
            Performance: true
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
        Manager : true,
        Education: true,
        Experience: true,
        Notification: true,
        Ticket: true,
        EmployeeSkill: true,
        EmployeeBenefit: true,
        Benefit_type: true,
        Meeting_Member: true,
        Department: true,
        Position: true,
        Performance: true
    }
   });
    res.status(200).send(employee);
});

router.get("/",  [auth,isAdmin],async (req, res) => {
    const employee = await Employee.findAll({
        order: [['age', 'ASC']], // Sort by name in ascending order
        offset: 10, // Skip the first 10 records
        imit: 5,
        include: {
            Manager : true,
            Education: true,
            Experience: true,
            Notification: true,
            Ticket: true,
            EmployeeSkill: true,
            EmployeeBenefit: true,
            Benefit_type: true,
            Meeting_Member: true,
            Department: true,
            Position: true,
            Performance: true
        }
    });
    
    res.status(200).send(employee);
});

router.post("/", email_verified, async (req, res) => {
    
    const userExists = await Employee.findOne({
        where: {
            email: req.body.email
        }
    });

    if (userExists) return res.status(400).send("User already exists.");

    const salt = await bcrypt.genSalt(10);
    const p = await bcrypt.hash(req.body.password, salt);

    const employee = await Employee.create({
            name: req.body.name,
            email: req.body.email,
            password: p,
            salary: req.body.salary,
            age: req.body.age,
            phone: req.body.phone,
            isAdmin : req.body.isAdmin
    });

    const token = employee.generateAuthToken();
      
    res.status(200).send({ token: token ,Employee : employee});
  });

router.put("/:id", auth, [auth, isAdmin], async (req, res) => {

    const userExists = await Employee.findOne({
        where : {
            email  : req.body.email
        }
    });

    const _user = await Employee.findByPk(req.user.id);
    if (!_user) return res.status(200).send("User Not Found.");

    if (userExists) return res.status(200).send("email already in use");
       
    const { password } = _user;
    const p = await bcrypt.compare(req.body.password, password);
        
    if (!p) return res.status(400).send("invalid credentials.");
    
    const salt = await bcrypt.genSalt(10);
    const pw = await bcrypt.hash(req.body.password, salt);

    const user = await Employee.update({
        where: {
            id: req.params.id
        }
    }, {
        name: req.body.name,
        email: req.body.email,
        password: pw,
        isadmin: req.body.isAdmin,
    });
    
    const token = user.generateAuthToken();

    res
        .header("x-auth-token",token)
        .status(200)
        .send(user);
});


router.delete("/:id" , auth,async (req, res) => {
    await Employee.destroy({
        where: {
            id: req.params.id
        }
    });

    res.status(200).send("Deleted successfully");
});

module.exports = router;