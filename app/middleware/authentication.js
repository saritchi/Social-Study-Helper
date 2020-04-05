//This function is based on code from this session tutorial
//https://stormpath.com/blog/everything-you-ever-wanted-to-know-about-node-dot-js-sessions
/**
 * Middleware that checks requests for user authentication.
 */
module.exports.requireLogin = function requireLogin(req, res, next) {
    if(!req.user) {
        console.log("Unauthenticated api access. Returning 401 status code");
        res.sendStatus(401);
        return;
    }
    next();
}

module.exports.requireTeacherRole = function requireTeacherRole(req, res, next) {
    if (req.user.role !== 'teacher') {
        console.log("Attempting to access teacher resource as non teacher. Returning 401 status code");
        res.sendStatus(401);
        return;
    }
    next();
}