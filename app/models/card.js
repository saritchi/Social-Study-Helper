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
}

module.exports = Card;
/**
 * Get all cards associated with a given deckId
 * @argument deckId
 * @returns An array of Card objects
 */
module.exports.getAllFromDeckId = async function getAllFromDeckId(deckId) {
    const getFlashData = 'SELECT * FROM Cards WHERE deckId = ?';
    const results = await database.runQuery(getFlashData, deckId);

    return results.map((result) => {
        return new Card(result.prompt, result.answer, result.deckId, result.id, result.nextStudyTime);
    })
}
