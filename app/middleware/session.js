var User = require('../models/user');
//The authentication and session function is based on code from this tutorial
//https://stormpath.com/blog/everything-you-ever-wanted-to-know-about-node-dot-js-sessions
/**
 * middleware function that attaches the user to the session object on each request. This allows for each request to be authenticated
 */
module.exports = async function(req, res, next) {
    const session = req.session;
    if(session && session.user) {
        const user = new User(session.user.email, '', session.user.fname, session.user.lname, session.user.role)
        try {
            const userExists = await user.exists();
            if(userExists) {
                
                req.user = user;
                req.session.user = user;
                res.locals.user = user;
            }
        } catch (error) {
            res.status(500).json({result: "An error has occured. Please try again later."});
            return;
        }
    }
    next();
}