const database = require('../database/database')(process.env);

/**
 * Shared Course model that communicates with the database
 */
class SharedCourse {
    constructor(toUser, fromUser, courseId, id = '') {
        this.toUser = toUser;
        this.fromUser = fromUser;
        this.courseId = courseId;
 
        this.id = id;
    }

    async create() {
        const addCourseSQL = `INSERT INTO SharedCourses(toUser, fromUser, courseId) VALUES(?, ?, ?)`;
        return (await database.runQuery(addCourseSQL, [this.toUser, this.fromUser, this.courseId])).insertId;
    }
}

module.exports = SharedCourse;
/**
 * Get all courses associated with a given user's email 
 * @param {*} email a user's email
 * @param {*} limit number of courses to retrieve
 * @returns An array of Course objects
 */
module.exports.getForUser = async function getForUser(email, limit) {
    var getSharedCoursesSQL = `SELECT * FROM SharedCourses WHERE toUser = ?`;
    if (limit) {
        getSharedCoursesSQL += ' LIMIT ' + parseInt(limit);
    }

    const results = await database.runQuery(getSharedCoursesSQL, email);
    return results.map((result) => {
        return new SharedCourse(result.toUser, result.fromUser, result.courseId, result.id);
    })
}

/**
 * Get all shared courses entries for a given user
 * @param {*} email a user's email
 * @returns An array of SharedCourse objects
 */
module.exports.getCoursesForUser = async function getCoursesForUser(email) {
    var getSharedCoursesSQL = `SELECT * FROM SharedCourses WHERE fromUser = ?`;

    const results = await database.runQuery(getSharedCoursesSQL, email);
    return results.map((result) => {
        return new SharedCourse(result.toUser, result.fromUser, result.courseId, result.id);
    })
}

/**
 * Get all shared courses entries associated with a given courseId
 * @param {*} courseId a course id
 * @returns An array of SharedCourse objects
 */
module.exports.getAllForCourseId = async function getAllForCourseId(courseId) {
    var getSharedCoursesSQL = `SELECT * FROM SharedCourses WHERE courseId = ?`;

    const results = await database.runQuery(getSharedCoursesSQL, courseId);
    return results.map((result) => {
        return new SharedCourse(result.toUser, result.fromUser, result.deckId, result.id);
    })
}


/**
 * Get a given SharedCourse Object from an id
 * @param {*} id the id of a SharedCourse entry
 * @returns A SharedCourse Object
 */
module.exports.getSharedCourseFromId = async function getSharedCourseFromId(id) {
    var getSharedCoursesSQL = `SELECT * FROM SharedCourses WHERE id = ?`;

    const results = await database.runQuery(getSharedCoursesSQL, id);
    const result = results[0];
    return new SharedCourse(result.toUser, result.fromUser, result.courseId, result.id);
}

/**
 * Delete a course with a given id
 * @param {*} id of the course to delete
 */
module.exports.deleteWithId = async function deleteWithId(id) {
    var getSharedCoursesSQL = `DELETE FROM SharedCourses WHERE id = ?`;
    return database.runQuery(getSharedCoursesSQL, id);
}

