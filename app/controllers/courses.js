var router = require('express').Router();
var Course = require('../models/course');
var Deck = require('../models/deck');
var runTransaction = require('../database/helper');
var requireLogin = require('../middleware/authentication');

async function getCourses(req, res) {
    console.log("Getting courses....");
    var userEmail = req.query.email;
    var limit = req.query.limit
    var orderBy = req.query.orderBy;

    try {
        const courses = await Course.getCoursesFourUser(userEmail, limit, orderBy);
        console.log(courses);
        res.status(200).json({result: courses});
    } catch (error) {
        console.log(`Unable to get courses from the database. Error: ${error.message}`)
        res.status(500).json({result: "An error occurred while attempting to get your courses. Please try again later."})
    }
}

async function addCourse(req, res) {
    var body = req.body;
    var coursename = body.coursename;
    var decks = body.decks;
    var userEmail = body.email;
    var lastAccess = body.lastAccess


    if(!isValidCourseRequest(coursename, decks)) {
        console.log("Invalid course request found.")
        res.status(400).json({result: "Error processing request."})
        return;
    }

    //TODO: when chapters table is set up, insert chapters into that table with FK is the course PK.
    //TODO: when UI for addCourse is updated use the final and midterm values.
    var final = false;
    var midterm = false;

    const course = new Course(coursename, midterm, final, userEmail, null, lastAccess);
    try {
        await runTransaction(async () => {
            const courseId = await course.create();
            const deckPromises = decks.map((deckname) => {
                const newDeck = new Deck(deckname, midterm, final, courseId);
                return newDeck.create();
            })
            
            await Promise.all(deckPromises);
        })
        console.log("Add course with name: " + coursename);
        res.sendStatus(200);
    } catch (error) {
        console.log(`Unable to add course with name: ${coursename} to database. Error: ${error.message}`)
        res.status(500).json({result: "An error occurred while attempting to add the course to the database. Please try again later."})
    }
}

function isValidCourseRequest(coursename, decks) {
    var emptyDecks = false;
    decks.forEach((deck) => {
        if (!deck) {
            emptyDecks = true;
        }
    });

    return coursename && !emptyDecks;
}

async function updateCourse(req, res) {
    var body = req.body;
    var courseInfo = body.params.course;

    const course = new Course(courseInfo.name, courseInfo.midterm, courseInfo.final, 
                              courseInfo.userEmail, courseInfo.id, courseInfo.lastAccess)
    try {
        await course.update();
        res.sendStatus(200);
    } catch (error) {
        console.log(`Unable to update course with id: ${courseInfo.id}. Error: ${error.message}`)
        res.status(500).json({result: "An error occurred. Please try again later."})
    }

}


router.get('/courses', requireLogin, getCourses)
router.post('/addCourse', requireLogin, addCourse)
router.post('/updateCourse', requireLogin, updateCourse)

module.exports = router;