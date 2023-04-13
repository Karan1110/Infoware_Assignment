const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");


router.post("/", [auth,isAdmin],async (req, res) => {

    const {rows} = await req.db.query(`
        INSERT INTO Experiences(employee_id,company,"From","To")
        VALUES ($1, $2,$3,$4)

        RETURNING *
  `, [
    req.body.employee_id,
        req.body.company,
        req.body.from,
    req.body.to
      ]);
      
      
      res.status(200).send(rows[0]);
  });

router.put("/:id" ,[auth,isAdmin],async (req, res) => {
    const { rows } = await req.db.query(`
UPDATE Departments
SET employee_id = $1,
company = $1,
"From" = $1,
"To" = $1

RETURNING *
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
DELETE FROM Experiences
WHERE id = $1;
    `,
        [
            req.params.id
        ]);
    
    res.status(200).send("Deleted successfully");
});


module.exports = router;