const debug = require("debug")("email-verify");

module.exports = function (req,res, next) {
    try {
        if(req.body.mailCode !== req.mailCode) return res.status(401).send("email verification failed. the email code is wrong")
        next();
    } catch (ex) {
        debug(ex, ex.message);
        res.status(400).send("something failed.");
    }
}
