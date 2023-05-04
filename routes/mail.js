const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/verify-email", async (req, res) => {
    
    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: req.body.email,
            pass: req.body.password
        }
    });
    
    const mailCode = Math.floor(Math.random() % 100 + 1);
    req.mailCode = mailCode;
    
    await transport.sendMail({
        to: req.body.email,
        from: "gowdakaran939@gmail.com",
        subject: "email verification",
        text: `
        Dear ${req.body.name} as part of verifying your email we are sending you this 
        ${mailCode} code to verify your email.
        Kindly enter this to logint  to your account.
        `
    });
    
    res.status(200).send("Email sent");
});

module.exports = router;