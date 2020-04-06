const database = require('../database/database')(process.env);

/**
 * Event model that communicates with the database
 */
class Event {
    constructor(userEmail, title, description, startDate, endDate, id = '') {
        this.userEmail = userEmail;
        this.title = title;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.id = id;
    }
 
    async create() {
        const eventQueryString = 'INSERT INTO Events(userEmail, title, description, startDate, endDate) VALUES (?, ?, ?, ?, ?)';
        return (await database.runQuery(eventQueryString, [this.userEmail, this.title, this.description, this.startDate, this.endDate])).insertId;
    }

}

module.exports = Event;
/**
 * Get all Events associated with a given user email
 * @param {*} userEmail
 * @returns An array of Event objects
 */
module.exports.getAllFromUserEmail = async function getAllFromUserEmail(userEmail) {
    const getEventData = 'SELECT * FROM Events WHERE userEmail = ?';
    const results = await database.runQuery(getEventData, userEmail);

    return results.map((result) => {
        return new Event(result.userEmail, result.title, result.description, result.startDate, result.endDate, result.id);
    })
}

module.exports.deleteEvent = async function deleteEvent(id){
    const eventQueryString = `DELETE FROM Events WHERE id = ?`;
    await database.runQuery(eventQueryString, id);
}