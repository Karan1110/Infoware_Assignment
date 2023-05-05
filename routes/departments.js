const express = require("express");
const router = express.Router();
const isAdmin = require("../middlewares/isAdmin");
const auth = require("../middlewares/auth");

router.post("/", [auth,isAdmin],async (req, res) => {

    const department = Department.create({
        name: req.body.name,
        position_id : req.body.position_id
    });
    
      res.status(200).send(department);
  });

router.put("/:id" ,[auth,isAdmin],async (req, res) => {
    const { rows } = await req.db.query(`
    SELECT * FROM update_department($1,$2,$3);
    `,
        [
            req.user.id,
            req.body.name,
            req.body.postition
        ]);
    res
        .status(200)
        .send(rows[0]);
});


routerdestroy("/:id" ,[auth,isAdmin],async (req, res) => {
    await Departmentdestroy({
        where: {
            id: req.params.id
        }
    });
    
    res.status(200).send("Deleted successfully");
});


module.exports = router;