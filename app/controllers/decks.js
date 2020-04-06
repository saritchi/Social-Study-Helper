var router = require('express').Router();
var Deck = require('../models/deck');
var Card = require('../models/card');
var SharedDeck = require('../models/shared-deck')
var SharedCourse = require('../models/shared-course')
var runTransaction = require('../database/helper');
var authentication = require('../middleware/authentication');

async function getDecks(req, res) {
    console.log("Getting decks....");
    try {
        console.log(req.query.id);
        const decklist = await Deck.getDecksFromCourseId(req.query.id);
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
    console.log("Adding deck: " + deckname);
    //TODO: update midterm and final values when UI is updated
    const midterm = false;
    const final = false;       
    
    const deck = new Deck(deckname, midterm, final, courseId);
    try {
        await runTransaction(async () => {
            const deckId = await deck.create();
            const sharedCourses = await SharedCourse.getAllForCourseId(courseId);

            //if the course the deck is in has been shared create shared decks entries for the deck.
            const shareDeckForCoursesPromises = sharedCourses.map((sharedCourse) => {
                const sharedDeck = new SharedDeck(sharedCourse.toUser, sharedCourse.fromUser, deckId);
                return sharedDeck.create();
            })
            await Promise.all(shareDeckForCoursesPromises);

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

async function getDeckData(req, res) {
    console.log("Fetching Cards...");
    const deckId = req.query.deck
    console.log(deckId)

    try {
        const cards = await Card.getAllFromDeckId(deckId);
        console.log(cards)
        const deck = await Deck.getFromId(deckId);
        console.log(deck)
        
        res.status(200).json({result_cards: cards, result_names: deck});
    } catch (error) {
        console.log(`Unable to get cards from the database. Error: ${error.message}`)
        res.status(500).json({result: "An error occured while attempting to get your courses. Please try again later."})
    }
}

async function updateDeck(req, res) {
    console.log("Updating Deck..."); 
    var body = req.body;
    var deckname = body.deckname;
    var cards = body.cards;
    var deckId = body.deckId;
    var courseId = body.courseId;
    const deck = new Deck(deckname, false, false, courseId, deckId, '', '');
    try{
        await runTransaction(async () => {
            
            deck.update_name()
            const deleteDeck = new Card('', '', deckId, '', null);
            await deleteDeck.delete_cards();
            await deleteDeck.reset_increment();

            cards.map((card) => {
                const newCard = new Card(card.prompt, card.answer, deckId);
                return newCard.create();
            })
            await Promise.all(cards);

            await deleteDeck.delete_empty_cards();
        })
        res.sendStatus(200);
    } catch (error) {
        console.log(`Unable to update deck with name: ${deckname} to database. Error: ${error.message}`)
        res.status(500).json({result: "An error occurred while attempting to update the deck in the database. Please try again later."})
    }
}

async function deleteDeck(req, res) {
    const deckId = req.query.id;
    try {
        await runTransaction(async () => {
            await deleteAllassociatedSharedDecks(deckId);
            await deleteAllCardFromDeck(deckId);
            await Deck.deleteWithId(deckId);
        })
        res.sendStatus(200);
    } catch(error) {
        console.log(`Unable to delete deck with id: ${deckId}. Error: ${error.message}`)
        res.status(500).json({result: "An error occurred while attempting to remove that deck. Please try again later."})
    }
}

async function deleteAllassociatedSharedDecks(deckId) {
    const sharedDecks = await SharedDeck.getAllForDeckId(deckId);
    sharedDecks.forEach(async (sharedDeck) => {
        await SharedDeck.deleteWithId(sharedDeck.id)
    })
}

async function deleteAllCardFromDeck(deckId) {
    const card = new Card(null, null, deckId);
    return card.delete_cards();
}


router.get('/decks', authentication.requireLogin, getDecks)
router.get('/editDeck', authentication.requireLogin, getDeckData)

router.post('/addDeck', authentication.requireLogin, addDeck)
router.post('/editDeck', authentication.requireLogin, updateDeck)

router.delete('/deleteDeck', authentication.requireLogin, deleteDeck)

module.exports = router;
