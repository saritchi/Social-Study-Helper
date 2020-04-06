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

    async exists() {
        const query = `SELECT * FROM SharedDecks where fromUser = ? AND toUser = ? AND deckId = ? `;
        const result = await database.runQuery(query, [this.fromUser, this.toUser, this.deckId]);
        return result.length !== 0;
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
    var getSharedDecksSQL = `SELECT * FROM SharedDecks WHERE fromUser = ?`;

    const results = await database.runQuery(getSharedDecksSQL, email);
    return results.map((result) => {
        return new SharedDeck(result.toUser, result.fromUser, result.deckId, result.id);
    })
}

/**
 * Get all shared deck entries associated with a given deckId
 * @param {*} deckId a decks id
 * @returns An array of SharedDeck objects
 */
module.exports.getAllForDeckId = async function getAllForDeckId(deckId) {
    var getSharedDecksSQL = `SELECT * FROM SharedDecks WHERE deckId = ?`;

    const results = await database.runQuery(getSharedDecksSQL, deckId);
    return results.map((result) => {
        return new SharedDeck(result.toUser, result.fromUser, result.deckId, result.id);
    })
}

/**
 * Delete a SharedDeck with a given id
 * @param {*} id of the SharedDeck to delete
 */
module.exports.deleteWithId = async function deleteWithId(id) {
    var deleteSharedDecks = `DELETE FROM SharedDecks WHERE id = ?`;
    return database.runQuery(deleteSharedDecks, id);
}

/**
 * Delete a SharedDeck with a fromUser and toUser Email and a deckId
 * @param {*} fromUser a string that represents the user that shared the deck
 * @param {*} toEmail a string that represents the user had  the deck shared to
 * @param {*} id of the deckId
 */
module.exports.deleteWithEmailsAndId = async function deleteWithEmailsAndId(fromUser, toUser, id) {
    var deleteSharedDecks = `DELETE FROM SharedDecks WHERE fromUser = ? AND toUser = ? AND deckId = ?`;
    return database.runQuery(deleteSharedDecks, [fromUser, toUser, id]);
}


