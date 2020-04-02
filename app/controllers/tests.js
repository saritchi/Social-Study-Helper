
var Test = require('../models/test');
var router = require('express').Router();

var runTransaction = require('../database/helper');
var requireLogin = require('../middleware/authentication');

async function addTest(req, res) {
    var body = req.body;
    var name = body.name;
    var courseId = body.courseId;
    var decklist = body.decklist;
    var testDate = body.testDate;
    var userEmail = body.userEmail;

    const test = new Test(name, courseId, decklist, testDate, userEmail);
    try {
        await runTransaction(async () => {
            const testId = await test.create();
        })
        res.sendStatus(200);
        
    } catch (error) {
        console.log(`Unable to add test with name: ${name} to database. Error: ${error.message}`);
        res.status(500).json({result: "An error occurred while attempting to add the test to the database. Please try again later."});
    }
}

router.post('/addTest', requireLogin, addTest)


module.exports = router;