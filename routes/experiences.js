const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");


router.post("/", [auth,isAdmin],async (req, res) => {

    const {rows} = await req.db.query(`
       SELECT * FROM create_experience($1,$2,$3,$4);
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
SELECT * FROM update_experience($1,$2,$3,$4)
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
SELECT * FROM delete_experience($1)
    `,
        [
            req.params.id
        ]);
    
    res.status(200).send("Deleted successfully");
});


module.exports = router;