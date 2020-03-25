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
 * Get all courses associated with a given user's email 
 * @param {*} email a user's email
 * @returns An array of Course objects
 */
module.exports.getAllForUser = async function getAllForUser(email) {
    const addCourseSQL = `SELECT * FROM Courses WHERE userEmail = ?`;
    const results = await database.runQuery(addCourseSQL, email);
    return results.map((result) => {
        return new Course(result.name, result.midterm, result.final, result.userEmail, result.id, result.lastAccess);
    })
}

module.exports.getFromId = async function getDeckFromId(courseId) {
    const getDeckSQL = `SELECT * FROM Courses WHERE id = ?`;
    const results = await database.runQuery(getDeckSQL, courseId);
    const result = results[0]
    return new Course(result.name, result.midterm, result.final, result.userEmail, result.id, result.lastAccess);
}