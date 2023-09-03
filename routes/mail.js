const mailCode = require("../models/mailCode");
const bcrypt = require("bcrypt");
const LimMailer = require("lim-mailer");
const router = require("express").Router();

router.post("verify-email", async (req, res, next) => {
  const c = Math.floor((Math.random() % 100) + 1).toString();
  
  const mail_code = await mailCode.create({
    code: c,
    email: req.body.email,
  });

  // pass in the mailbox configuration when creating the instance:
  const mailer = new LimMailer(
    {
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "gowdakaran939@gmail.com",
      pass: "spywobbvhtbkswyi",
      },
      alias: "Veera",
    },
    {
      to: [`${req.body.to}`],
      cc: [],
    }
  );

  mailer
    .sendMail({
      subject: "Welcome to Veera", // Subject line
      text: `Welcome to lim-mailer, Your verification code is ${c}!`, // plain text body
      html: `<b> Your email-code is ${c}</b>`, // HTML body
    })
    .then((info) => {
      console.log(info);
    })
    .catch((ex) => {
      console.log(ex);
    });

  res.status(200).send({ mailCodeSent: mail_code });
});

module.exports = router;
