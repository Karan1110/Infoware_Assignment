const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const isAdmin = require("../middlewares/isAdmin");

router.post("/", [auth,isAdmin],async (req, res) => {

    const {rows} = await req.db.query(`
    SELECT * FROM create_leave($1,$2,$3);
    EXECUTE decrement_salary_leaves($4)
  `, [
        req.user.from,
        req.body.to,
        req.body.employee_id,
        req.user.id
      ]);
      
      res.status(200).send(rows[0]);
  });

module.exports = router;