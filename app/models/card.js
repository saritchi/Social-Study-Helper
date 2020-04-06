const database = require('../database/database')(process.env);

/**
 * Card model that communicates with the database
 */
class Card {
    constructor(prompt, answer, deckId, id = '', nextStudyTime = null) {
        this.prompt = prompt;
        this.answer = answer;
        this.deckId = deckId;

        this.id = id;
        this.nextStudyTime = nextStudyTime;
    }
 
    async create() {
        const cardQueryString = 'INSERT INTO Cards(prompt, answer, deckId) VALUES (?, ?, ?)';
        await database.runQuery(cardQueryString, [this.prompt, this.answer, this.deckId]);
    }
    async insert_cards() {
        const cardQueryString = 'INSERT INTO Cards(prompt, answer, deckId) VALUES (?, ?, ?)';
        await database.runQuery(cardQueryString, [this.prompt, this.answer, this.deckId]);
    }

    async delete_cards () {
        const deleteQueryString = 'DELETE FROM Cards WHERE deckId = ?';
        await database.runQuery(deleteQueryString, [this.deckId]);
    }

    async reset_increment () {
        const resetIncrementString = 'ALTER TABLE Cards AUTO_INCREMENT = 0'
        await database.runQuery(resetIncrementString);
    }

    async delete_empty_cards () {
        const deleteNullString = 'DELETE FROM Cards WHERE prompt IS NULL AND answer IS NULL OR deckId IS NULL'
        await database.runQuery(deleteNullString)
    }

    async update_difficulty () {
        const updateNextStudy = 'UPDATE Cards SET nextStudyTime = ? WHERE id = ? AND deckId = ?'
        await database.runQuery(updateNextStudy, [this.nextStudyTime, this.id, this.deckId])
    }
}

module.exports = Card;
/**
 * Get all cards associated with a given deckId
 * @param {*} deckId
 * @returns An array of Card objects
 */
module.exports.getAllFromDeckId = async function getAllFromDeckId(deckId) {
    const getFlashData = 'SELECT * FROM Cards WHERE deckId = ?';
    const results = await database.runQuery(getFlashData, deckId);

    return results.map((result) => {
        return new Card(result.prompt, result.answer, result.deckId, result.id, result.nextStudyTime);
    })
}