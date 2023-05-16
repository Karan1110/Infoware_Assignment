const bcrypt = require("bcrypt");
const mailCode = require("../models/mailCode");

module.exports = async (req,res, next) => {
    try {
        const user = await mailCode.findOne({
            where: {
                email: req.body.email
            }
        });

        if (!user) return res.status(401).send("no mailCode found");

        const { password } = user.dataValues;

        const p = await bcrypt.compare(req.body.mailCode, password);

        if (req.body.mailCode !== req.mailCode) return res.status(401).send("email verification failed. the email code is wrong");
        if (!p) return res.status(400).send("invalid credentials.");
        
        next();
    } catch (ex) {
        winston.error(ex);
        res.status(400).send("something failed.");
    }
}
