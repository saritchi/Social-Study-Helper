module.exports = function requireLogin(req, res, next) {
    if(!req.user) {
        console.log("Unauthenticated api access. Returning 401 status code");
        res.sendStatus(401);
        return;
    }
    next();
}