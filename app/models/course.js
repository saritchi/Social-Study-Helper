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
        const addCourseSQL = `INSERT INTO Courses(name, midterm, final, userEmail, lastAccess) VALUES(?, ?, ?, ?, ?)`;
        return (await database.runQuery(addCourseSQL, [this.name, this.midterm, this.final, this.userEmail, this.lastAccess])).insertId;
    }

    async update() {
        const updateCourseSQL = 'UPDATE Courses SET ? WHERE id = ?'
        return database.runQuery(updateCourseSQL, [this, this.id]);
    }

    async update() {
        const updateCourseSQL = `UPDATE Courses SET name = ?, midterm = ?, final = ?, userEmail = ? WHERE id = ?`;
        return database.runQuery(updateCourseSQL, [this.name, this.midterm, this.final, this.userEmail, this.id])
    }
}

module.exports = Course;
/**
 * Get courses associated with a given user's email 
 * @param {*} email a user's email
 * @param {*} limit number of courses to retrieve
 * @param {*} sortBy the value to sort the colums by
 * @returns An array of Course objects
 */
module.exports.getCoursesFourUser = async function getCoursesFourUser(email, limit = null, orderBy = null) {
    var addCourseSQL = `SELECT * FROM Courses WHERE userEmail = ?`;
    
    if (orderBy) {
        addCourseSQL += ' ORDER BY ' + orderBy + ' DESC';
    }

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