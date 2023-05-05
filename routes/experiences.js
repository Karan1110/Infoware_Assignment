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
    const { rows } = await req.db.query(`
SELECT * FROM update_experience($1,$2,$3,$4)
    `,
        [
        req.user.id,
            req.body.company,
            req.body.from,
        req.body.to
         
        ]);
    
    res
        .status(200)
        .send(rows[0]);
});


router.delete("/:id" ,[auth,isAdmin],async (req, res) => {
    await req.db.query(`
SELECT * FROM delete_experience($1)
    `,
        [
            req.params.id
        ]);
    
    res.status(200).send("Deleted successfully");
});


module.exports = router;
