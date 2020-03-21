require('dotenv').config();
const Database = require('../../database.js');
const database = new Database(process.env);

const dropTablesSQL = `
    SET FOREIGN_KEY_CHECKS = 0;
    drop table if exists user;
    drop table if exists Decks;
    drop table if exists Courses;
    drop table if exists cards;
    SET FOREIGN_KEY_CHECKS = 1
`
database.runQuery(dropTablesSQL, [], (error) => {
    if (error) {
        console.log("Unable to clean up databases! Error: " + error.message);
    } else {
        console.log("Database clean up successful");
    }

    console.log("Closing database connection")
    database.close();
});