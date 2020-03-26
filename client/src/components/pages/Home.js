import React, {Component} from 'react'
import { withRouter } from "react-router-dom"
import { Button, Nav, NavItem, NavLink } from 'shards-react'
import './Home.css'
import axios from 'axios';
import CardDisplay from '../subcomponents/CardDisplay';
import * as withAlert from "../HOC/ComponentWithAlert";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courses: [],
            sharedCourses: [],
            sharedDecks: []
        };
        this.displayLimit = 9
    }

    async componentDidMount() {
        if(!this.props.user.isAuthenticated) {
            this.props.history.replace("/");
            return;
        }
        try {
            const {courses, sharedCourses, sharedDecks} = await this.getPageContent();
            this.setState({courses: courses, sharedCourses: sharedCourses, sharedDecks: sharedDecks});
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

        const courses = coursesResponse.data.result;
        const sharedCourses = sharedCoursesResponse.data.result;
        const sharedDecks = sharedDecksResponse.data.result

        return {courses: courses, sharedCourses: sharedCourses, sharedDecks: sharedDecks}
    }

    shareCourseCallback = async (courseId, toEmails) => {
        try {
            await axios.post('api/shareCourse', {
                fromEmail: this.props.user.email,
                toEmails: toEmails,
                id: courseId
            })
        } catch (error) {
            console.error(error);
            this.props.showAlert(withAlert.errorTheme, error.response.data.result);
        }
    }

    addCourse = () => {
        this.props.history.push("/addCourse");
    }

    deckView = (courseId, deckName) => {
        this.props.history.push({
            pathname: '/decks',
            state: {
                id: courseId,
                name: deckName
            }
        });
    }

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
                    <Nav>
                        <NavItem id="recentCourses">
                            <h3>Recent Courses: </h3>
                        </NavItem>
                        <NavItem id="allCourses">
                            <NavLink href='#' onClick={this.allCoursesView}>View All Courses</NavLink>
                        </NavItem>
                    </Nav>
                </div>
                <CardDisplay changePage={this.deckView} options={true} shareContentCallback={this.shareCourseCallback} cardsInfo={this.state.courses}/>
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
                    <CardDisplay changePage={this.deckView} cardsInfo={this.state.sharedCourses}/>
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

export default withRouter(withAlert.withAlert(Home));