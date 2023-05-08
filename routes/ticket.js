const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const isAdmin = require("../middlewares/isAdmin");

router.post("/", [auth, isAdmin], async (req, res) => {
    const employee = await Employee.findByPk(req.body.employee_id);
    if (!employee) return res.status(400).send("user not found");
    
    if (employee.manager_id !== req.user.id) return res.status(400).send("Not authorized");


  const ticket =   await Ticket.create({
        name: req.body.name,
        steps: req.body.steps,
        employee_id : req.body.employee_id
    });
      
      res.status(200).send(ticket);
  });

router.put("/:id" ,[auth,isAdmin],async (req, res) => {
    const ticket =   await Ticket.update({
        name: req.body.name,
        steps: req.body.steps,
        employee_id : req.body.employee_id
    });
      
    res
        .status(200)
        .send(ticket);
});


router.delete("/:id" ,[auth,isAdmin],async (req, res) => {
    await req.db.query(`
    SELECT * FROM delete_goal($1,$2,$3);
    `,
        [
           req.body.g_id
        ]);
    
    res.status(200).send("Deleted successfully");
});


module.exports = router;