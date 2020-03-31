const database = require('../database/database')(process.env);

/**
 * Deck model that communicates with the database
 */
class Deck {
    constructor(name, midterm, final, courseId, id = '', lastAccess = '', lastStudy = '') {
        this.name = name;
        this.midterm = midterm;
        this.final = final;
        this.courseId = courseId;

        
        this.id = id;
        this.lastAccess = lastAccess;
        this.lastStudy = lastStudy;
    }

    async create() {
        const addDeckSQL = 'INSERT INTO Decks(name, midterm, final, courseId) VALUES(?, ?, ?, ?)'
        return (await database.runQuery(addDeckSQL, [this.name, this.midterm, this.final, this.courseId])).insertId;
    }

    async update_name() {
        const updateDeckSQL = 'UPDATE Decks SET name=? WHERE id=?';
        return (await database.runQuery(updateDeckSQL, [this.name, this.id]));
    }
}
//
module.exports = Deck;
/**
 * Get all decks associated with a given courseId
 * @param {*} courseId 
 * @returns An array of Course objects
 */
module.exports.getDecksFromCourseId = async function getDecksFromCourseId(courseId) {
    const getDeckSQL = `SELECT * FROM Decks WHERE courseId = ?`;
    const results = await database.runQuery(getDeckSQL, courseId);
    return results.map((result) => {
        return new Deck(result.name, result.midterm, result.final, result.courseId, result.id, result.lastAccess, result.lastStudy);
    })
}

module.exports.getNamefromDeckId = async function getNamefromDeckId(deckId) {
    const getDeckSQL = `SELECT * FROM Decks WHERE id = ?`;
    const results = await database.runQuery(getDeckSQL, deckId);
    return results.map((result) => {
        return new Deck(result.name, result.midterm, result.final, result.courseId, result.id, result.lastAccess, result.lastStudy);
    })
}