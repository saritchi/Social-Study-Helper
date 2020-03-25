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
            const courses = coursesResponse.data.result;
            courses.forEach((course) => {
                console.log(course);
            })
            this.setState({courses: courses});
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

    addCourse = () => {
        this.props.history.push("/addCourse");
    }

    deckView = (deckId, deckName) => {
        this.props.history.push({
            pathname: '/decks',
            state: {
                id: deckId,
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
                <CardDisplay changePage={this.deckView} options={true} cardsInfo={this.state.courses.slice(0, 9)}/>
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
                    <CardDisplay changePage={this.deckView} cardsInfo={this.state.courses.slice(0, 9)}/>
                </div>
            </div>
            )
        }
};

export default withRouter(withAlert.withAlert(Home));