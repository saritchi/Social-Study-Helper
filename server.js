const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const fs = require('fs');

const app = express()
app.use(morgan('short'))
app.use(express.static('./public'))
app.use(bodyParser.urlencoded({extended: false}))



var port = 3003

app.post('/create_deck', (req, res) =>{
    console.log("Creating New Deck...")
    let data = JSON.stringify(req.body)
    fs.writeFileSync('deck.json', data)
    res.end()
})


app.post('/api/auth', (req, res) => {
    console.log("Got login request");
});


app.listen(port, () => {
    console.log("Server Running on Port " + port)
})
