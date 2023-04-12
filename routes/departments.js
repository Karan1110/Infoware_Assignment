const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {

    const {rows} = await req.db.query(`
        INSERT INTO Departments(employee_id,position)
        VALUES ($1, $2)
        RETURNING *
  `, [
        req.body.employee_id,
      req.body.postition
      ]);
      
      const { name, email, password,  education, age, isAdmin } = rows[0];
      req.user = { name, email, password,  education, age, isAdmin };
      
      res.status(200).send(req.user);
  });

router.put("/:id" ,async (req, res) => {
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


router.delete("/:id" ,async (req, res) => {
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