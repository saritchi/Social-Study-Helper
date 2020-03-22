const express = require('express')
const process = require('process');
const morgan = require('morgan')
const bodyParser = require('body-parser')
const path = require('path');

const app = express()
app.use(morgan('short'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

app.use('/api', require('./controllers/cards'))
app.use('/api', require('./controllers/decks'))
app.use('/api', require('./controllers/courses'))
app.use('/api', require('./controllers/users'))


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

module.exports = app;
