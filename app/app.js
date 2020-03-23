const express = require('express')
const process = require('process');
const morgan = require('morgan')
const bodyParser = require('body-parser')
const path = require('path');
const session = require('client-sessions')

const app = express()
app.use(morgan('short'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

const thirty_minutes = 30 * 60 * 1000;
const five_minutes = 5 * 60 * 1000;

//The authentication and session function is based on code from this tutorial
//https://stormpath.com/blog/everything-you-ever-wanted-to-know-about-node-dot-js-sessions
app.use(session({
    cookieName: 'session',
    secret: process.env.SESSION_SECRET,
    duration: thirty_minutes,
    activeDuration: five_minutes,
}));


app.use(require('./middleware/session'));
app.use('/api', require('./controllers/cards'))
app.use('/api', require('./controllers/decks'))
app.use('/api', require('./controllers/courses'))
app.use('/api', require('./controllers/users'))

//TODO: error handle pages/404 pages
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
