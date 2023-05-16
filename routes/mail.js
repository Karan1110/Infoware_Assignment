const nodemailer = require("nodemailer");
const mailCode = require("../models/mailCode");
const bcrypt = require("bcrypt");
const router = require('express').Router();

router.post('verify-email', async (req, res, next) => {
    const c = Math.floor(Math.random() % 100 + 1);
    const salt = await bcrypt.genSalt(10);
    const code = await bcrypt.hash(c, salt);

    const mail_code = await mailCode.create({
        code: code,
        email: req.body.email
    });

    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: req.body.email,
            pass: req.body.password
        }
    });
    
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
    
    res.status(200).send({mailCodeSent : mail_code});
});

module.exports = router;