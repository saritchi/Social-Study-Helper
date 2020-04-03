var router = require('express').Router();
var Message = require('../models/message');
var User = require('../models/user');
var requireLogin = require('../middleware/authentication');

async function sendMessage(req, res) {
    console.log("Sending message")
    var body = req.body;
    var toUser = body.toUser;
    var fromUser = body.fromUser;
    var messageText = body.messageText;

    const message = new Message(toUser, fromUser, messageText);
    try {
        await message.create();
        res.sendStatus(200);
    } catch(error) {
        console.log(`Unable to add message to the database. Error: ${error.message}`)
        res.status(500).json({result: "An error occurred while attempting to send the message. Please try again later."})
    }
}

async function getMessages(req, res) {
    console.log("Getting messages")
    var body = req.body;
    var userEmail = body.currentUser;
    var messageThreadUserEmail = body.messageThreadUser;

    try {
        const messages = await Message.getAllBetweenUsers(userEmail, messageThreadUserEmail);
        res.status(200).json({result: messages});
    } catch (error) {
        console.log(`Unable to get messages from the database between ${userEmail} and ${messageThreadUserEmail}. Error: ${error.message}`)
        res.status(500).json({result: "An error occurred while attempting to retreive your messages. Please try again later."})
    }
}

async function getMessagedUsers(req, res) {
    console.log("Getting users who've been message")
    var currentUser = req.query.email;

    try {
        const messages = await Message.getMessagesAssociatedWithUser(currentUser);
        const usersPromises = messages.map(async (message) => {
            return User.getUserFromEmail(message.toUser)
        })
        const users = await Promise.all(usersPromises);
        const userJSONSet = new Set(users.map((user) => JSON.stringify(user)));
        const distinctUsers = [...userJSONSet].map((json) => JSON.parse(json));
        res.status(200).json({result: distinctUsers});
    } catch (error) {
        console.log(`Unable to get users who ${currentUser} has messaged. Error: ${error.message}`)
        res.status(500).json({result: "An error occurred while attempting to retreive your message threads. Please try again later."})
    }
}

router.post('/message', requireLogin, sendMessage)
router.get('/messages', requireLogin, getMessages)
router.get('/messagedUsers', requireLogin, getMessagedUsers)

module.exports = router;