const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const moment = require("moment");
const isAdmin = require("../middlewares/isAdmin");
const Employee = require("../models/employee");
const Benefit = require("../models/benefits");

router.post("/", [auth,isAdmin],async (req, res) => {
    const from = moment(new Date());
    const to = moment.duration({ year: req.body.fromYear, months: req.body.fromMonths });
    from.format("YYYY-MM");
    
  const benefit = await Benefit.create({
    name: req.body.name,
    from: from,
    to: from.add(to).format("YYYY-MM")
  });

  const employee = await Employee.findOne({
    where: {
      id  : req.body.employee_id
    }
  });

   await Employee.addBenefit(benefit);
  await Benefit.addEmployee(employee);
      
      res.status(200).send(benefit);
  });

  router.put("/:id", [auth, isAdmin], async (req, res) => {
    const from = moment(new Date());
    const to = moment(from).add({ years: req.body.fromYear, months: req.body.fromMonths });
    from.format("YYYY-MM");
  
    const benefit = await Benefit.update(
      {
        name: req.body.name,
        from: from,
        to: to.format("YYYY-MM"),
      },
      {
        where: {
          id: req.params.id,
        }
      }
    );
  
    res.status(200).send(benefit);
  });
  


router.delete("/:id" ,[auth,isAdmin],async (req, res) => {

  const benefit = await Benefit.findOne({
    where: {
      id: req.body.beenfit_id
    }
  });

  const employee = await Employee.findOne({
    where: {
      id  : req.body.employee_id
    }
  });

   await Employee.addBenefit(benefit);
   await Benefit.addEmployee(employee);


    await Benefit.destroy({
        where: {
            id : req.params.id
        }
    })
    
    res.status(200).send("Deleted successfully");
});


module.exports = router;