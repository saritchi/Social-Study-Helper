var router = require('express').Router();
var User = require('../models/user')
var SharedCourse = require('../models/shared-course')
var SharedDeck = require('../models/shared-deck')
var Course = require('../models/course');
var Deck = require('../models/deck');
var runTransaction = require('../database/helper');

var UserDoesNotExistError = require('../errors/UserDoesNotExistError')
var DeckDoesNotExistError = require('../errors/DeckDoesNotExistError')

var authentication = require('../middleware/authentication');

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
        var sharedCourses;
        await runTransaction(async () => {
            const sharedCoursesPromises = toEmails.map(async (toEmail) => {
                const user = new User(toEmail)
                const userExists = await user.exists();
                if(!userExists) {
                    console.log(`User does not exist. Not sharing course with ${toEmail}.`);
                    throw new UserDoesNotExistError(toEmail, `User ${toEmail} does not exist.`);
                }
                
                var sharedCourse = new SharedCourse(toEmail, fromEmail, courseId);
                sharedCourse.id = await sharedCourse.create();

                await shareDecksFromCourseId(toEmail, fromEmail, courseId);
                return sharedCourse;
            })
            sharedCourses = await Promise.all(sharedCoursesPromises)
        })
        console.log(sharedCourses);
        res.status(200).json({result: sharedCourses});    
    } catch (error) {
        if (error instanceof UserDoesNotExistError) {
            console.log(`Unable to share course with id: ${courseId} from ${fromEmail} to users ${toEmails}. Error: ${error.message}`)
            res.status(404).json({result: `Unable to share the course with user ${error.email}. Please verify the email and try again.`})
        } else {
            console.log(`Unable to share course with id: ${courseId} from ${fromEmail} to users ${toEmails}. Error: ${error.message}`)
            res.status(500).json({result: "An error occurred while attempting to share that course. Please try again later."})
        }
    }    
}

async function shareDecksFromCourseId(toEmail, fromEmail, courseId) {
    console.log("Sharing decks from course with id: " + courseId);
    const decks = await Deck.getDecksFromCourseId(courseId);
    decks.forEach(async (deck) => {
        console.log("Sharing deck: " + deck.name + " with courseId: " + courseId);
        const sharedDeck = new SharedDeck(toEmail, fromEmail, deck.id);
        //if the user has already shared the deck and is now sharing the course we don't create a new entry for it.
        if(await sharedDeck.exists()) {
            console.log("ShareDeck entry already exists for this deck. Skipping.");
            return;
        }

        await sharedDeck.create();
    })
}

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
                throw new DeckDoesNotExistError(toEmail, `User ${toEmail} does not exist.`);
            }

            var sharedDeck = new SharedDeck(toEmail, fromEmail, deckId);
            sharedDeck.id = await sharedDeck.create();
            return sharedDeck;
        })
        
        const sharedDecks = await Promise.all(sharedDecksPromises)
        res.status(200).json({result: sharedDecks});
    } catch (error) {
        if (error instanceof DeckDoesNotExistError) {
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

async function getUsersForSharedCourse(req, res) {
    console.log("Getting shared course objects for user")
    var userEmail = req.query.email;
    try {
        const sharedCourses = await SharedCourse.getCoursesForUser(userEmail);
        console.log(sharedCourses);
        res.status(200).json({result: sharedCourses});
    } catch(error) {
        console.log(`Unable to get shared decks from the database. Error: ${error.message}`)
        res.status(500).json({result: "An error occurred while attempting to get your shared deck content. Please try again later."})
    }
}

async function getUsersForSharedDeck(req, res) {
    console.log("Getting shared deck objects for user")
    var userEmail = req.query.email;
    try {
        const sharedDecks = await SharedDeck.getDecksForUser(userEmail);
        console.log(sharedDecks);
        res.status(200).json({result: sharedDecks});
    } catch(error) {
        console.log(`Unable to get shared decks from the database. Error: ${error.message}`)
        res.status(500).json({result: "An error occurred while attempting to get your shared course content. Please try again later."})
    }
}

async function deleteSharedCourse(req, res) {
    var sharedCourseId = req.query.id
    console.log("Deleting course with id " + sharedCourseId);
    try {
        await runTransaction(async () => {
            await deleteSharedDecksFromSharedCourseId(sharedCourseId);
            await SharedCourse.deleteWithId(sharedCourseId);
        })
        res.sendStatus(200)
    } catch(error) {
        console.log(`Unable to delete shared course from the database. Error: ${error.message}`)
        res.status(500).json({result: "An error occurred while attempting to remove the shared user. Please try again later."})
    }
}

async function deleteSharedDecksFromSharedCourseId(sharedCourseId) {
    console.log("Deleting shared decks associated with sharedCourseId: " + sharedCourseId)
    const sharedCourse = await SharedCourse.getSharedCourseFromId(sharedCourseId);
    const decks = await Deck.getDecksFromCourseId(sharedCourse.courseId);
    return decks.map(async (deck) => {
        await SharedDeck.deleteWithEmailsAndId(sharedCourse.fromUser, sharedCourse.toUser, deck.id);
    })
}

async function deleteSharedDeck(req, res) {
    var deckId = req.query.id
    console.log("Deleting deck with id " + deckId);
    try {
        await SharedDeck.deleteWithId(deckId);
        res.sendStatus(200)
    } catch(error) {
        console.log(`Unable to delete shared deck from the database. Error: ${error.message}`)
        res.status(500).json({result: "An error occurred while attempting to remove the shared user. Please try again later."})
    }
}

router.post('/shareCourse', authentication.requireLogin, shareCourse)
router.post('/shareDeck', authentication.requireLogin, shareDeck)

router.get('/sharedCourses', authentication.requireLogin, getSharedCourses)
router.get('/sharedDecks', authentication.requireLogin, getSharedDecks)

router.get('/sharedCourseContent', authentication.requireLogin, getUsersForSharedCourse)
router.get('/sharedDeckContent', authentication.requireLogin, getUsersForSharedDeck)

router.delete('/sharedCourse', authentication.requireLogin, deleteSharedCourse) 
router.delete('/sharedDeck', authentication.requireLogin, deleteSharedDeck)


module.exports = router;