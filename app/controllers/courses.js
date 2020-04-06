var router = require('express').Router();
var Course = require('../models/course');
var Deck = require('../models/deck');
var Card = require('../models/card');
var SharedCourse = require('../models/shared-course');
var SharedDeck = require('../models/shared-deck');
var runTransaction = require('../database/helper');
var authentication = require('../middleware/authentication');

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

async function getCourse(req, res) {
    console.log("Getting course....");
    var courseId = req.query.id;

    try {
        const course = await Course.getFromId(courseId);
        const decks = await Deck.getDecksFromCourseId(courseId);
        course['decknames'] = decks.map((deck) => deck.name);
        console.log(course);
        res.status(200).json({result: course});
    } catch (error) {
        console.log(`Unable to get course from the database. Error: ${error.message}`)
        res.status(500).json({result: "An error occurred while attempting to get your course. Please try again later."})
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

async function editCourse(req, res) {
    var body = req.body;
    const courseId = body.id;
    var coursename = body.coursename;
    var decknames = body.decks;
    var userEmail = body.email;


    if(!isValidCourseRequest(coursename, decknames)) {
        console.log("Invalid course request found.")
        res.status(400).json({result: "Error processing request."})
        return;
    }

     //TODO: when chapters table is set up, insert chapters into that table with FK is the course PK.
    //TODO: when UI for addCourse is updated use the final and midterm values.
    var final = false;
    var midterm = false;
    const course = new Course(coursename, midterm, final, userEmail, courseId);
    try {
        await runTransaction(async () => {
            await course.update();

            const decks = await Deck.getDecksFromCourseId(courseId);
            const deckUpdates = decknames.map((deckname, index) => {
                const existingDeck = new Deck(deckname, midterm, final, courseId, decks[index].id);
                return existingDeck.update_name();
            })

            await Promise.all(deckUpdates);
        })
        console.log("Updated course with name: " + coursename);
        res.sendStatus(200);
    } catch (error) {
        console.log(`Unable to update course with name: ${coursename} to database. Error: ${error.message}`)
        res.status(500).json({result: "An error occurred while attempting to update the course. Please try again later."})
    }
}

async function deleteCourse(req, res) {
    const courseId = req.query.id;
    try {
        await runTransaction(async () => {
            const deleteSharedCoursesPromise = await deleteAllassociatedSharedCourses(courseId)
            await Promise.all(deleteSharedCoursesPromise);

            const deleteAllDecksFromCoursePromise = await deleteAllDecksFromCourse(courseId);
            await Promise.all(deleteAllDecksFromCoursePromise);

            await Course.deleteWithId(courseId);
        })
        res.sendStatus(200);
    } catch(error) {
        console.log(`Unable to delete course with id: ${courseId}. Error: ${error.message}`)
        res.status(500).json({result: "An error occurred while attempting to remove that course. Please try again later."})
    }
}

async function deleteAllassociatedSharedCourses(courseId) {
    const sharedCourses = await SharedCourse.getAllForCourseId(courseId);
    return sharedCourses.map(async (sharedCourses) => SharedCourse.deleteWithId(sharedCourses.id))
}

async function deleteAllDecksFromCourse(courseId) {
    const decks = await Deck.getDecksFromCourseId(courseId);
    return decks.map(async (deck) => {
        const deletesharedDecksPromise = await deleteAllassociatedSharedDecks(deck.id);
        await Promise.all(deletesharedDecksPromise);

        const card = new Card(null, null, deck.id);
        await card.delete_cards();

        return Deck.deleteWithId(deck.id);
    })
}

async function deleteAllassociatedSharedDecks(deckId) {
    const sharedDecks = await SharedDeck.getAllForDeckId(deckId);
    return sharedDecks.map(async (sharedDeck) => await SharedDeck.deleteWithId(sharedDeck.id))
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


router.get('/courses', authentication.requireLogin, getCourses)
router.get('/course', authentication.requireLogin, getCourse);

router.post('/addCourse', authentication.requireLogin, addCourse)
router.post('/editCourse', authentication.requireLogin, editCourse)
router.post('/updateCourse', authentication.requireLogin, updateCourse)

router.delete('/deleteCourse', authentication.requireLogin, deleteCourse);

module.exports = router;