const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");
const Employee = require("../models/employee");

router.post("/", [auth,isAdmin],async (req, res) => {

    const skill = Skill.create({
        name: req.body.name,
        level : req.body.level
    });

    const employee = await Employee.findByPk(req.body.employee_id);

    await skill.addEmployee(employee);
      
      res.status(200).send(skill);
  });

router.put("/:id" ,[auth,isAdmin],async (req, res) => {
    const skill = Skill.update({
        where: {
            id : req.params.id
        }
    },{
        name: req.body.name,
        level : req.body.level
    });
    
    res
        .status(200)
        .send(skill);
});

router.delete("/:id" ,[auth,isAdmin],async (req, res) => {
    await Skill.destroy({
        where: {
            id : req.params.id
        }
    });

    res.status(200).send("Deleted successfully");
});

module.exports = router;