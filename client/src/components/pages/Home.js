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
            sharedContents: []
        };
    }

    async componentDidMount() {
        if(!this.props.user.isAuthenticated) {
            this.props.history.replace("/");
            return;
        }
        try {
            const coursesResponse = await axios.get('/api/courses', {
                params: {
                    email: this.props.user.email
                }
            });
            const sharedCOntentsResponse = await axios.get('/api/sharedContent', {
                params: {
                    email: this.props.user.email
                }
            })
            const courses = coursesResponse.data.result;
            console.log("Courses: ")
            console.log(courses);

            const sharedContents = sharedCOntentsResponse.data.result;
            console.log("Shared Contents:")
            console.log(sharedContents);
            this.setState({courses: courses, sharedContents: sharedContents});
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

    shareContentCallback = async (courseId, toEmails) => {
        try {
            await axios.post('api/share', {
                fromEmail: this.props.user.email,
                toEmails: toEmails,
                courseId: courseId
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

    allCoursesView = () => {
        this.props.history.push('/allCourses')
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
                <CardDisplay changePage={this.deckView} options={true} shareContentCallback={this.shareContentCallback} cardsInfo={this.state.courses.slice(0, 9)}/>
                <Button id="newCourse" onClick={this.addCourse}>Add New Course</Button>
                <div id="sharedContent">
                    <Nav>
                        <NavItem id="recentSharedContent">
                            <h3>Recent Shared Content: </h3>
                        </NavItem>
                        <NavItem id="allSharedContent">
                            <NavLink href='#' onClick={this.allCoursesView}>View All Shared Content</NavLink>
                        </NavItem>
                    </Nav>
                    <CardDisplay changePage={this.deckView} cardsInfo={this.state.sharedContents.slice(0, 9)}/>
                </div>
            </div>
            )
        }
};

export default withRouter(withAlert.withAlert(Home));