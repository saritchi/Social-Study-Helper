const database = require('../database')(process.env);

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
module.exports.getAllFromDeckId = async function getAllFromDeckId(deckId) {
    const getFlashData = 'SELECT * FROM Cards WHERE deckId = ?';
    const results = await database.runQuery(getFlashData, deckId);

    return results.map((result) => {
        return new Card(result.prompt, result.answer, result.deckId, result.id, result.nextStudyTime);
    })
}
