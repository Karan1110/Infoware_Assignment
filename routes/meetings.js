const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");
const Employee = require("../models/employee");

router.post("/", [auth,isAdmin],async (req, res) => {

    const meeting = await Meeting.create({
       name :  req.body.name,
        link : req.body.link,
        from : req.body.from,
        to  :  req.body.to
    });

    const employee  = await Employee.findByPk(req.body.employee_id);

    Meeting.addEmployee(employee);
    Employee.addMeeting(meeting);
      
      res.status(200).send(meeting);
  });

router.put("/:id" ,[auth,isAdmin],async (req, res) => {
    const meeting = await Meeting.update({
        name :  req.body.name,
         link : req.body.link,
         from : req.body.from,
         to  :  req.body.to
     });
 
    res
        .status(200)
        .send(meeting);
});


router.delete("/:id" ,[auth,isAdmin],async (req, res) => {
const employee  = await Employee.findByPk(req.body.employee_id);

    await Meeting.removeEmployee(employee);

    await Meeting.destroy({
        where : {
            id : req.params.id
        }
    });
    
    res.status(200).send("Deleted successfully");
});


module.exports = router;