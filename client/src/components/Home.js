import React, {Component} from 'react'
import {withRouter } from "react-router-dom"
import { Button, Card, CardBody, Nav, NavItem, NavLink } from 'shards-react'
import './Home.css'
import axios from "axios"

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courses: [],
            username: null,
        };

        this.addCourse = this.addCourse.bind(this);
    }

    async componentDidMount() {
        //TODO: should not need to make a request for this. Should be passed in from login page.
        const user = (await axios.get('/api/user')).data.result ?? "";
        const coursesResponse = await axios.get('/api/courses');
        const courses = coursesResponse.data.result;
        courses.forEach((course) => {
            console.log(course);
        })
        this.setState({username: user, courses: courses});
    }

    addCourse() {
        this.props.history.push("/addCourse");
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
                            <NavLink href='#'>View All Courses</NavLink>
                        </NavItem>
                    </Nav>
                </div>
                <div className="cards">
                    {this.renderCard(0)}
                    {this.renderCard(1)}
                    {this.renderCard(2)}
                    {this.renderCard(3)}
                    {this.renderCard(4)}
                    {this.renderCard(5)}
                    {this.renderCard(6)}
                    {this.renderCard(7)}
                    {this.renderCard(8)}
                </div>
                    <Button id="addCourse" onClick={this.addCourse}>Add New Course</Button>
            </div>
            
            )
        }

        renderCard(i) {
            if (i > this.state.courses.length - 1) {
                return;
            }
    
            return (
                <Card>
                    <CardBody>
                        <p>{this.state.courses[i].name}</p>
                    </CardBody>
                </Card>
            );
        }
};

export default withRouter(Home)