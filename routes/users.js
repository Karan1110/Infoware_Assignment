const express = require("express");
const router = express.Router();

router.get("/" ,async (req, res) => {
    const { rows } = await req.db.query(`
SELECT * FROM Employees
    `,
        []);
        res.status(200).send(rows);
    });

router.get("/:id" ,async (req, res) => {
   const {rows} =  await req.db.query(`
SELECT * FROM Employees WHERE id = $1
    `,
        [
            req.params.id
        ]);
    res.status(200).send(rows);
});

router.get("/",  async (req, res) => {
   const {rows} =  await req.db.query(`
SELECT * FROM Employees LIMIT $1 OFFSET $2
    `,
        [
            req.query.l,
            req.query.s
        ]);
    res.status(200).send(rows);
});

router.post("/", async (req, res) => {
    const {rows} = await req.db.query(`
        INSERT INTO Employees(name, email, password,education, age, isAdmin)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
  `, [
        req.body.name,
        req.body.email,
        req.body.password,
        req.body.education,
        req.body.age,
        req.body.isAdmin
      ]);
      
      const { name, email, password,  education, age, isAdmin } = rows[0];
      req.user = { name, email, password,  education, age, isAdmin };
      
      res.status(200).send(req.user);
  });

router.put("/:id" ,async (req, res) => {
    const { rows} = await req.db.query(`
UPDATE Employees
SET name = $1,
email = $2,
password = $3 ,
education = $4,
age = $5,isAdmin = $6
WHERE id = $7
RETURNING *
);
    `,
        [
            req.body.name,
            req.body.email,
            req.body.password,
            req.body.education,
            req.body.age,
            req.body.isAdmin,
            req.params.id
        ]);
    
        // const { name, email, password,  education, age, isAdmin } = rows[0];
        // req.user = { name, email, password,  education, age, isAdmin };
        
        //     res.status(200).send(req.user);
    
    res.send(rows[0]);
});


router.delete("/:id" ,async (req, res) => {
    await req.db.query(`
DELETE FROM Employees
WHERE id = $1;
    `,
        [
            req.params.id
        ]);
    
    res.status(200).send("Deleted successfully");
});


module.exports = router;