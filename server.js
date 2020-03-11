require('dotenv').config();
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const Database = require('./database.js')
const fs = require('fs');

const app = express()
app.use(morgan('short'))
app.use(express.static('./public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

const database = new Database(process.env);
database.initializeTablesIfNeeded();

var port = 3003

app.get('/api/serverTime', (req, res) => {
    const serverTime = "The current time on the server is: " + Date.now();
    console.log(serverTime);
    res.json({result: serverTime});
});

app.get('/api/serverData', (req, res) => {
    let r = Math.random().toString(36).substring(7);
    console.log("random string: " + r);
    res.json({result: r});
});

app.get('/api/cardData', (req, res) => {
    let lp = "Hello";
    console.log("Lorem Ipsum: " + lp);
    res.json({result: lp});
});

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

app.post('/api/addDeck', (req, res) => {
    console.log("New Deck Added..."); 
    var body = req.body;
    var deckname = body.deckname;
    var prompts = body.prompts;
    var answers = body.answers;
    var cards = [];

    numCards = Object.keys(prompts).length;

    const queryString = 'INSERT INTO Decks(name) VALUES(?)';
    database.runQuery(queryString, [deckname], (error, results, fields) => {
        if(error){
            console.log(`Unable to add card deck with name: ${deckname} to database. Error: ${error.message}`)
            res.status(500).json({result: "An error has occured while attempting to add the deck to the database. Please try again later."})
        }
        var deckId = results.insertId;
        for(var i = 0; i < numCards; i++){
            cards.push([deckId, prompts["prompt"+i], answers["answer"+i]])
        }
        
        const cardQueryString = 'INSERT INTO Cards(deck_id, prompt, answer) VALUES ?';
        database.runQuery(cardQueryString, [cards], (error) => {
            if(error){
                console.log(error.message)
                res.status(500).json({result: "An error has occured while attempting to add the deck to the database. Please try again later."});
            }
        })
        
        res.sendStatus(200);
        
    })
})

app.listen(port, () => {
    console.log("Server Running on Port " + port)
})
