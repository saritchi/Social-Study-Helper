var router = require('express').Router();
var User = require('../models/user');
var AssignStudents = require('../models/AssignStudents');

async function assignStudent(req, res) {
    let post = req.body;
    let teacherEmail = post.teacherEmail;
    let studentEmail = post.studentEmail;
    let assignStudent =  new AssignStudents(teacherEmail,studentEmail);
    try {
        let teacherResponse = await assignStudent.getTeacher();
        let studentResponse = await assignStudent.getStudent();
        const teacher = new User(teacherResponse.email,teacherResponse.password,teacherResponse.fname,teacherResponse.lname,teacherResponse.role);
        const student = new User(studentResponse.email,studentResponse.password,studentResponse.fname,studentResponse.lname,studentResponse.role);
        if(await teacher.isStudent()){
            res.status(400).json({result: "Bad request"});
            return;
        }
        if(await student.isTeacher()){
            res.status(400).json({result: "Bad request"});
            return;
        };
        if(await assignStudent.exist()){
            res.status(409).json({result: "The Student you are trying to assign is already your student"});
            return;
        }
        await assignStudent.assignStudent()
        res.status(200).json({result: "Succesfully assign student."});
    } catch (error) {
        console.log(error);
        res.status(500).json({result: "Internal server error"});
    }
    
}

router.post('/assignStudent',assignStudent )

module.exports = router;