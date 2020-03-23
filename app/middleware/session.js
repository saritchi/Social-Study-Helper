var User = require('../models/user');

module.exports = async function(req, res, next) {
    const session = req.session;
    if(session && session.user) {
        const user = new User(session.user.email);
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