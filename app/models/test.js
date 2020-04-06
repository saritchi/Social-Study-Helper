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
/**
 * Get all tests associated with a user
 * @param {*} userEmail 
 * @returns An array of Test objects
 */
module.exports.getTestsByUser = async function getTestsByUser(userEmail) {
    const getTestSQL = `SELECT * FROM Tests WHERE userEmail = ? ORDER BY testDate ASC`;
    const results = await database.runQuery(getTestSQL, userEmail);
    return results.map((result) => {
        return new Test(result.name, result.courseId, result.decklist, result.testDate, result.userEmail, result.id);
    })
}

module.exports.deleteWithId = async function deleteWithId(testId) {
    console.log(`Deleting test with id: ${testId}`);
    const deleteTestQuery = `DELETE FROM Tests WHERE id = ?`;
    return database.runQuery(deleteTestQuery, testId);
}