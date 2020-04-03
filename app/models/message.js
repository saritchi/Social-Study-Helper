const database = require('../database/database')(process.env);

/**
 * Course message that communicates with the database
 */
class Message {
    constructor(toUser, fromUser, message, id = '') {
        this.toUser = toUser;
        this.fromUser = fromUser;
        this.message = message; 
        this.id = id;
    }

    async create() {
        const addMessageSQL = `INSERT INTO Messages(fromUser, toUser, message) VALUES(?, ?, ?)`;
        return database.runQuery(addMessageSQL, [this.fromUser, this.toUser, this.message]);
    }
}

module.exports = Message;

module.exports.getAllBetweenUsers = async function getAllBetweenUsers(fromUsers, toUser) {
    const getMessagesSQL = `SELECT * FROM Messages WHERE (fromUser = ? AND toUser = ?) OR (fromUser = ? AND toUser = ?)`;
    const results = await database.runQuery(getMessagesSQL, [fromUsers, toUser, toUser, fromUsers]);
    return results.map((result) => new Message(result.toUser, result.fromUser, result.message, result.id))
}

module.exports.getMessagesAssociatedWithUser = async function getMessagesAssociatedWithUser(user) {
    const getMessagesSQL = `SELECT * FROM Messages WHERE fromUser = ?`
    const results = await database.runQuery(getMessagesSQL, user);
    return results.map((result) => new Message(result.toUser, result.fromUser, result.message, result.id))
}