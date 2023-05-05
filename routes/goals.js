const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const isAdmin = require("../middlewares/isAdmin");

router.post("/", [auth,isAdmin],async (req, res) => {

    const {rows} = await req.db.query(`
    SELECT * FROM create_goal($1,$2);
  `, [
        req.body.name,
        req.body.employee_id
      ]);
      
      res.status(200).send(rows[0]);
  });

router.put("/:id" ,[auth,isAdmin],async (req, res) => {
    const { rows } = await req.db.query(`
    SELECT * FROM update_goal($1,$2);
    `,
        [
            req.body.name,
            req.body.employee_id
        ]);
    
    res
        .status(200)
        .send(rows[0]);
});


routerdestroy("/:id" ,[auth,isAdmin],async (req, res) => {
    await req.db.query(`
    SELECT * FROM delete_goal($1,$2,$3);
    `,
        [
           req.body.g_id
        ]);
    
    res.status(200).send("Deleted successfully");
});


module.exports = router;