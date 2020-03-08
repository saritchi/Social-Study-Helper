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
    let lp = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vel mollis ante. Suspendisse nulla lorem, tempus nec congue vel, aliquam.";
    console.log("Lorem Ipsum: " + lp);
    res.json({result: lp});
});

app.get('/api/courses', (req, res) => {

});

//TODO: temporary function - user information should be returned by authentication once that's set up
app.get('/api/user', (req, res) => {
    console.log("Returning user");
    res.json({result: "John Doe"});
});

app.post('/api/addCourse', (req, res) => {
    var body = req.body;
    var course = body.name;

    console.log("Add course with name: " + course);
});

app.listen(port, () => {
    console.log("Server Running on Port " + port)
})
