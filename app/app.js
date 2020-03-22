const express = require('express')
const process = require('process');
const morgan = require('morgan')
const bodyParser = require('body-parser')
const path = require('path');

const app = express()
app.use(morgan('short'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

app.use('/api', require('./cards/routes'))
app.use('/api', require('./decks/routes'))
app.use('/api', require('./courses/routes'))
app.use('/api', require('./users/routes'))


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
