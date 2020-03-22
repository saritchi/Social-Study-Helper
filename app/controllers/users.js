var router = require('express').Router();
var User = require('../models/user');

async function authenticateUser(req, res) {
    let email = req.body.email;
    let password = req.body.password;

    const user = new User(email, password);
    try {
        await user.authenticate();
        res.send(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({result: "An error occured while attempting to authenticate. Please try again later."})
    }
}

async function registerUser(req, res) {
    let post = req.body;
    let email = post.email;
    let password = post.password;
    let firstname = post.fname;
    let lastname = post.lname;


    const newUser = new User(email, password, firstname, lastname);
    try {
        const userExists = await newUser.exists();
        if (userExists) {
            res.status('409').json({result: "An error occured while attempting to register since Username already Exists."});
            return;
        }
        await newUser.register();
        res.status(200).json({result: "Registration succesful."});
     } catch (error) {
        console.log(error);
        res.status(500).json({result: "An error occured while attempting to register. Please try again later."});
    }
}

router.post('/auth', authenticateUser)
router.post('/register', registerUser)

module.exports = router;