require('dotenv').config();
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const Database = require('./database.js')
const fs = require('fs');

const app = express()
app.use(morgan('short'))
app.use(express.static('./public'))
app.use(bodyParser.urlencoded({extended: false}))

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
    let lp = "Hello";

    // let queryString = "INSERT INTO cards (card_id, prompt, answer) VALUES(?,?,?)"
    // database.runQuery(queryString, [2, "This is a new card", "This is the new card's answer"], (err, rows, fields) => {
    //     if(err){
    //         console.log("Query Failed: " + err)
    //         res.sendStatus(500) //internal server error
    //         return
    //     }

    // })

    // database.runQuery("SELECT * FROM cards", (err, rows, fields) => {
    //     if(err){
    //         console.log("Query Failed: " + err)
    //         res.sendStatus(500) //internal server error
    //         return
    //     }else{
    //         console.log("Data Fetched")
    //         console.log(rows)
    //         console.log(rows[0].answer)

    //         res.json({result: "Prompt: "  + rows[0].prompt + " Answer: " + rows[0].answer})
    //     }

    // })
    console.log("Lorem Ipsum: " + lp);
    res.json({result: lp});
});




app.listen(port, () => {
    console.log("Server Running on Port " + port)
})
