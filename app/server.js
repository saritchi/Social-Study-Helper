require('dotenv').config();
const Database = require('./database/database')
const database = Database(process.env);
database.connect();
database.initializeTablesIfNeeded();

const app = require('./app.js');
var port = 8080;
app.listen(port, () => {
    console.log("Server Running on Port " + port)
})