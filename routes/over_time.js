const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const isAdmin = require("../middlewares/isAdmin");

router.post("/", [auth,isAdmin],async (req, res) => {

    const {rows} = await req.db.query(`
    SELECT * FROM create_over_time($1,$2,$3);
  `, [
        req.user.from,
        req.body.to,
        req.body.employee_id
      ]);
      
      res.status(200).send(rows[0]);
  });

router.put("/:id" ,[auth,isAdmin],async (req, res) => {
    const { rows } = await req.db.query(`
    SELECT * FROM update_over_time($1,$2,$3,$4);
    EXECUTE increment_salary_over_time($5);
    `,
        [
            req.user.from,
            req.body.to,
            req.body.employee_id,
            req.params.id,
            req.user.id
        ]);
    
    res
        .status(200)
        .send(rows[0]);
});


router.delete("/:id" ,[auth,isAdmin],async (req, res) => {
    await req.db.query(`
    SELECT * FROM delete_over_time($1,$2,$3);
    `,
        [
           req.body.b_id
        ]);
    
    res.status(200).send("Deleted successfully");
});


module.exports = router;