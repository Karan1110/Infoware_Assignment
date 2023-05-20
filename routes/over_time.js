const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const moment = require("moment");
const isAdmin = require("../middlewares/isAdmin");
const Sequelize = require("sequelize");
const Performance = require("../models/performance.js");

router.post("/", [auth, isAdmin], async (req, res) => {
    const start = moment(req.body.from).format('YYYY-MM-DD HH:MM:SS HH:MM:SS');
    const end = moment(req.body.to).format('YYYY-MM-DD HH:MM:SS HH:MM:SS');
    const over_time_diff = moment.diff(start,end,'hours');

   const employee =  await Employee.update({
        where: {
            id : req.params.id
        },
        include: [{
            model: Performance,
            as : 'Performance'
        }]
   }, {
       Performance: { points: Sequelize.literal('points + 1') },
        working_hours: Sequelize.literal(`working_hours + ${over_time_diff}`)
    });
      
      res.status(200).send(employee);
  });

module.exports = router;