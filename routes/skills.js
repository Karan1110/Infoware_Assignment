const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {

    const {rows} = await req.db.query(`
        INSERT INTO Experiences(employee_id,name,level_id)
        VALUES ($1, $2,$3)

        RETURNING *
  `, [
    req.user.id,
        req.body.name,
        req.body.level_id
      ]);
      
      res.status(200).send(rows[0]);
  });

router.put("/:id" ,async (req, res) => {
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
            req.body.name,
            req.body.level_id
         
        ]);
    
    res
        .status(200)
        .send(rows[0]);
});


router.delete("/:id" ,async (req, res) => {
    await req.db.query(`
DELETE FROM Skills
WHERE id = $1;
    `,
        [
            req.params.id
        ]);
    
    res.status(200).send("Deleted successfully");
});


module.exports = router;