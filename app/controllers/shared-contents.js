var router = require('express').Router();
var User = require('../models/user')
var SharedCourse = require('../models/shared-course')
var SharedDeck = require('../models/shared-deck')
var Course = require('../models/course');
var Deck = require('../models/deck');

var UserDoesNotExist = require('../errors/UserDoesNotExistError')
var DeckDoesNotExist = require('../errors/DeckDoesNotExistError')


var requireLogin = require('../middleware/authentication');

//TODO error check that the content hasn't already been shared
async function shareCourse(req, res) {
    console.log("Sharing course")
    var body = req.body;
    var toEmails = body.toEmails;
    var fromEmail = body.fromEmail;
    var courseId = body.id;

    if(containsCurrentUser(fromEmail, toEmails)) {
        console.log("Attempting to share course with yourself.")
        res.status(400).json({result: `Unable to share course with yourself. Please use a different email and try again.`})
        return;
    }

    try {
        const sharedCoursesPromises = toEmails.map(async (toEmail) => {
            const user = new User(toEmail)
            const userExists = await user.exists();
            if(!userExists) {
                console.log(`User does not exist. Not sharing course with ${toEmail}.`);
                throw new UserDoesNotExist(toEmail, `User ${toEmail} does not exist.`);
            }

            const sharedCourse = new SharedCourse(toEmail, fromEmail, courseId);
            sharedCourse.create();
        })
        await Promise.all(sharedCoursesPromises)
        res.sendStatus(200);
    } catch (error) {
        if (error instanceof UserDoesNotExist) {
            console.log(`Unable to share course with id: ${courseId} from ${fromEmail} to users ${toEmails}. Error: ${error.message}`)
            res.status(404).json({result: `Unable to share the course with user ${error.email}. Please verify the email and try again.`})
        } else {
            console.log(`Unable to share course with id: ${courseId} from ${fromEmail} to users ${toEmails}. Error: ${error.message}`)
            res.status(500).json({result: "An error occurred while attempting to share that course. Please try again later."})
        }
    }    
}

//TODO error check that the content hasn't already been shared
async function shareDeck(req, res) {
    console.log("Sharing deck")
    var body = req.body;
    var toEmails = body.toEmails;
    var fromEmail = body.fromEmail;
    var deckId = body.id;

    if(containsCurrentUser(fromEmail, toEmails)) {
        console.log("Attempting to share deck with yourself.")
        res.status(400).json({result: `Unable to share deck with yourself. Please use a different email and try again.`})
        return;
    }

    try {
        const sharedDecksPromises = toEmails.map(async (toEmail) => {
            const user = new User(toEmail)
            const userExists = await user.exists();
            if(!userExists) {
                console.log(`User does not exist. Not sharing deck with ${toEmail}.`);
                throw new DeckDoesNotExist(toEmail, `User ${toEmail} does not exist.`);
            }

            const sharedDeck = new SharedDeck(toEmail, fromEmail, deckId);
            sharedDeck.create();
        })
        await Promise.all(sharedDecksPromises)
        res.sendStatus(200);
    } catch (error) {
        if (error instanceof DeckDoesNotExist) {
            console.log(`Unable to share deck with id: ${deckId} from ${fromEmail} to users ${toEmails}. Error: ${error.message}`)
            res.status(404).json({result: `Unable to share the deck with user ${error.email}. Please verify the email and try again.`})
        } else {
            console.log(`Unable to share deck with id: ${deckId} from ${fromEmail} to users ${toEmails}. Error: ${error.message}`)
            res.status(500).json({result: "An error occurred while attempting to share that deck. Please try again later."})
        }
    }    
}

function containsCurrentUser(currentUserEmail, toEmails) {
    return toEmails.includes(currentUserEmail)
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