import React, {Component} from 'react'
import {withRouter } from "react-router-dom"
import { Button, Nav, NavItem, NavLink } from 'shards-react'
import './Home.css'
import axios from "axios"
import CardDisplay from './CardDisplay';
import * as withAlert from "./ComponentWithAlert";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courses: [],
            username: null,
        };
    }

    async componentDidMount() {
        //TODO: should not need to make a request for this. Should be passed in from login page.
        const user = (await axios.get('/api/user')).data.result ?? "";
        try {
            const coursesResponse = await axios.get('/api/courses');
            const courses = coursesResponse.data.result;
            courses.forEach((course) => {
                console.log(course);
            })
            this.setState({username: user, courses: courses});
        } catch(error) {
            console.error(error);
            this.props.showAlert(withAlert.errorTheme, error.response.data.result);
        }
    }

    addCourse = () => {
        this.props.history.push("/addCourse");
    }

    deckView = () => {
        this.props.history.push("/deckDisplay");
    }
    
    render() {
        return (
            <div>
                <div id="user">
                    <h1>Welcome {this.state.username}!</h1>
                </div>
                <div>
                    <Nav>
                        <NavItem id="recentCourses">
                            <h3>Recent Courses: </h3>
                        </NavItem>
                        <NavItem id="allCourses">
                            <NavLink href='/allCourses'>View All Courses</NavLink>
                        </NavItem>
                    </Nav>
                </div>
                <CardDisplay changePage={this.deckView} cardsInfo={this.state.courses.slice(0, 9)}/>
                <Button id="newCourse" onClick={this.addCourse}>Add New Course</Button>
            </div>
            )
        }
};

export default withRouter(withAlert.withAlert(Home))