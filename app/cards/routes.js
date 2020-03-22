var router = require('express').Router();
var Card = require('./card');

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

router.get('/viewCards', viewCards)

module.exports = router;