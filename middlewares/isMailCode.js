module.exports = function (res, req, next) {
    try {
        if(req.body.mailCode !== req.mailCode) return res.status(401).send("email verification failed. the email code is wrong")
        next();
    } catch (ex) {
        winston.error(ex, ex.message);
        res.status(400).send("something failed.");
    }
}
