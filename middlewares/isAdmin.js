module.exports = function (req, res, next) {
    if (req.user.isAdmin === false) return res.status(401).send("not authorized");
    next();
}