const express = require("express");
const router = express.Router();
const winston = require("winston");
const config = require("config");
const debug = require("debug")("phone-verify")

router.post("/verify-phone", async (req, res) => {
// Load the Twilio module
const accountSid = config.get("acc-sid");
const authToken = config.get("acc-token");
const client = require('twilio')(accountSid, authToken);

const phoneCode = Math.floor(Math.random()%100+1)
  
// Send an SMS message
client.messages.create({
  body: `You verification code is ${phoneCode}`,
  from: config.get("phone"),
  to: req.body.phone
})
.then(message => 
  winston.info(message.sid)
)
.catch(error => debug(error));
}); 

module.exports = router