const database = require('../database/database')(process.env);
/**
 * AssignStudents model that communicates with the database
 */
class AssignStudents {
    constructor(teacherEmail,studentEmail) {
        this.teacherEmail= teacherEmail;
        this.studentEmail= studentEmail;
    }

    async assignStudent(){
        const query = 'INSERT INTO assignStudent SET ?';
        await database.runQuery(query, {teacher: this.teacherEmail,student: this.studentEmail});
    }
    async exist(){
        const query = `Select * from assignStudent where teacher = ? and student= ? `;
        const result = await database.runQuery(query, [this.teacherEmail,this.studentEmail]);
        if(result.length == 0){ 
            return false;
        }
        
        return true;
    }
    async getTeacher(){
        const query = 'SELECT * FROM user WHERE email = ?';
        const result = await database.runQuery(query, [this.teacherEmail]);
        return JSON.parse(JSON.stringify(result[0]));
    }
    async getStudent(){
        const query = 'SELECT * FROM user WHERE email = ?';
        const result = await database.runQuery(query, [this.studentEmail]);
        return JSON.parse(JSON.stringify(result[0]));
    }
}

module.exports = AssignStudents;
