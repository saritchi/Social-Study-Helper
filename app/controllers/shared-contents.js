var router = require('express').Router();
var SharedContent = require('../models/shared-content');
var Course = require('../models/course');
var Deck = require('../models/deck');
var requireLogin = require('../middleware/authentication');

async function getSharedContent(req, res) {
      //TODO: endpoint will need a query paremeter for the number of courses.
    console.log("Getting shared content for user....");
    var userEmail = req.query.email;

    try {
        const sharedContents = await SharedContent.getAllForUser(userEmail);
        const decksAndCoursesPromises = sharedContents.map((sharedContent) => {
            if (sharedContent.courseId) {
                return Course.getFromId(sharedContent.courseId)
            } else if (sharedContent.deckId) {
                return Deck.getFromId(sharedContent.deckId);
            } else {
                throw Error("Invalid Argument: Shared Content deckId and courseId were both null!")
            }
        })
        const decksAndCourses = await Promise.all(decksAndCoursesPromises)
        console.log(decksAndCourses);
        res.status(200).json({result: decksAndCourses});
    } catch (error) {
        console.log(`Unable to get shared content from the database. Error: ${error.message}`)
        res.status(500).json({result: "An error occurred while attempting to get your shared content. Please try again later."})
    }
}

//TODO error check that the content hasn't already been shared
async function shareContent(req, res) {
    console.log("Sharing content")
    var body = req.body;
    var toUsers = body.toEmails;
    var fromUser = body.fromEmail;
    //either deckId or courseId must be null.
    var deckId = body.deckId;
    var courseId = body.courseId;

    try {
        
        toUsers.map((toUser) => {
            const sharedContent = new SharedContent(toUser, fromUser, courseId, deckId);
            sharedContent.create();
        })
        await Promise.all(toUsers)
        res.sendStatus(200);
    } catch (error) {
        console.log(`Unable to share course with id: ${courseId} from ${fromUser} to user ${toUsers}. Error: ${error.message}`)
        res.status(500).json({result: "An error occurred while attempting to share that course. Please try again later."})
    }    
}


router.post('/share', requireLogin, shareContent)
router.get('/sharedContent', requireLogin, getSharedContent)

module.exports = router;