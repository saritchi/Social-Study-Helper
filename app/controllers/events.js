var router = require('express').Router();
var Event = require('../models/event');
var authentication = require('../middleware/authentication');
var moment = require('moment');



async function getEvents(req, res) {
    var userEmail = req.query.email;

    try {
        const events = await Event.getAllFromUserEmail(userEmail);
        res.status(200).json({result: events});
    } catch (error) {
        console.log(`Unable to get events from the database. Error: ${error.message}`)
        res.status(500).json({result: "An error occurred while attempting to get your calendar. Please try again later."})
    }
}

async function addEvent(req, res) {
    var body = req.body;
    var title = body.title;
    var description = body.description;
    var startDate = body.startDate;
    var endDate = body.endDate;
    var email = req.user.email;

    const event = new Event(email, title, description, startDate, endDate);
    try{
        const eventId = await event.create();   
        res.status(200).json({result: eventId});
        
    } catch (error) {
        console.log(error);
        console.log(`Unable to add event to calendar. Error ${error.message}`);
        res.status(500).json({result: "An error has occured while attempting to add the event to the database. Please try again later."})
    }
}

async function deleteEvent(req, res) {
    var id = req.query.id;


    try {
        await Event.deleteEvent(id);
        res.status(200);
    } catch (error) {
        console.log(`Unable to delete event from the database. Error: ${error.message}`)
        res.status(500).json({result: "An error occurred while attempting to delete an event from your calendar. Please try again later."})
    }
}

router.get('/deleteEvent', authentication.requireLogin, deleteEvent);
router.get('/events', authentication.requireLogin, getEvents);
router.post('/addEvent', authentication.requireLogin, addEvent);

module.exports = router;