var router = require('express').Router();
var Card = require('../models/card');
var runTransaction = require('../database/helper');
var authentication = require('../middleware/authentication');

async function viewCards(req, res) {
    console.log("Fetching Cards...");
    const deckId = req.query.id

    try {
        const cards = await Card.getAllFromDeckId(deckId);
        console.log(cards)
        res.status(200).json({result: cards});
    } catch (error) {
        console.log(`Unable to get cards from the database. Error: ${error.message}`)
        res.status(500).json({result: "An error occured while attempting to get your courses. Please try again later."})
    }
}

async function update_study_time(req, res) {
    console.log("Adding timestamp to a card...")
    var body = req.body;
    var card_id = body.card_id;
    var deck_id = body.deck_id;
    var datetime = body.datetime;
    var difficulty = body.difficulty;

    const card = new Card(null, null, deck_id, card_id, datetime);
    try{
        await runTransaction(async () => {
            await card.update_difficulty()
        })
        res.sendStatus(200);
    } catch (error) {
        console.log(`Unable to update card with difficulty ${difficulty} to database. Error: ${error.message}`)
        res.status(500).json({result: "An error has occured while attempting to update the studytime to the database. Please try again later."})
   
    }

}

router.get('/viewCards', authentication.requireLogin, viewCards)
router.post('/timestampCard', authentication.requireLogin, update_study_time)

module.exports = router;