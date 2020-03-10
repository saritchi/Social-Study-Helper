import React, {Component} from 'react'
import {withRouter } from "react-router-dom"
import { Button, Card, CardBody, Nav, NavItem, NavLink } from 'shards-react'
import EventAlert from './EventAlert';
import './Home.css'
import axios from "axios"
import InfoCard from './InfoCard';
import CardDisplay from './CardDisplay';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courses: [],
            username: null,
            networkError: false,
            networkErrorMessage: '',
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
            this.setState(
            {
                networkError: true,
                networkErrorMessage: error.response.data.result,
            });
        }
    }

    addCourse = () => {
        this.props.history.push("/addCourse");
    }

    dismissAlert = () => {
        this.setState({showAlert: false});
    }
    
    render() {
        return (
            <div>
                <EventAlert 
                    visible={this.state.networkError} 
                    dismissAlert={this.dismissAlert} 
                    theme={"danger"} 
                    message={this.state.networkErrorMessage} 
                />
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
                <CardDisplay cardsInfo={this.state.courses.slice(0, 9)}/>
                <Button id="addCourse" onClick={this.addCourse}>Add New Course</Button>
            </div>
            
            )
        }
};

export default withRouter(Home)