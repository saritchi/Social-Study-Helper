var router = require('express').Router();
var User = require('../models/user');
var SharedCourse = require('../models/shared-course')
var Course = require('../models/course')
var authentication = require('../middleware/authentication')

async function getAssignedCourses(req, res) {
    let teacherEmail = req.query.email;

    try {
        const sharedCourses = await SharedCourse.getCoursesForUser(teacherEmail);
        var sharedCoursesWithUsersMap = new Map();
        for (const sharedCourse of sharedCourses) {
            const course = await Course.getFromId(sharedCourse.courseId);
            const user = await User.getUserFromEmail(sharedCourse.toUser);
            if(!sharedCoursesWithUsersMap[course.name]) {
                sharedCoursesWithUsersMap[course.name] = [];
            }

            sharedCoursesWithUsersMap[course.name].push(user);
        }

        const sharedCoursesWithUsers = [];
        for(const key in sharedCoursesWithUsersMap) {
            sharedCoursesWithUsers.push({
                name: key,
                students: sharedCoursesWithUsersMap[key]
            })
        }
        
        console.log(sharedCoursesWithUsers);
        res.status(200).json({result: sharedCoursesWithUsers});
    } catch (error) {
        console.log(error);
        res.status(500).json({result: "An error occured while attempting to assign your class. Please try again later."});
    }
    
}

router.get('/assignedCourses', authentication.requireLogin, authentication.requireTeacherRole, getAssignedCourses)

module.exports = router;