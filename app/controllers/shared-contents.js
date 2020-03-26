var router = require('express').Router();
var SharedCourse = require('../models/shared-course')
var SharedDecks = require('../models/shared-deck')
var Course = require('../models/course');
var Deck = require('../models/deck');
var requireLogin = require('../middleware/authentication');

//TODO error check that the content hasn't already been shared
async function shareCourse(req, res) {
    console.log("Getting shared courses")
    var body = req.body;
    var toUsers = body.toEmails;
    var fromUser = body.fromEmail;
    var courseId = body.id;

    try {
        
        toUsers.map((toUser) => {
            const sharedCourse = new SharedCourse(toUser, fromUser, courseId);
            sharedCourse.create();
        })
        await Promise.all(toUsers)
        res.sendStatus(200);
    } catch (error) {
        console.log(`Unable to share course with id: ${courseId} from ${fromUser} to user ${toUsers}. Error: ${error.message}`)
        res.status(500).json({result: "An error occurred while attempting to share that course. Please try again later."})
    }    
}

//TODO error check that the content hasn't already been shared
async function sharedDeck(req, res) {
    console.log("Getting shared decks")
    var body = req.body;
    var toUsers = body.toEmails;
    var fromUser = body.fromEmail;
    var deckId = body.id;

    try {
        
        toUsers.map((toUser) => {
            const sharedDeck = new SharedDecks(toUser, fromUser, deckId);
            sharedDeck.create();
        })
        await Promise.all(toUsers)
        res.sendStatus(200);
    } catch (error) {
        console.log(`Unable to share deck with id: ${deckId} from ${fromUser} to user ${toUsers}. Error: ${error.message}`)
        res.status(500).json({result: "An error occurred while attempting to share that deck. Please try again later."})
    }    
}

async function getSharedCourses(req, res) {
    console.log("Getting shared content for user....");
    var userEmail = req.query.email;
    var limit = req.query.limit

    try {
        const sharedCourses = await SharedCourse.getForUser(userEmail, limit);
        const sharedCoursesPromises = sharedCourses.map((sharedCourse) => Course.getFromId(sharedCourse.courseId))
        const courses = await Promise.all(sharedCoursesPromises)
        console.log(courses);
        res.status(200).json({result: courses});
    } catch (error) {
        console.log(`Unable to get shared courses from the database. Error: ${error.message}`)
        res.status(500).json({result: "An error occurred while attempting to get your shared courses. Please try again later."})
    }
}

async function getSharedDecks(req, res) {
  console.log("Getting shared content for user....");
  var userEmail = req.query.email;
  var limit = req.query.limit

  try {
      const sharedDecks = await SharedDecks.getForUser(userEmail, limit);
      const sharedDeckPromises = sharedDecks.map((sharedDeck) =>  Deck.getFromId(sharedDeck.courseId))
      const decks = await Promise.all(sharedDeckPromises)
      console.log(decks);
      res.status(200).json({result: decks});
  } catch (error) {
      console.log(`Unable to get shared decks from the database. Error: ${error.message}`)
      res.status(500).json({result: "An error occurred while attempting to get your shared decks. Please try again later."})
  }
}


router.post('/shareCourse', requireLogin, shareCourse)
router.post('/shareDecks', requireLogin, sharedDeck)
router.get('/sharedCourses', requireLogin, getSharedCourses)
router.get('/sharedDecks', requireLogin, getSharedDecks)


module.exports = router;