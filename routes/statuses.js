const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

router.post("/", [auth,isAdmin],async (req, res) => {

    const {rows} = await req.db.query(`
      SELECT * FROM create_status($1)
  `, [
        req.body.name
      ]);
      
      res.status(200).send(rows[0]);
  });

router.put("/:id" ,[auth,isAdmin],async (req, res) => {
    const { rows } = await req.db.query(`
    SELECT * FROM update_status($1)
    `,
        [
            req.body.name
        ]);
    
    res
        .status(200)
        .send(rows[0]);
});


router.delete("/:id",
    [auth, isAdmin],
    async(req, res) => {
    await req.db.query(`
    SELECT * FROM delete_status($1)
    `,
        [
            req.params.id
        ]);
    
    res.status(200).send("Deleted successfully");
});


module.exports = router;