require('dotenv').config();
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const Database = require('./database.js')
const session = require('client-sessions')

const app = express()
app.use(morgan('short'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

const database = new Database(process.env);
database.initializeTablesIfNeeded();

var port = 3003
const thirty_minutes = 30 * 60 * 1000;
const five_minutes = 5 * 60 * 1000;

app.use(session({
    cookieName: 'session',
    secret: process.env.SESSION_SECRET,
    duration: thirty_minutes,
    activeDuration: five_minutes,
}));

app.use(function(req, res, next) {
    //TODO: exclude auth and register
    const session = req.session;
    if(session && session.user) {
        database.getUserFromEmail(req.session.user.email, (error, results) => {
            if (error) {
                res.status(500).json({result: "An error has occured. Please try again later."});
                return;
            }
            const user = results[0];
            if(user) {
                req.user = user;
                delete req.user.password;
                req.session.user = user;
                res.locals.user = user;
            }
            next();
        });
    } else {
        next();
    }
});

function requireLogin(req, res, next) {
    if(!req.user) {
        console.log("Unauthenticated api access. Returning 401 status code");
        res.sendStatus(401);
        return;
    }

    next();
}

//TODO: endpoint will need a query paremeter for the number of courses.
app.get('/api/courses', requireLogin, (req, res) => {
    console.log("Getting courses....");
    const addCourseSQL = `SELECT * FROM Courses`;
    database.runQuery(addCourseSQL, [], (error, results, fields) => {
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

app.get('/api/decklist', requireLogin, (req, res) => {
    console.log("Getting decklist....");
    const getDeckSQL = `SELECT * FROM Decks`;
    database.runQuery(getDeckSQL, [], (error, results, fields) => {
        if (error) {
            console.log(`Unable to get decklist from the database. Error: ${error.message}`)
            res.status(500).json({result: "An error occured while attempting to get your decks. Please try again later."})
        } 

        var decklist = [];
        results.forEach((deck) => {
            console.log(deck);
            decklist.push(deck);
        })
        res.status(200).json({result: decklist});
    })
});

//TODO: temporary function - user information should be returned by authentication once that's set up
app.get('/api/user', requireLogin, (req, res) => {
    console.log("Returning user");
    res.json({result: "John Doe"});
});

app.post('/api/addCourse', requireLogin, (req, res) => {
    var body = req.body;
    var coursename = body.coursename;
    var chapters = body.chapters;

    const chapterKeys = Object.keys(chapters);
    var emptyChapters = false;
    for(var i = 0; i < chapterKeys.length; i++) {
        const key = chapterKeys[i];
        if(!chapters[key]) {
            emptyChapters = true;
        }
    }

    if(!coursename || emptyChapters) {
        res.status(400).json({result: "Error processing request."})
        return;
    }

    //TODO: when chapters table is set up, insert chapters into that table with FK is the course PK.
    const addCourseSQL = `INSERT INTO Courses(name) VALUES(?)`;
    database.runQuery(addCourseSQL, [coursename], (error) => {
        if (error) {
            console.log(`Unable to add course with name: ${coursename} to database. Error: ${error.message}`)
            res.status(500).json({result: "An error occurred while attempting to add the course to the database. Please try again later."})
            return;
        }

        console.log("Add course with name: " + coursename);
        res.sendStatus(200);
    })
    return;
});

//TODO: error check client request
app.post('/api/auth', (req, res) => {
    let sql = `SELECT * FROM user WHERE email = ? AND password = ?`;
    database.runQuery(sql,[req.body.email,req.body.password], (err, results) => {
        const user = results[0];
        if(err){
            console.log(err);
            res.status(500).json({result: "An error occured while attempting to authenticate. Please try again later."})
            return;
        };
        if(results.length > 0){
            results[0].auth ='true';
            delete user.password;
            req.session.user = user;
        }
        else{
            const result = {auth: 'false'};
            results.push(result);
        }
        
        res.send(results);
        return;
    });
    
});

//TODO: error check client request
app.post('/api/addDeck', requireLogin, (req, res) => {
    console.log("New Deck Added..."); 
    var body = req.body;
    var deckname = body.deckname;
    var cards = body.cards;

    const queryString = 'INSERT INTO Decks(name) VALUES(?)';
    database.runQuery(queryString, [deckname], (error, results, fields) => {
        if(error){
            console.log(`Unable to add card deck with name: ${deckname} to database. Error: ${error.message}`)
            res.status(500).json({result: "An error has occured while attempting to add the deck to the database. Please try again later."})
            return;
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
                return;
            }
        })
         
        res.sendStatus(200);
    })
})

app.get('/api/viewCards', requireLogin, (req, res) => {
    console.log("Fetching Cards...");
    const deck_id = req.query.deck
    const getFlashData = 'SELECT * FROM cards WHERE deck_id = ?';
    database.runQuery(getFlashData, deck_id, (error, results, fields) => {
        if (error) {
            console.log(`Unable to get cards from the database. Error: ${error.message}`)
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

//TODO: error check client request
app.post('/api/register', (req, res) => {
    let post = req.body;
    database.getUserFromEmail(post.email, (err, result) => {
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
    })
});

app.listen(port, () => {
    console.log("Server Running on Port " + port)
})
