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
        };
    }

    async componentDidMount() {
        try {
            const coursesResponse = await axios.get('/api/courses', {
                params: {
                    email: this.props.user.email
                }
            });
            const courses = coursesResponse.data.result;
            courses.forEach((course) => {
                console.log(course);
            })
            this.setState({courses: courses});
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