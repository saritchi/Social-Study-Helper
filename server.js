require('dotenv').config();
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const Database = require('./database.js')
const fs = require('fs');

const app = express()
app.use(morgan('short'))
app.use(express.static('./public'))
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

const database = new Database(process.env);
database.initializeTablesIfNeeded();

var port = 3003

//TODO: endpoint will need a query paremeter for the number of courses.
app.get('/api/courses', (req, res) => {
    console.log("Getting courses....");
    const addCourseSQL = `SELECT * FROM Courses`;
    database.runQuery(addCourseSQL, [], (error, results, fields) => {
        if (error) {
            console.log(`Unable to get courses from the database. Error: ${error.message}`)
            res.status(500).json({result: "An error occured while attempting to get your courses. Please try again later."})
        } 

        var courses = [];
        results.forEach((course) => {
            console.log(course);
            courses.push(course);
        })
        res.status(200).json({result: courses});
    })
});

//TODO: temporary function - user information should be returned by authentication once that's set up
app.get('/api/user', (req, res) => {
    console.log("Returning user");
    res.json({result: "John Doe"});
});

app.post('/api/addCourse', (req, res) => {
    var body = req.body;
    var coursename = body.coursename;
    var chapters = body.chapters;

    //TODO: when chapters table is set up, insert chapters into that table with FK is the course PK.
    const addCourseSQL = `INSERT INTO Courses(name) VALUES(?)`;
    database.runQuery(addCourseSQL, [coursename], (error) => {
        if (error) {
            console.log(`Unable to add course with name: ${coursename} to database. Error: ${error.message}`)
            res.status(500).json({result: "An error occured while attempting to add the course to the database. Please try again later."})
        }

        console.log("Add course with name: " + coursename);
        res.sendStatus(200);
    })

});

app.post('/api/auth', (req, res) => {
    let sql = `SELECT * FROM user WHERE email = ? AND password = ?`;
    let query = database.runQuery(sql,[req.body.email,req.body.password], (err, results) => {
        if(err){
            console.log(err);
            res.status(500).json({result: "An error occured while attempting to authenticate. Please try again later."})
            return;
        };
        if(results.length > 0){
            results[0].auth ='true';
        }
        else{
            const result = {auth: 'false'};
            results.push(result);
        }
        
        res.send(results);
        return;
    });

});
app.post('/api/addDeck', (req, res) => {
    console.log("New Deck Added..."); 
    var body = req.body;
    var deckname = body.deckname;
    var cards = body.cards;


    const queryString = 'INSERT INTO Decks(name) VALUES(?)';
    database.runQuery(queryString, [deckname], (error, results, fields) => {
        if(error){
            console.log(`Unable to add card deck with name: ${deckname} to database. Error: ${error.message}`)
            res.status(500).json({result: "An error has occured while attempting to add the deck to the database. Please try again later."})
        }

        var deckId = results.insertId;
        numCards = Object.keys(cards).length;
        for(var i = 0; i < numCards; i++){
            cards[i] = [deckId, cards[i].prompt, cards[i].answer];
        }
        

        const cardQueryString = 'INSERT INTO cards(deck_id, prompt, answer) VALUES ?';
        database.runQuery(cardQueryString, [cards], (error) => {
            if(error){
                console.log(error.message)
                res.status(500).json({result: "An error has occured while attempting to add the deck to the database. Please try again later."});
            }
        })
         
        res.sendStatus(200);
        
    })
})

app.post('/api/editDeck', (req, res) => {
    console.log("Updating Deck..."); 
    var body = req.body;
    var deckname = body.deckname;
    var cards = body.cards;
    var deckId = body.deckId;
    var card_count = body.card_count;

    console.log(cards);
        const deleteQueryString = 'DELETE FROM cards WHERE deck_id = ?';
        database.runQuery(deleteQueryString, [cards[0].deck_id], (error) => {
            if(error){
                console.log(error.message)
                res.status(500).json({result: "An error has occured while attempting to delete the deck to the database. Please try again later."});
            }

            numCards = Object.keys(cards).length;
            for(var i = 0; i < numCards; i++){
                cards[i] = [deckId, cards[i].prompt, cards[i].answer];
            }
            
            const insertQueryString = 'INSERT INTO cards(deck_id, prompt, answer) VALUES ?';
            database.runQuery(insertQueryString, [cards], (error) => {
                if(error){
                    console.log(error.message)
                    res.status(500).json({result: "An error has occured while attempting to insert the new deck to the database. Please try again later."});
                }

                const deleteNullString = 'DELETE FROM cards WHERE prompt IS NULL OR answer IS NULL OR deck_id IS NULL'
                database.runQuery(deleteNullString, [cards], (error) => {
                    if(error){
                        console.log(error.message)
                        res.status(500).json({result: "An error has occured while attempting to insert the new deck to the database. Please try again later."});
                    } 
                })
                res.sendStatus(200);
                
            })
        })

})

app.get('/api/editDeck', (req, res) => {
    console.log("Fetching Deck Data..."); 
    const deck_id = req.query.deck
    const query_cards = 'SELECT * FROM cards WHERE deck_id = ?';
    console.log("Extracting Card List...");
    database.runQuery(query_cards, deck_id, (error, results_cards, fields) => {
        if(error){
            console.log(`Unable to get card deck with deck_id: ${deck_id} to database. Error: ${error.message}`)
            res.status(500).json({result: "An error has occured while attempting to find the deck in the database. Please try again later."})
        }

        var cards = [];
        results_cards.forEach((card) => {
            console.log(cards);
            cards.push(card);
        })
        
        var names = []
        console.log("Extracting Deck Name...");
        const query_deck_name = 'SELECT name FROM Decks WHERE id = ?';
        database.runQuery(query_deck_name, deck_id, (error, results_name, fields) => {
            if(error){
                console.log(`Unable to get deck name with deck_id: ${deck_id} to database. Error: ${error.message}`)
                res.status(500).json({result: "An error has occured while attempting to find the deck in the database. Please try again later."})
            }

            results_name.forEach((name) => {
                names.push(name)
                console.log(names)
            })
            res.status(200).json({result_cards: cards, result_names: names});
        })
        
  
    })


})

app.get('/api/viewCards', (req, res) => {
    console.log("Fetching Cards...");
    const deck_id = req.query.deck
    const getFlashData = 'SELECT * FROM cards WHERE deck_id = ?';
    database.runQuery(getFlashData, deck_id, (error, results, fields) => {
        if (error) {
            console.log(`Unable to get courses from the database. Error: ${error.message}`)
            res.status(500).json({result: "An error occured while attempting to get your courses. Please try again later."})
        } 
        var cards = [];
        results.forEach((card) => {
            console.log(cards);
            cards.push(card);
        })
        res.status(200).json({result: cards});
    })
});

app.listen(port, () => {
    console.log("Server Running on Port " + port)
})
