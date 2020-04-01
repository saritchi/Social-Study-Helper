require('dotenv').config();
const Database = require('../../app/database/database');
const database = Database(process.env);


async function dropTables() {
    const dropTablesSQL = `
        SET FOREIGN_KEY_CHECKS = 0;
        drop table if exists user;
        drop table if exists Decks;
        drop table if exists Courses;
        drop table if exists Cards;
        drop table if exists SharedCourses;
        drop table if exists SharedDecks;
        SET FOREIGN_KEY_CHECKS = 1
    `
    
    try {
        await database.connect();
        await database.runQuery(dropTablesSQL, [])
        console.log("Database clean up successful");
    }
    catch (error) {
        console.log("Unable to clean up databases! Error: " + error.message);
    } finally {
        await database.close();
    }

}

dropTables();