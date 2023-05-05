const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

router.post("/", [auth,isAdmin],async (req, res) => {

    const {rows} = await req.db.query(`
       SELECT * FROM create_skill($1,$2)
  `, [
    1,
        req.body.name,
        req.body.level_id
      ]);
      
      res.status(200).send(rows[0]);
  });

router.put("/:id" ,[auth,isAdmin],async (req, res) => {
    const { rows } = await req.db.query(`
    SELECT * FROM update_skill($1,$2)
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


routerdestroy("/:id" ,[auth,isAdmin],async (req, res) => {
    await req.db.query(`
    SELECT * FROM delete_skill($1,$2)
    `,
        [
            req.params.id
        ]);
    
    res.status(200).send("Deleted successfully");
});


module.exports = router;