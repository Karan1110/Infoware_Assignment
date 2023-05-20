const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");
const db =  require("../startup/db");
const Employee = require("../models/employee");
const Sequelize = require("sequelize");
const MeetingMember = require("../models/intermediate models/MeetingMember");
const  Meeting = require("../models/meeting");

router.post("/", [auth, isAdmin], async (req, res) => {
const { meeting_id, employee_id } = req.body;
let transaction;
  let meeting;
  
try {
  transaction = await db.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  });

  if (!meeting_id) {
    meeting = await Meeting.create(
      {
        name: req.body.name,
        link: req.body.link,
        from: req.body.from,
        to: req.body.to,
        department_id: req.body.department_id,
      },
      { transaction }
    );
  } else {
    meeting = await Meeting.findByPk(meeting_id);
  }

  const employee = await Employee.findByPk(employee_id, { transaction });
  if (!employee) {
    await transaction.rollback();
    return res.status(400).send("User not found");
  }

  await MeetingMember.create(
    {
      employee_id: employee.id,
      meeting_id: meeting.id,
    },
    { transaction }
  );

  await transaction.commit();
  res.status(200).send(meeting);

} catch (error) {
  if (transaction) {
    await transaction.rollback();
  }
  console.log("Transaction rolled back:", error);
  res.status(500).send("Something failed.");
}

});

router.put("/:id", [auth, isAdmin], async (req, res) => {
    try {
        let transaction;
        transaction = await db.transaction({
            isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
        });

        const meeting = await Meeting.update({
            name: req.body.name,
            link: req.body.link,
            from: req.body.from,
            to: req.body.to
        }, {
            transaction
        });
         await transaction.commit();
        res
            .status(200)
            .send(meeting);
    } catch (ex) {
        if (transaction) {
           await  transaction.rollback();
        }
        winston.error(ex);
        res.status(500).send("Something failed.");
    }
});


router.delete("/:id", [auth, isAdmin], async (req, res) => {
    try {
        let transaction;
        transaction = await db.transaction({
            isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
        });
        
        await Meeting.destroy({
            where : {
                id : req.params.id
            }
        }, {
            transaction
        });
        await transaction.commit();
        res.status(200).send("Deleted successfully");
    } catch (ex) {
        if (transaction)  await transaction.rollback();
        winston.error(ex);
        res.status(500).send("something failed");
    }
});

module.exports = router;