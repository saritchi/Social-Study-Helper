const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const app = express()
app.use(morgan('short'))
app.use(express.static('./public'))
app.use(bodyParser.urlencoded({extended: false}))

var port = 3003

app.post('/create_deck', (req, res) =>{
    console.log("Creating New Deck...")
    var Term = {Term: req.body.term1, Definition: req.body.defn1}
    res.json(Term)
    res.end()
})


app.listen(port, () => {
    console.log("Server Running on Port " + port)
})
