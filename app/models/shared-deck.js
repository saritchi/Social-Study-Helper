const database = require('../database/database')(process.env);

/**
 * Shared Deck model that communicates with the database
 */
class SharedDeck {
    constructor(toUser, fromUser, deckId, id = '') {
        this.toUser = toUser;
        this.fromUser = fromUser;
        this.deckId = deckId;
 
        this.id = id;
    }

    async create() {
        const addCourseSQL = `INSERT INTO SharedDecks(toUser, fromUser, deckId) VALUES(?, ?, ?)`;
        return (await database.runQuery(addCourseSQL, [this.toUser, this.fromUser, this.deckId])).insertId;
    }
}

module.exports = SharedDeck;
/**
 * Get shared courses associated with a given user's email 
 * @param {*} email a user's email
 * @param {*} limit number of shared courses to get
 * @returns An array of Course objects
 */
module.exports.getForUser = async function getForUser(email, limit) {
    var getSharedDecksSQL = `SELECT * FROM SharedDecks WHERE toUser = ?`;
    if (limit) {
        getSharedDecksSQL += ' LIMIT ' + parseInt(limit);
    }

    const results = await database.runQuery(getSharedDecksSQL, email);
    return results.map((result) => {
        return new SharedDeck(result.toUser, result.fromUser, result.deckId, result.id);
    })
}

/**
 * Get all shared deck entries for a given user
 * @param {*} email a user's email
 * @returns An array of SharedDeck objects
 */
module.exports.getDecksForUser = async function getDecksForUser(email) {
    var getSharedCoursesSQL = `SELECT * FROM SharedDecks WHERE fromUser = ?`;

    const results = await database.runQuery(getSharedCoursesSQL, email);
    return results.map((result) => {
        return new SharedDeck(result.toUser, result.fromUser, result.deckId, result.id);
    })
}


/**
 * Delete a deck with a given id
 * @param {*} id of the course to delete
 */
module.exports.deleteWithId = async function deleteWithId(id) {
    var getSharedCoursesSQL = `DELETE FROM SharedDecks WHERE id = ?`;
    return database.runQuery(getSharedCoursesSQL, id);
}

