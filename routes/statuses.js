const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {

    const {rows} = await req.db.query(`
        INSERT INTO Statuses(employee_id,name)
        VALUES ($1, $2)

        RETURNING *
  `, [
    req.user.id,
        req.body.name
      ]);
      
      res.status(200).send(rows[0]);
  });

router.put("/:id" ,async (req, res) => {
    const { rows } = await req.db.query(`
UPDATE Statuses
SET employee_id = $1,
name = $2

RETURNING *
    `,
        [
            req.user.id,
            req.body.name
        ]);
    
    res
        .status(200)
        .send(rows[0]);
});


router.delete("/:id" ,async (req, res) => {
    await req.db.query(`
DELETE FROM Statuses
WHERE id = $1;
    `,
        [
            req.params.id
        ]);
    
    res.status(200).send("Deleted successfully");
});


module.exports = router;