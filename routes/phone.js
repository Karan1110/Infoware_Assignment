const express = require("express");
const router = express.Router();
const winston = require("winston");

router.post("/verify-email", async (req, res) => {
    
// Load the Twilio module
const accountSid = 'AC68167b0dd8a615edcb58a4be2caadcf7';
const authToken = '918e8687fa5a4bbebb655ef4855a8489';
const client = require('twilio')(accountSid, authToken);

// Send an SMS message
client.messages.create({
  body: 'This is a test message from Twilio!',
  from: 'your_twilio_phone_number',
  to: 'the_phone_number_to_send_to'
})
.then(message => winston.info(message.sid))
.catch(error => winston.error(error));

}); 