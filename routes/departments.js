const express = require("express");
const router = express.Router();
const isAdmin = require("../middlewares/isAdmin");
const auth = require("../middlewares/auth");

router.post("/", [auth,isAdmin],async (req, res) => {

    const {rows} = await req.db.query(`
        INSERT INTO Departments(employee_id,name,position)
        VALUES ($1, $2,$3)
        RETURNING *
  `, [
        req.user.id,
      req.body.name,
      req.body.postition
      ]);
    
      res.status(200).send(rows[0]);
  });

router.put("/:id" ,[auth,isAdmin],async (req, res) => {
    const { rows } = await req.db.query(`
UPDATE Departments
SET employee_id = $1,
name = $1

RETURNING *
    `,
        [
            req.user.id,
            req.body.postition
        ]);
    res
        .status(200)
        .send(rows[0]);
});


router.delete("/:id" ,[auth,isAdmin],async (req, res) => {
    await req.db.query(`
DELETE FROM Departments
WHERE id = $1;
    `,
        [
            req.params.id
        ]);
    
    res.status(200).send("Deleted successfully");
});


module.exports = router;