const database = require('../database')(process.env);

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
}

module.exports = Deck;
module.exports.getAllFromCourseId = async function getAllFromCourseId(courseId) {
    const getDeckSQL = `SELECT * FROM Decks WHERE courseId = ?`;
    const results = await database.runQuery(getDeckSQL, courseId);
    return results.map((result) => {
        return new Deck(result.name, result.midterm, result.final, result.courseId, result.id, result.lastAccess, result.lastStudy);
    })
}