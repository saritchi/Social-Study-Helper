
var Test = require('../models/test');
var router = require('express').Router();

var authentication = require('../middleware/authentication');

async function addTest(req, res) {
    console.log("Adding test...");
    var body = req.body;
    var name = body.name;
    var courseId = body.courseId;
    var decklist = body.decklist;
    var testDate = body.testDate;
    var userEmail = body.userEmail;

    const test = new Test(name, courseId, decklist, testDate, userEmail);
    try {
        await test.create();
        res.sendStatus(200);
        
    } catch (error) {
        console.log(`Unable to add test with name: ${name} to database. Error: ${error.message}`);
        res.status(500).json({result: "An error occurred while attempting to add the test to the database. Please try again later."});
    }
}

async function getTests(req, res) {
    console.log("Getting tests...");
    try {
        console.log(req.query.id);
        const testList = await Test.getTestsByUser(req.query.userEmail);
        console.log(testList);
        res.status(200).json({result: testList});
    } catch (error) {
        console.log(`Unable to get tests from the database. Error: ${error.message}`)
        res.status(500).json({result: "An error occured while attempting to get your tests. Please try again later."})
    }
}

async function deleteTest(req, res) {
    const testId = req.query.id;
    try {
        await Test.deleteWithId(testId);
        res.sendStatus(200);
    } catch(error) {
        console.log(`Unable to delete test with id: ${testId}. Error: ${error.message}`)
        res.status(500).json({result: "An error occured while attempting to remove test. Please try again later."})
    }
}

router.post('/addTest', authentication.requireLogin, addTest)
router.get('/getTests', authentication.requireLogin, getTests)
router.delete('/deleteTest', authentication.requireLogin, deleteTest)


module.exports = router;