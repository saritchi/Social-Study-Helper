const database = require('../database/database')(process.env);
/**
 * Runs a set of queries specified in the callback in a transactional manner
 * @param {*} transaction The callback that contains the queries to run
 */
module.exports = async function runTransaction(transaction) {
    try {
        console.log("Starting transaction");
        await database.beginTransaction();
        await transaction();
        await database.commit();
        console.log("Finished transaction");
    } catch {
        Console.log("Rolling back transaction")
        await database.rollback();
        throw error;
    }
}
