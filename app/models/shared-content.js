const database = require('../database/database')(process.env);

/**
 * Course model that communicates with the database
 */
class SharedContent {
    constructor(toUser, fromUser, courseId, deckId, id = '') {
        if ((deckId && courseId) || (!deckId && !courseId)) {
            throw new Error("Illegal argument. DeckId and CourseId cannot both be null!")
        }

        this.toUser = toUser;
        this.fromUser = fromUser;
        this.deckId = deckId;
        this.courseId = courseId;
 
        this.id = id;
    }

    async create() {
        const addCourseSQL = `INSERT INTO SharedContent(toUser, fromUser, courseId, deckId) VALUES(?, ?, ?, ?)`;
        await database.runQuery(addCourseSQL, [this.toUser, this.fromUser, this.courseId, this.deckId]);
    }
}

module.exports = SharedContent;
/**
 * Get all courses associated with a given user's email 
 * @param {*} email a user's email
 * @returns An array of Course objects
 */
module.exports.getAllForUser = async function getAllForUser(email) {
    const addCourseSQL = `SELECT * FROM SharedContent WHERE toUser = ?`;
    const results = await database.runQuery(addCourseSQL, email);
    return results.map((result) => {
        return new SharedContent(result.toUser, result.fromUser, result.courseId, result.deckId);
    })
}