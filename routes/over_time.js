const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const moment = require("moment");
const isAdmin = require("../middlewares/isAdmin");

router.post("/", [auth, isAdmin], async (req, res) => {
    const start = moment(req.body.from);
    const end = moment(req.body.to);
    const over_time_duration = moment.diff(start,end,'hours');

   const employee =  await Employee.update({
        where: {
            id : req.params.id
        }
    }, {
        working_hours: Sequelize.literal(`working_hours + ${over_time_duration}`)
    });
      
      res.status(200).send(employee);
  });

module.exports = router;