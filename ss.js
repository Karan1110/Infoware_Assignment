const bcrypt = require("bcrypt");
const LimMailer = require("lim-mailer");

(async () => {
    const c = Math.floor((Math.random() % 100) + 1).toString();
  const salt = await bcrypt.genSalt(10);
  const code = await bcrypt.hash(c, salt);

  // pass in the mailbox configuration when creating the instance:
  const mailer = new LimMailer(
    {
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        // Google Mail requires two-step verification：https://myaccount.google.com/security
        // Then create an application-specific password and fill in the pass filed：https://myaccount.google.com/apppasswords
        user: "gowdakaran939@gmail.com", // generated Gmail user,TODO:use environment variable
        pass: "mtrtsjrdystwswfj", // generated Gmail password
      },
      alias: "Veera",
    },
    {
      to: ["karan5ipsvig@gmail.com"],
      cc: [],
    }
  );

  mailer
    .sendMail({
      subject: "Welcome to Veera", // Subject line
      text: `Welcome to lim-mailer, Your verification code is ${code}!` // plain text body
    //   html: `<b> Your email-code is ${code}</b>`, // HTML body
    })
    .then((info) => {
      console.log(info);
    })
    .catch((ex) => {
      console.log(ex);
    });
})();
// module.exports = router;
