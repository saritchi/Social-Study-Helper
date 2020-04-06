import React, {Component} from 'react'
import { withRouter } from "react-router-dom"
import { Button, Nav, NavItem, NavLink } from 'shards-react'
import './Home.css'
import axios from 'axios';
import CardDisplay from '../subcomponents/CardDisplay';
import TestView from '../subcomponents/TestView';
import TestModal from '../subcomponents/CreateTest';
import * as withAlert from "../HOC/ComponentWithAlert";
import withMenu from '../HOC/ComponentWithMenu';
import UserCalendar from '../subcomponents/UserCalendar'


class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courses: [],
            tests: [],
            sharedCourses: [],
            sharedDecks: [],
        };
        this.coursesDisplayLimit = 9;
        this.sharedContentDisplayLimit = 3;
        this.orderBy = 'lastAccess';
    }

    async componentDidMount() {
        if(!this.props.user.isAuthenticated) {
            this.props.history.replace("/");
            return;
        }
        try {
            this.setState(await this.getPageContent());
        } catch(error) { 
            if(error.response?.status === 401) {
                this.props.history.replace("/");
            }
            else {
                console.error(error);
                const errorMessage = error.response?.data.result ? error.response.data.result : "An error has occured. Please try again later."
                this.props.showAlert(withAlert.errorTheme, errorMessage);
            }
        }
    }

    getPageContent = async() => {
        const coursesResponse = await axios.get('/api/courses', {
            params: {
                email: this.props.user.email,
                limit: this.coursesDisplayLimit,
                orderBy: this.orderBy
            }
        });
        const sharedCoursesResponse = await axios.get('/api/sharedCourses', {
            params: {
                email: this.props.user.email,
                limit: this.sharedContentDisplayLimit,
            }
        })
        const sharedDecksResponse = await axios.get('/api/sharedDecks', {
            params: {
                email: this.props.user.email,
                limit: this.sharedContentDisplayLimit,
            }
        })

        const sharedContentResponse = await axios.get('/api/sharedCourseContent', {
            params: {
                email: this.props.user.email
            }
        })

        const testsResponse = await axios.get('api/getTests', {
            params: {
                userEmail: this.props.user.email
            }
        })

        var courses = coursesResponse.data.result;
        var tests = testsResponse.data.result;
        const sharedCourses = sharedCoursesResponse.data.result;
        const sharedDecks = sharedDecksResponse.data.result
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
        return {courses: courses, sharedCourses: sharedCourses, sharedDecks: sharedDecks, tests: tests}
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
            if(error.response?.status === 401) {
                this.props.history.replace("/");
            }
            else {
                console.error(error);
                const errorMessage = error.response?.data.result ? error.response.data.result : "An error has occured. Please try again later."
                this.props.showAlert(withAlert.errorTheme, errorMessage);
            }
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
            if(error.response?.status === 401) {
                this.props.history.replace("/");
            }
            else {
                console.error(error);
                const errorMessage = error.response?.data.result ? error.response.data.result : "An error has occured. Please try again later."
                this.props.showAlert(withAlert.errorTheme, errorMessage);
            }
        }

        return false;
    }

    submitTest = async (error) => {
        if(error) {
            console.log(error);
            this.props.showAlert(withAlert.errorTheme, error.response.data.result);
        }
        else {
            this.props.showAlert(withAlert.successTheme, "Test Added!");
            try {
                const testsResponse = await axios.get('api/getTests', {
                   params: {
                       userEmail: this.props.user.email
                   }
               })
               this.setState({tests: testsResponse.data.result});
            } catch(error) {
               console.error(error);
               this.props.showAlert(withAlert.errorTheme, error.response.data.result);
            }
        }
    }

    /**
     * Deletes test from database
     * @param {*} testId id of course to delete
     */

     removeTest = async (testId) => {
         try {
             await axios.delete('api/deleteTest', {
                 params: {
                     id: testId
                 }
             })
             const testsResponse = await axios.get('api/getTests', {
                params: {
                    userEmail: this.props.user.email
                }
            })
            this.setState({tests: testsResponse.data.result});
         } catch(error) {
            console.error(error);
            this.props.showAlert(withAlert.errorTheme, error.response.data.result);
         }
     }

     dateConverter = (testDate) => {
         var datetime = new Date(testDate);
         var date = datetime.toDateString();
         var time = datetime.toTimeString().substr(0, 5);
         var output = date + " @ " + time;
         return output;
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

    /**
     * @param {*} courseId id of the course the user is clicking
     * @param {*} courseName name of the course the user is clicking
     */
    courseView = async (courseId, courseName) => {
        var course = this.state.courses.filter((course) => course.id === courseId)[0];
        //By default the Javascript Date Object uses ISO8601 which is not a valid DateTime in MYSQL
        //This https://stackoverflow.com/questions/20083807/javascript-date-to-sql-date-object offers a solution for converting
        //DateTime objects into a format MySQL accepts.
        course.lastAccess = new Date().toISOString().slice(0, 19).replace('T', ' ');
        try {
            await axios.post('api/updateCourse', {
                params: {
                    course: course
                }
            })
            this.props.history.push({
                pathname: '/decks',
                state: {
                    id: courseId,
                    name: courseName,
                    shared: false
                }
            });
        } catch (error) {
            if(error.response?.status === 401) {
                this.props.history.replace("/");
            }
            else {
                console.error(error);
                const errorMessage = error.response?.data.result ? error.response.data.result : "An error has occured. Please try again later."
                this.props.showAlert(withAlert.errorTheme, errorMessage);
            }
        }
    }

      /**
     * @param {*} courseId id of the course the user is clicking
     * @param {*} courseName name of the course the user is clicking
     */
    sharedCourseView = (courseId, courseName) => {
        this.props.history.push({
            pathname: '/decks',
            state: {
                id: courseId,
                name: courseName,
                shared: true
            }
        });
    }

    displayEventAdd = () => {
        this.props.showAlert(withAlert.successTheme, "Added Event");
    }

    displayCalendarError = (error) => {
        this.props.showAlert(withAlert.errorTheme, error);
    }

    editCourseView = (courseId) => {
        this.props.history.push("/editCourse", {courseId});
    }

    /**
     * @param {*} deckId id of the deck the user is clicking
     */
    cardView = (deckId) => {
        this.props.history.push("/viewCards", {deckId});
    }

    allCoursesView = () => {
        this.props.history.push('/allCourses')
    }

    allSharedContentView = () => {
        this.props.history.push('/allSharedContent')
    }
    
    render() {
        const username = this.props.user.fname + ' ' + this.props.user.lname;
        return (
            <div>
                <div id="user">
                    <h1>Welcome {username}!</h1>
                </div>
                    
                <div>
                    <UserCalendar user={this.props.user} displayError={this.displayCalendarError} displayEventPrompt={this.displayEventAdd} ></UserCalendar>
                </div>
                <div>
                    <Nav>
                        <NavItem id="recentCourses">
                            <h3>Recent Courses: </h3>
                        </NavItem>
                        <NavItem id="allCourses">
                            <NavLink href='#' onClick={this.allCoursesView}>View All Courses</NavLink>
                        </NavItem>
                    </Nav>
                </div>
                <CardDisplay changePage={this.courseView} options={true} 
                             sharedContentCallback={this.shareCourseCallback}
                             removeSharedContentCallback={this.removeSharedCourseCallback}
                             deleteCallback={this.deleteCourseCallback}
                             editCallback={this.editCourseView}
                             user={this.props.user}
                             cardsInfo={this.state.courses}
                />
                <Button id="newCourse-home" onClick={this.addCourse} theme="info">Create New Course</Button>
                
                <div id="testsView">
                    <Nav>
                        <NavItem id="upcomingTests">
                            <h3>Upcoming Tests: </h3>
                        </NavItem>
                    </Nav>
                    <TestView testInfo={this.state.tests} 
                              courses={this.state.courses}
                              handleDelete={this.removeTest}
                              dateParse={this.dateConverter}/>
                    <TestModal isHome={true}
                               courseOptions={this.state.courses}
                               courseId={0}
                               userEmail={this.props.user.email}
                               submitCallback={this.submitTest}
                               options={[]}>

                    </TestModal>
                </div>
                
                <div id="sharedCourses">
                    <hr></hr>
                    <Nav>
                        <NavItem id="recentSharedCourses">
                            <h3>Shared Courses Preview: </h3>
                        </NavItem>
                        <NavItem id="allSharedContent">
                            <NavLink href='#' onClick={this.allSharedContentView}>View All Shared Content</NavLink>
                        </NavItem>
                    </Nav>
                    <CardDisplay changePage={this.sharedCourseView} cardsInfo={this.state.sharedCourses}/>
                </div>
                <div id="sharedDecks">
                <hr></hr>
                    <Nav>
                        <NavItem id="recentSharedDecks">
                                <h3>Shared Decks Preview: </h3>
                        </NavItem>
                    </Nav>
                    <CardDisplay changePage={this.cardView} cardsInfo={this.state.sharedDecks}/>
                </div>
            </div>
            )
        }
};

export default withMenu(withRouter(withAlert.withAlert(Home)));