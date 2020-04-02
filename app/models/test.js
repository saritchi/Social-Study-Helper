const database = require('../database/database')(process.env);

/**
 * Test model that communicates with the database
 */
class Test {
    constructor(name, courseId, decklist, testDate, userEmail, id = '') {
        this.name = name;
        this.courseId = courseId;
        this.decklist = decklist;
        this.testDate = testDate;
        this.userEmail = userEmail;
 
        this.id = id;
    }

    async create() {
        const addTestSQL = `INSERT INTO Tests(name, courseId, decklist, testDate, userEmail) VALUES(?, ?, ?, ?, ?)`;
        return (await database.runQuery(addTestSQL, [this.name, this.courseId, this.decklist, this.testDate, this.userEmail])).insertId;
    }
}

module.exports = Test;