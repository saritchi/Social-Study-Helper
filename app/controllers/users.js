var router = require('express').Router();
var requireLogin = require('../middleware/authentication');
var User = require('../models/user');

async function authenticateUser(req, res) {
    let email = req.body.email;
    let password = req.body.password;

    const user = new User(email, password);
    try {
        await user.authenticate();
        delete user.password;
        req.session.user = user;
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
        await newUser.create();
        res.status(200).json({result: "Registration succesful."});
     } catch (error) {
        console.log(error);
        res.status(500).json({result: "An error occured while attempting to register. Please try again later."});
    }
}
    
async function registerGoogleUser(req, res) {
    let post = req.body;
    let email = post.email;
    let password = post.password;
    let firstname = post.fname;
    let lastname = post.lname;


    const newUser = new User(email, password, firstname, lastname);
    try { 
        const userExists = await newUser.exists();
        if (userExists) {
            delete newUser.password;
            req.session.user = newUser;
            res.sendStatus(200);
            return;
        }
        await newUser.create();
        delete newUser.password;
        req.session.user = newUser;
        res.sendStatus(200);
     } catch (error) {
        console.log(error);
        res.status(500).json({result: "An error occured while attempting to register Google User. Please try again later."});
    }
}

function logoutUser(req, res) {
    console.log("Resetting user session")
    req.session.reset();
    res.sendStatus(200);
}

router.post('/auth', authenticateUser)
router.post('/register', registerUser)
router.get('/logout', requireLogin, logoutUser);
router.post('/google/register', registerGoogleUser)

module.exports = router;