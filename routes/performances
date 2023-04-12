const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {

    const {rows} = await req.db.query(`
        INSERT INTO Benefits(employee_id,status_id)
        VALUES ($1, $2)

        RETURNING *
  `, [
        req.body.employee_id,
        req.body.status_id
      ]);
      
      res.status(200).send(rows[0]);
  });

router.put("/:id" ,async (req, res) => {
    const { rows } = await req.db.query(`
UPDATE Performances
SET employee_id = $1,
status_id = $2

RETURNING *
    `,
        [
        req.body.employee_id,
            req.body.status_id
        ]);
    
    res
        .status(200)
        .send(rows[0]);
});


router.delete("/:id" ,async (req, res) => {
    await req.db.query(`
DELETE FROM Performances
WHERE id = $1;
    `,
        [
            req.params.id
        ]);
    
    res.status(200).send("Deleted successfully");
});


module.exports = router;