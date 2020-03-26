var router = require('express').Router();
var SharedCourse = require('../models/shared-course')
var SharedDeck = require('../models/shared-deck')
var Course = require('../models/course');
var Deck = require('../models/deck');
var requireLogin = require('../middleware/authentication');

//TODO error check that the content hasn't already been shared
async function shareCourse(req, res) {
    console.log("Sharing courses")
    var body = req.body;
    var toUsers = body.toEmails;
    var fromUser = body.fromEmail;
    var courseId = body.id;

    try {
        
        const sharedCoursesPromises = toUsers.map((toUser) => {
            const sharedCourse = new SharedCourse(toUser, fromUser, courseId);
            sharedCourse.create();
        })
        await Promise.all(sharedCoursesPromises)
        res.sendStatus(200);
    } catch (error) {
        console.log(`Unable to share course with id: ${courseId} from ${fromUser} to user ${toUsers}. Error: ${error.message}`)
        res.status(500).json({result: "An error occurred while attempting to share that course. Please try again later."})
    }    
}

//TODO error check that the content hasn't already been shared
async function shareDeck(req, res) {
    console.log("Sharing decks")
    var body = req.body;
    var toUsers = body.toEmails;
    var fromUser = body.fromEmail;
    var deckId = body.id;

    try {
        const sharedDecksPromises = toUsers.map((toUser) => {
            const sharedDeck = new SharedDeck(toUser, fromUser, deckId);
            sharedDeck.create();
        })
        await Promise.all(sharedDecksPromises)
        res.sendStatus(200);
    } catch (error) {
        console.log(`Unable to share deck with id: ${deckId} from ${fromUser} to user ${toUsers}. Error: ${error.message}`)
        res.status(500).json({result: "An error occurred while attempting to share that deck. Please try again later."})
    }    
}

async function getSharedCourses(req, res) {
    console.log("Getting shared courses for user....");
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
  console.log("Getting shared decks for user....");
  var userEmail = req.query.email;
  var limit = req.query.limit

  try {
      const sharedDecks = await SharedDeck.getForUser(userEmail, limit);
      const sharedDeckPromises = sharedDecks.map((sharedDeck) => {
        return Deck.getFromId(sharedDeck.deckId)
      })
      const decks = await Promise.all(sharedDeckPromises)
      console.log(decks);
      res.status(200).json({result: decks});
  } catch (error) {
      console.log(`Unable to get shared decks from the database. Error: ${error.message}`)
      res.status(500).json({result: "An error occurred while attempting to get your shared decks. Please try again later."})
  }
}


router.post('/shareCourse', requireLogin, shareCourse)
router.post('/shareDeck', requireLogin, shareDeck)
router.get('/sharedCourses', requireLogin, getSharedCourses)
router.get('/sharedDecks', requireLogin, getSharedDecks)


module.exports = router;