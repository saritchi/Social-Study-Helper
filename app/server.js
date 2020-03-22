require('dotenv').config();
const Database = require('./database.js')
const database = new Database(process.env);
database.connect();
database.initializeTablesIfNeeded();

const app = require('./app.js')(database);
var port = 8080;
app.listen(port, () => {
    console.log("Server Running on Port " + port)
})