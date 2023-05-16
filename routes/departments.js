const express = require("express");
const router = express.Router();
const isAdmin = require("../middlewares/isAdmin");
const auth = require("../middlewares/auth");
const Department = require("../models/department");

router.post("/", [auth,isAdmin],async (req, res) => {

    const department = await Department.create({
        name: req.body.name,
        position_id: req.body.position_id
    });
    
      res.status(200).send(department);
  });

router.put("/:id" ,[auth,isAdmin],async (req, res) => {
   
    const department = await Department.update({
        name: req.body.name
    });

    res
        .status(200)
        .send(department);
});


router.delete("/:id" ,[auth,isAdmin],async (req, res) => {
    await Department.destroy({
        where: {
            id: req.params.id
        }
    });
    
    res.status(200).send("Deleted successfully");
});


module.exports = router;