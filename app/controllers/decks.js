var router = require('express').Router();
var Deck = require('../models/deck');
var Card = require('../models/card');
var runTransaction = require('../database/helper');
var requireLogin = require('../middleware/authentication');

async function getDecks(req, res) {
    console.log("Getting decks....");
    try {
        console.log(req.query.id);
        const decklist = await Deck.getAllFromCourseId(req.query.id);
        console.log(decklist);
        res.status(200).json({result: decklist});
    } catch (error) {
        console.log(`Unable to get decks from the database. Error: ${error.message}`)
        res.status(500).json({result: "An error occured while attempting to get your chapters. Please try again later."})
    }
}

async function addDeck(req, res) {
    console.log("New Deck Added..."); 
    var body = req.body;
    var deckname = body.deckname;
    var cards = body.cards;
    var courseId = req.query.id;

    //TODO: update midterm and final values when UI is updated
    const midterm = false;
    const final = false;       
    
    const deck = new Deck(deckname, midterm, final, courseId);
    try {
        await runTransaction(async () => {
            const deckId = await deck.create();
            const cardsPromises = cards.map((card) => {
                const newCard = new Card(card.prompt, card.answer, deckId);
                return newCard.create();
            })
            await Promise.all(cardsPromises);
        })
        res.sendStatus(200);
    } catch (error) {
        console.log(`Unable to add card deck with name: ${deckname} to database. Error: ${error.message}`)
        res.status(500).json({result: "An error has occured while attempting to add the deck to the database. Please try again later."})
    }
}

router.get('/decks', requireLogin, getDecks)
router.post('/addDeck', requireLogin, addDeck)

module.exports = router;