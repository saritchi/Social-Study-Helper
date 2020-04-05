var router = require('express').Router();
var User = require('../models/user');
var authentication = require('../middleware/authentication')
var AssignStudent = require('../models/AssignStudent');

async function assignStudents(req, res) {
    let post = req.body;
    let teacherEmail = post.teacherEmail;
    let studentEmails = post.studentEmails;

    try {
       const assignStudentsPromises = studentEmails.map((studentEmail) => {
            const assignedStudent = new AssignStudent(teacherEmail, studentEmail);
            return assignedStudent.create();
       })

       await Promise.all(assignStudentsPromises);
       res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.status(500).json({result: "An error occured while attempting to assign your class. Please try again later."});
    }
    
}

router.post('/assignStudents', authentication.requireTeacherRole, assignStudents)

module.exports = router;