import React, {Component} from 'react'
import { withRouter } from "react-router-dom"
import { Button, Nav, NavItem, NavLink, CardBody, CardHeader } from 'shards-react'
import './Home.css'
import axios from 'axios';
import CardDisplay from '../subcomponents/CardDisplay';
import * as withAlert from "../HOC/ComponentWithAlert";
import withMenu from '../HOC/ComponentWithMenu';
import UserCalendar from './UserCalendar'


class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courses: [],
            sharedCourses: [],
            sharedDecks: [],
        };
        this.displayLimit = 9
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
                limit: this.displayLimit
            }
        });
        const sharedCoursesResponse = await axios.get('/api/sharedCourses', {
            params: {
                email: this.props.user.email,
                limit: this.displayLimit
            }
        })
        const sharedDecksResponse = await axios.get('/api/sharedDecks', {
            params: {
                email: this.props.user.email,
                limit: this.displayLimit
            }
        })

        const sharedContentResponse = await axios.get('/api/sharedCourseContent', {
            params: {
                email: this.props.user.email
            }
        })

        var courses = coursesResponse.data.result;
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
        return {courses: courses, sharedCourses: sharedCourses, sharedDecks: sharedDecks}
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


    addCourse = () => {
        this.props.history.push("/addCourse");
    }

    /**
     * @param {*} courseId id of the course the user is clicking
     * @param {*} courseName name of the course the user is clicking
     */
    courseView = (courseId, courseName) => {
        this.props.history.push({
            pathname: '/decks',
            state: {
                id: courseId,
                name: courseName
            }
        });
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
                    <UserCalendar user={this.props.user}></UserCalendar>
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
                             cardsInfo={this.state.courses}
                />
                <Button id="newCourse" onClick={this.addCourse}>Add New Course</Button>
                <div id="sharedCourses">
                    <Nav>
                        <NavItem id="recentSharedCourses">
                            <h3>Recent Shared Courses: </h3>
                        </NavItem>
                        <NavItem id="allSharedContent">
                            <NavLink href='#' onClick={this.allSharedContentView}>View All Shared Content</NavLink>
                        </NavItem>
                    </Nav>
                    <CardDisplay changePage={this.courseView} cardsInfo={this.state.sharedCourses}/>
                </div>
                <div id="sharedDecks">
                    <Nav>
                        <NavItem id="recentSharedDecks">
                                <h3>Recent Shared Decks: </h3>
                        </NavItem>
                    </Nav>
                    <CardDisplay changePage={this.cardView} cardsInfo={this.state.sharedDecks}/>
                </div>
            </div>
            )
        }
};

export default withMenu(withRouter(withAlert.withAlert(Home)));