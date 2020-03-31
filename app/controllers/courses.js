var router = require('express').Router();
var Course = require('../models/course');
var Deck = require('../models/deck');
var runTransaction = require('../database/helper');
var requireLogin = require('../middleware/authentication');

async function getCourses(req, res) {
      //TODO: endpoint will need a query paremeter for the number of courses.
    console.log("Getting courses....");
    var userEmail = req.query.email;

    try {
        const courses = await Course.getAllForUser(userEmail);
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


    if(!isValidCourseRequest(coursename, decks)) {
        console.log("Invalid course request found.")
        res.status(400).json({result: "Error processing request."})
        return;
    }

    //TODO: when chapters table is set up, insert chapters into that table with FK is the course PK.
    //TODO: when UI for addCourse is updated use the final and midterm values.
    var final = false;
    var midterm = false;

    const course = new Course(coursename, midterm, final, userEmail);
    try {
        await runTransaction(async () => {
            const courseId = await course.create();
            decks.map((deckname) => {
                const newDeck = new Deck(deckname, midterm, final, courseId);
                return newDeck.create();
            })
            
            await Promise.all(decks);
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

router.get('/courses', requireLogin, getCourses)
router.post('/addCourse', requireLogin, addCourse)

module.exports = router;