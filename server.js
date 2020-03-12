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

//TODO: endpoint will need a query paremeter for the number of courses.
app.get('/api/courses', (req, res) => {
    console.log("Getting courses....");
    const addCourseSQL = `SELECT * FROM Courses`;
    database.runQuery(addCourseSQL, [], (error, results, fields) => {
        if (error) {
            console.log(`Unable to get courses from the database. Error: ${error.message}`)
            res.status(500).json({result: "An error occurred while attempting to get your courses. Please try again later."})
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
            res.status(500).json({result: "An error occurred while attempting to add the course to the database. Please try again later."})
        }

        console.log("Add course with name: " + coursename);
        res.sendStatus(200);
    })

});

app.listen(port, () => {
    console.log("Server Running on Port " + port)
})
