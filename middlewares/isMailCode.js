const mailCode = require("../models/mailCode");

module.exports = async (req, res, next) => {
    try {
        const mailCode = await mailCode.findOne({
            where: {
                email: req.body.email
            }
        });

        if (!mailCode) return res.status(401).send("no mailCode found");
        
        const { code } = mailCode.dataValues;

        if (!code) return res.status(400).send("invalid credentials.");
        
        if (req.body.mailCode !== code) return res.status(401).send("email verification failed. the email code is wrong");
        
        next();
    } catch (ex) {
        winston.error(ex);
        res.status(400).send("something failed.");
    }
};