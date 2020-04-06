var router = require('express').Router();
var Message = require('../models/message');
var User = require('../models/user');
var authentication = require('../middleware/authentication');

async function sendMessage(req, res) {
    console.log("Sending message")
    var body = req.body;
    var toUsers = body.toUsers;
    var fromUser = body.fromUser;
    var messageText = body.message;
    var timeSent = body.timeSent;

    try {
        const sendToUsersPromises = toUsers.map(async (toUser) => {
            const message = new Message(toUser, fromUser, messageText, timeSent);
            await message.create();
            return User.getUserFromEmail(toUser);
        })

        const sendToUser = await Promise.all(sendToUsersPromises);
        res.status(200).json({result: sendToUser});
    } catch(error) {
        console.log(`Unable to add message to the database. Error: ${error.message}`)
        res.status(500).json({result: "An error occurred while attempting to send the message. Please try again later."})
    }
}

async function getMessages(req, res) {
    console.log("Getting messages")
    var fromUser = req.query.currentUser;
    var toUser = req.query.otherUser;

    try {
        const messages = await Message.getAllBetweenUsers(fromUser, toUser);
        res.status(200).json({result: messages});
    } catch (error) {
        console.log(`Unable to get messages from the database between ${toUser} and ${fromUser}. Error: ${error.message}`)
        res.status(500).json({result: "An error occurred while attempting to retreive your messages. Please try again later."})
    }
}

async function getMessagedUsers(req, res) {
    console.log("Getting users who've been message")
    var currentUser = req.query.email;

    try {
        const messages = await Message.getMessagesAssociatedWithUser(currentUser);
        const usersPromises = messages.map(async (message) => {
            const userEmail = currentUser === message.fromUser ? message.toUser : message.fromUser;
            return User.getUserFromEmail(userEmail)
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

router.post('/message', authentication.requireLogin, sendMessage)
router.get('/messages', authentication.requireLogin, getMessages)
router.get('/messagedUsers', authentication.requireLogin, getMessagedUsers)

module.exports = router;