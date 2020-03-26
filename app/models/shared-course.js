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
        await database.runQuery(addCourseSQL, [this.toUser, this.fromUser, this.courseId]);
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