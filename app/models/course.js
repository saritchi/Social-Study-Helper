const database = require('../database')(process.env);

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
module.exports.getAllForUser = async function getAllForUser(email) {
    const addCourseSQL = `SELECT * FROM Courses WHERE userEmail = ?`;
    const results = await database.runQuery(addCourseSQL, email);
    return results.map((result) => {
        return new Course(result.name, result.midterm, result.final, result.userEmail, result.id, result.lastAccess);
    })
}