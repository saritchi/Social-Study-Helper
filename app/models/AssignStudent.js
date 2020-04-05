const database = require('../database/database')(process.env);
/**
 * AssignStudents model that communicates with the database
 */
class AssignStudent {
    constructor(teacherEmail, studentEmail, id = null) {
        this.teacherEmail= teacherEmail;
        this.studentEmail= studentEmail;
        this.id = id;
    }

    async create(){
        const query = 'INSERT INTO AssignStudent(teacherEmail, studentEmail) VALUES(?, ?) ';
        await database.runQuery(query, {teacher: this.teacherEmail,student: this.studentEmail});
    }
}

module.exports = AssignStudent;
