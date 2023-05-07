const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");
const Employee = require("../models/employee");
const Experience = require("../models/Experience");


router.post("/", [auth,isAdmin],async (req, res) => {

    const experience = await Experience.create({
        company: req.body.company,
        from: req.body.from,
        to: req.body.to
    });
      
    const employee = await Employee.findOne({
        where: {
            id: req.body.employee_id
        }
    });

    Employee.addExperience(experience);
    Experience.addEmployee(employee);

      res.status(200).send(experience);
  });

router.put("/:id" ,[auth,isAdmin],async (req, res) => {
   const experience =  await Experience.update({
        comapny: req.body.company,
        from: req.body.from,
        to: req.body.to
    });
    
    res
        .status(200)
        .send(experience);
});


router.delete("/:id" ,[auth,isAdmin],async (req, res) => {
    const experience = await Experience.destroy({
        where: {
            id: req.params.id
        }
    })
    
    res.status(200).send({message: "Deleted successfully",deleted : experience} );
});

module.exports = router;