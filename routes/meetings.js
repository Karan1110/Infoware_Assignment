const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

router.post("/", [auth,isAdmin],async (req, res) => {

    const {rows} = await req.db.query(`
      SELECT* FROM create_meeting($1,$2,$3,$4)
  `, [
        req.body.name,
        req.body.link,
        req.body.meeting_id,
        req.body.employee_id
      ]);
      
      res.status(200).send(rows[0]);
  });

router.put("/:id" ,[auth,isAdmin],async (req, res) => {
    const { rows } = await req.db.query(`
    SELECT* FROM update_meeting($1,$2,$3,$4)
    `,
        [
            req.body.name,
            req.body.link,
            req.body.meeting_id,
            req.body.employee_id
        ]);
    
    res
        .status(200)
        .send(rows[0]);
});


routerdestroy("/:id" ,[auth,isAdmin],async (req, res) => {
    await req.db.query(`
DELETE FROM Benefits
WHERE id = $1;
    `,
        [
            req.params.id
        ]);
    
    res.status(200).send("Deleted successfully");
});


module.exports = router;