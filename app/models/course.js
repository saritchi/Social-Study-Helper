const database = require('../database/database')(process.env);

/**
 * Course model that communicates with the database
 */
class Course {
    constructor(name, midterm, final, userEmail, id = '', lastAccess = null) {
        this.name = name;
        this.midterm = midterm;
        this.final = final;
        this.userEmail = userEmail;
 
        this.id = id;
        this.lastAccess = lastAccess;
    }

    async create() {
        const addCourseSQL = `INSERT INTO Courses(name, midterm, final, userEmail) VALUES(?, ?, ?, ?)`;
        return (await database.runQuery(addCourseSQL, [this.name, this.midterm, this.final, this.userEmail])).insertId;
    }
}

module.exports = Course;
/**
 * Get courses associated with a given user's email 
 * @param {*} email a user's email
 * @param {*} limit number of courses to retrieve
 * @returns An array of Course objects
 */
module.exports.getCoursesFourUser = async function getCoursesFourUser(email, limit = null) {
    var addCourseSQL = `SELECT * FROM Courses WHERE userEmail = ?`;
    if (limit) {
        addCourseSQL += ' LIMIT ' + parseInt(limit)
    }

    const results = await database.runQuery(addCourseSQL, email);
    return results.map((result) => {
        return new Course(result.name, result.midterm, result.final, result.userEmail, result.id, result.lastAccess);
    })
}

/**
 * Get courses associated with a given courseId
 * @param {*} courseId a course's id
 * @returns A course object
 */
module.exports.getFromId = async function getDeckFromId(courseId) {
    const getCourseSQL = `SELECT * FROM Courses WHERE id = ?`;
    const results = await database.runQuery(getCourseSQL, courseId);
    const result = results[0]
    return new Course(result.name, result.midterm, result.final, result.userEmail, result.id, result.lastAccess);
}


/**
 * Delete a course associated with a given courseId
 * @param {*} courseId a course's id
 */
module.exports.deleteWithId = async function deleteWithId(courseId) {
    const deleteCourseQuery = `DELETE FROM Courses WHERE id = ?`;
    //TODO: check affectedRows === 1 if not throw error and rollback;
    return database.runQuery(deleteCourseQuery, courseId);
}