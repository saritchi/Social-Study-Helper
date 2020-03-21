require('dotenv').config();
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const Database = require('./database.js')
const fs = require('fs');
const path = require('path');

const app = express()
app.use(morgan('short'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

const database = new Database(process.env);
database.initializeTablesIfNeeded();

var port = 8080;


//TODO: endpoint will need a query paremeter for the number of courses.
app.get('/api/courses', (req, res) => {
    console.log("Getting courses....");
    var userEmail = req.query.email;
    const addCourseSQL = `SELECT * FROM Courses WHERE userEmail = ?`;
    database.runQuery(addCourseSQL, [userEmail], (error, results) => {
        if (error) {
            console.log(`Unable to get courses from the database. Error: ${error.message}`)
            res.status(500).json({result: "An error occurred while attempting to get your courses. Please try again later."})
            return;
        } 
        
        var courses = [];
        results.forEach((course) => {
            console.log(course);
            courses.push(course);
        })
        res.status(200).json({result: courses});
    })
});

app.get('/api/decks', (req, res) => {
    console.log("Getting decks....");
    const getDeckSQL = `SELECT * FROM Decks WHERE courseId = ?`;
    database.runQuery(getDeckSQL, [req.query.id], (error, results) => {
        if (error) {
            console.log(`Unable to get decks from the database. Error: ${error.message}`)
            res.status(500).json({result: "An error occured while attempting to get your chapters. Please try again later."})
        } 
        
        var decklist = [];
        results.forEach((deck) => {
            console.log(deck);
            decklist.push(deck);
        })
        res.status(200).json({result: decklist});
    })
});

app.post('/api/addCourse', (req, res) => {
    var body = req.body;
    var coursename = body.coursename;
    var decks = body.decks;
    var userEmail = body.email;


    const deckKeys = Object.keys(decks);
    var emptyDecks = false;
    for(var i = 0; i < deckKeys.length; i++) {
        const key = deckKeys[i];
        if(!decks[key]) {
            emptyDecks = true;
        }
    }

    if(!coursename || emptyDecks) {
        res.status(400).json({result: "Error processing request."})
        return;
    }

    //TODO: when chapters table is set up, insert chapters into that table with FK is the course PK.
    //TODO: when UI for addCourse is updated use the final and midterm values.
    var final = false;
    var midterm = false;
    const addCourseSQL = `INSERT INTO Courses(name, midterm, final, userEmail) VALUES(?, ?, ?, ?)`;
    database.runQuery(addCourseSQL, [coursename, midterm, final, userEmail], (error, results) => {
        if (error) {
            console.log(`Unable to add course with name: ${coursename} to database. Error: ${error.message}`)
            res.status(500).json({result: "An error occurred while attempting to add the course to the database. Please try again later."})
            return;
        }

        var courseId = results.insertId;
        var decksLength = Object.keys(decks).length;
        for(var i = 0; i < decksLength; i++){
            //TODO: replace midterm final values when UI is updated.
            decks[i] = [decks[i], midterm, final, courseId];
        }
        

        const decksSQL = 'INSERT INTO Decks(name, midterm, final, courseId) VALUES ?';
        database.runQuery(decksSQL, [decks], (error) => {
            if(error){
                console.log(error.message)
                res.status(500).json({result: "An error has occured while attempting to add the deck to the database. Please try again later."});
                return;
            }
            console.log("Add course with name: " + coursename);
            res.sendStatus(200);
        })
    })
});

//TODO: error check client request
app.post('/api/auth', (req, res) => {
    let sql = `SELECT * FROM user WHERE email = ? AND password = ?`;
    database.runQuery(sql,[req.body.email,req.body.password], (err, results) => {
        if(err){
            console.log(err);
            res.status(500).json({result: "An error occured while attempting to authenticate. Please try again later."})
            return;
        };
        if(results.length > 0){
            results[0].isAuthenticated = true;
            results[0].password = '';
        }
        else{
            const result = {isAuthenticated: 'false'};
            results.push(result);
        }
        
        res.send(results);
        return;
    });
    
});

//TODO: error check client request
app.post('/api/addDeck', (req, res) => {
    console.log("New Deck Added..."); 
    var body = req.body;
    var deckname = body.deckname;
    var cards = body.cards;
    var courseId = req.query.id;

    //TODO: update midterm and final values when UI is updated
    const midterm = false;
    const final = false;        
    const addDeckSQL = 'INSERT INTO Decks(name, midterm, final, courseId) VALUES(?, ?, ?, ?)'

    database.runQuery(addDeckSQL, [deckname, midterm, final, courseId],  (error, results) => {
        if(error){
            console.log(`Unable to add card deck with name: ${deckname} to database. Error: ${error.message}`)
            res.status(500).json({result: "An error has occured while attempting to add the deck to the database. Please try again later."})
            return;
        }
        
        var deckId = results.insertId;
        numCards = Object.keys(cards).length;
        for(var i = 0; i < numCards; i++){
            cards[i] = [cards[i].prompt, cards[i].answer, deckId];
        }
        

        const cardQueryString = 'INSERT INTO Cards(prompt, answer, deckId) VALUES ?';
        database.runQuery(cardQueryString, [cards], (error) => {
            if(error){
                console.log(error.message)
                res.status(500).json({result: "An error has occured while attempting to add the deck to the database. Please try again later."});
                return;
            }
            res.sendStatus(200);
        })
    })
})

app.get('/api/viewCards', (req, res) => {
    console.log("Fetching Cards...");
    const deckId = req.query.id
    const getFlashData = 'SELECT * FROM Cards WHERE deckId = ?';
    database.runQuery(getFlashData, deckId, (error, results) => {
        if (error) {
            console.log(`Unable to get cards from the database. Error: ${error.message}`)
            res.status(500).json({result: "An error occured while attempting to get your courses. Please try again later."})
            return;
        } 
        var cards = [];
        results.forEach((card) => {
            console.log(cards);
            cards.push(card);
        })
        res.status(200).json({result: cards});
    })
});

//TODO: error check client request
app.post('/api/register', (req, res) => {
    let post = req.body;
    let sql = `Select * from user where email = '${post.email}'`;
    let query = database.runQuery(sql, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).json({result: "An error occured while attempting to register. Please try again later."});
            return;
        }
        if(result.length > 0){ 
            res.status('409').json({result: "An error occured while attempting to register since Username already Exists."});
        }
        else{
            sql = 'INSERT INTO user SET ?';
            query = database.runQuery(sql, post, (err, result) => {
                if(err){
                    console.log(err);
                    res.status(500).json({result: "An error occured while attempting to register. Please try again later."});
                    return;
                }
                res.status(200).json({result: "Registration succesful."});;
            });
        }
    });
    
});

/***
 * END of API end points. Do not put API endpoint routes below this 
 */

 
//In production we will be servering our javascript and html files from a optimized build folder in client. This sets up the endpoint and exposes
//the build folder to the browser
if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/client/build')));

    app.get('/*', function(req, res) {
        res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
    });
}

app.listen(port, () => {
    console.log("Server Running on Port " + port)
})
