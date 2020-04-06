const database = require('../database/database')(process.env);

/**
 * Course message that communicates with the database
 */
class Message {
    constructor(toUser, fromUser, message, timeSent, id = '') {
        this.toUser = toUser;
        this.fromUser = fromUser;
        this.message = message; 
        this.timeSent = timeSent;
        this.id = id;
    }

    async create() {
        const addMessageSQL = `INSERT INTO Messages(fromUser, toUser, message, timeSent) VALUES(?, ?, ?, ?)`;
        return database.runQuery(addMessageSQL, [this.fromUser, this.toUser, this.message, this.timeSent]);
    }
}

module.exports = Message;

module.exports.getAllBetweenUsers = async function getAllBetweenUsers(fromUsers, toUser) {
    const getMessagesSQL = `SELECT * FROM Messages WHERE (fromUser = ? AND toUser = ?) OR (fromUser = ? AND toUser = ?) ORDER BY timeSent ASC`;
    const results = await database.runQuery(getMessagesSQL, [fromUsers, toUser, toUser, fromUsers]);
    return results.map((result) => new Message(result.toUser, result.fromUser, result.message, result.id))
}

module.exports.getMessagesAssociatedWithUser = async function getMessagesAssociatedWithUser(user) {
    const getMessagesSQL = `SELECT * FROM Messages WHERE (fromUser = ? OR toUser = ?)`
    const results = await database.runQuery(getMessagesSQL, [user, user]);
    return results.map((result) => new Message(result.toUser, result.fromUser, result.message, result.id))
}