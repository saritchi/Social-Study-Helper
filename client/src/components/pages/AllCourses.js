import React, {Component} from 'react'
import { withRouter } from "react-router-dom"
import { Button } from 'shards-react'
import './AllCourses.css'
import axios from "axios"
import CardDisplay from '../subcomponents/CardDisplay';
import * as withAlert from "../HOC/ComponentWithAlert";
import withMenu from '../HOC/ComponentWithMenu';


class AllCourses extends Component {
    constructor(props) {
        super(props);
        this.state = { courses: [] };
    }

    async componentDidMount() {
        if(!this.props.user.isAuthenticated) {
            this.props.history.replace("/");
            return;
        }

        try {
            this.setState({courses: await this.getPageContent()})
        } catch(error) {
            if(error.response.status === 401) {
                this.props.history.replace("/");
            }
            else {
                console.error(error);
                this.props.showAlert(withAlert.errorTheme, error.response.data.result);
            }
        }
    }

    getPageContent = async() => {
        const coursesResponse = await axios.get('/api/courses', {
            params: {
                email: this.props.user.email
            }
        });
        const sharedContentResponse = await axios.get('/api/sharedCourseContent', {
            params: {
                email: this.props.user.email
            }
        })

        var courses = coursesResponse.data.result;
        const sharedContent = sharedContentResponse.data.result;

        const courseIds = courses.map((course) => course.id);
        const sharedUsers = sharedContent.filter((sharedContent) => courseIds.includes(sharedContent.courseId))
        //find the user each course has been shared with and add them to the course object
        courses.forEach((course) => {
            const users = sharedUsers.filter((sharedUser) => sharedUser.courseId === course.id).map((sharedUser) => {
                return {sharedId: sharedUser.id, email: sharedUser.toUser}
            });
            course['sharedWith'] = users;
        })
        return courses;
    }

    /**
     * @param {*} courseId id of the course to share
     * @param {*} toEmails an Array of emails of users to share the course with
     * @param {*} courseName name of course to share
     */
    shareCourseCallback = async (courseId, toEmails, courseName) => {
        try {
            const sharedContentResponse = await axios.post('api/shareCourse', {
                fromEmail: this.props.user.email,
                toEmails: toEmails,
                id: courseId
            })
            const sharedContent = sharedContentResponse.data.result;

            this.addUsersToSharedWith(sharedContent, courseId);
            const users = toEmails.join(', ')
            this.props.showAlert(withAlert.successTheme, `Shared ${courseName} with ${users}.` )
        } catch (error) {
            console.error(error);
            this.props.showAlert(withAlert.errorTheme, error.response.data.result);
        }
    }

    addUsersToSharedWith = (sharedContent, courseId) => {
        var courses = this.state.courses;
        var courseIndex = courses.findIndex(course => course.id === courseId);
        var  users = sharedContent.map((content) => {
            return {sharedId: content.id, email: content.toUser}
        })
        courses[courseIndex].sharedWith = courses[courseIndex].sharedWith.concat(users);
        this.setState({courses: courses});
    }

    /**
     * @param {*} contentId id of the course to delete
     * @returns {*} boolean if the callback succeeded
     */
    removeSharedCourseCallback = async (contentId) => {
        try {
            await axios.delete('api/sharedCourse', {
                params: {
                    id: contentId
                }
            })
            return true;
        } catch (error) {
            console.error(error);
            this.props.showAlert(withAlert.errorTheme, error.response.data.result);
        }

        return false;
    }

    deleteCourseCallback = async (courseId) => {
        try {
            await axios.delete('api/deleteCourse', {
                params: {
                    id: courseId
                }
            })
            var courses = this.state.courses;
            const indexToDelete = courses.findIndex((course) => course.id === courseId);
            courses.splice(indexToDelete, 1);
            this.setState({courses: courses});
        } catch (error) {
            if(error.response?.status === 401) {
                this.props.history.replace("/");
            } else {
                console.error(error);
                this.props.showAlert(withAlert.errorTheme, error.response.data.result);
            }
        }
    }

    addCourse = () => {
        this.props.history.push("/addCourse");
    }

    courseView = (courseId, courseName) => {
        this.props.history.push({
            pathname: '/decks',
            state: {
                id: courseId,
                name: courseName
            }
        });
    }
    
    render() {
        return (
            <div>
                <div id="user">
                    <h1>All Courses</h1>
                </div>
                <CardDisplay changePage={this.courseView} options={true} 
                             sharedContentCallback={this.shareCourseCallback}
                             removeSharedContentCallback={this.removeSharedCourseCallback}
                             deleteCallback={this.deleteCourseCallback}
                             cardsInfo={this.state.courses}
                />
                <Button id="newCourse" onClick={this.addCourse}>Add New Course</Button>
            </div>
            
            )
        }
};

export default withMenu(withRouter(withAlert.withAlert(AllCourses)));