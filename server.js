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
app.use(express.json());

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

app.post('/api/auth', (req, res) => {
    console.log(req.body);
    let sql = `SELECT * FROM user WHERE username = '${req.body.username}' AND password = '${req.body.password}'`;
    console.log(sql);
    let query = database.runQuery(sql, (err, results) => {
        if(err) throw err;
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

app.listen(port, () => {
    console.log("Server Running on Port " + port)
})
