require('dotenv').config();
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const Database = require('./database.js')

const app = express()
app.use(morgan('short'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

const database = new Database(process.env);
database.initializeTablesIfNeeded();

var port = 3003

//TODO: endpoint will need a query paremeter for the number of courses.
app.get('/api/courses', (req, res) => {
    console.log("Getting courses....");
    var userEmail = req.body.email;
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

app.get('/api/chapters', (req, res) => {
    console.log("Getting chapters....");
    const getDeckSQL = `SELECT * FROM Chapters WHERE courseId = ?`;
    database.runQuery(getDeckSQL, [req.query.courseId], (error, results) => {
        if (error) {
            console.log(`Unable to get chapters from the database. Error: ${error.message}`)
            res.status(500).json({result: "An error occured while attempting to get your chapters. Please try again later."})
        } 

        var chapters = [];
        results.forEach((chapter) => {
            console.log(chapter);
            chapters.push(chapter);
        })
        res.status(200).json({result: chapters});
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
    var userEmail = body.email;


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
        var chaptersLength = Object.keys(chapters).length;
        for(var i = 0; i < chaptersLength; i++){
            //TODO: replace midterm final values when UI is updated.
            chapters[i] = [chapters[i], midterm, final, courseId];
        }
        

        const chapterSQL = 'INSERT INTO Chapters(name, midterm, final, courseId) VALUES ?';
        database.runQuery(chapterSQL, [chapters], (error) => {
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
app.post('/api/addChapter', (req, res) => {
    console.log("New Chapter Added..."); 
    var body = req.body;
    var chaptername = body.chaptername;
    var cards = body.cards;
    var courseId = req.query.courseId;

    //TODO: update midterm and final values when UI is updated
    const midterm = false;
    const final = false;        
    const addChapterSql = 'INSERT INTO Chapters(name, midterm, final, courseId) VALUES(?, ?, ?, ?)'

    database.runQuery(addChapterSql, [chaptername, midterm, final, courseId],  (error, results) => {
        if(error){
            console.log(`Unable to add card deck with name: ${chaptername} to database. Error: ${error.message}`)
            res.status(500).json({result: "An error has occured while attempting to add the deck to the database. Please try again later."})
            return;
        }

        var chapterId = results.insertId;
        numCards = Object.keys(cards).length;
        for(var i = 0; i < numCards; i++){
            cards[i] = [chapterId, cards[i].prompt, cards[i].answer];
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

app.get('/api/viewCards', (req, res) => {
    console.log("Fetching Cards...");
    const chapterId = req.query.chapterId
    const getFlashData = 'SELECT * FROM cards WHERE chapterId = ?';
    database.runQuery(getFlashData, chapterId, (error, results) => {
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

app.listen(port, () => {
    console.log("Server Running on Port " + port)
})
