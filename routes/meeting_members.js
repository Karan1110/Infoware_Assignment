const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");
const { prisma } = require("../startup/db");

router.post("/", [auth,isAdmin],async (req, res) => {

    const meeting_member = await prisma.meeting_member.create({
        data: {
            employee_id: req.body.employee_id,
            meeting_id : req.body.meeting_id
        }
    })
      res.status(200).send(meeting_member);
  });

router.put("/:id" ,[auth,isAdmin],async (req, res) => {
    await prisma.meeting_member.update({
        where: {
            id :req.params.id
        },
        data: {
            meeting_id: req.body.meeting_id,
            employee_id : req.body.employee_id
        }
   })
    res
        .status(200)
        .send(rows[0]);
});


router.delete("/:id" ,[auth,isAdmin],async (req, res) => {
    await prisma.meeting_member.delete({
        where: {
            meeting_id: req.body.meeting,
            employee_id: req.body.employee_id
        }
    });
    
    res.status(200).send("Deleted successfully");
});


module.exports = router;