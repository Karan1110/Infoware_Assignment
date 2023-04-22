const express = require("express");
const router = express.Router();
const winston = require("winston");
const config = require("config");
const debug = require("debug")("phone-verify")

router.post("/verify-phone", async (req, res) => {
    
// Load the Twilio module
const accountSid = 'AC68167b0dd8a615edcb58a4be2caadcf7';
const authToken = '918e8687fa5a4bbebb655ef4855a8489';
const client = require('twilio')(accountSid, authToken);

const phoneCode = Math.floor(Math.random()%100+1)
  
// Send an SMS message
client.messages.create({
  body: `You verification code is ${phoneCode}`,
  from: config.get("phone"),
  to: req.body.phone
})
.then(message => winston.info(message.sid))
.catch(error => debug(error));
}); 