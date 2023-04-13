const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const isAdmin = require("../middlewares/isAdmin");

router.post("/", [auth,isAdmin],async (req, res) => {

    const {rows} = await req.db.query(`
        INSERT INTO Benefits(employee_id,name,package)
        VALUES ($1, $2,$3)

        RETURNING *
  `, [
        req.user.id,
        req.body.name,
        req.body.package
      ]);
      
      res.status(200).send(rows[0]);
  });

router.put("/:id" ,[auth,isAdmin],async (req, res) => {
    const { rows } = await req.db.query(`
UPDATE Benefits
SET employee_id = $1,
name = $2,
package = $3

RETURNING *
    `,
        [
        req.user.id,
            req.body.name,
        req.body.package
        ]);
    
    res
        .status(200)
        .send(rows[0]);
});


router.delete("/:id" ,[auth,isAdmin],async (req, res) => {
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