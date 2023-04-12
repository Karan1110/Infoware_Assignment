const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    if (!req.header("x-auth-token")) return res.status(400).send("no token provided");
    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded; 
    next();
    } catch (ex) {
        res.status(400).send("invalid token.");
    }
}