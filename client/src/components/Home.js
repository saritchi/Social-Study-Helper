import React, {Component} from 'react'
import { withRouter } from "react-router-dom"
import { Button, Nav, NavItem, NavLink } from 'shards-react'
import './Home.css'
import axios from 'axios';
import CardDisplay from './CardDisplay';
import * as withAlert from "./HOC/ComponentWithAlert";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courses: [],
        };
        this.assignStudentBtn = this.assignStudentBtn.bind(this);
        this.ifTeacher = this.ifTeacher.bind(this);
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
        this.props.history.push({
            pathname: '/allCourses',
            state: { email: this.props.user.email }
        });
    }
    assignStudentBtn(e){
        this.props.history.push({
            pathname: '/assignStudents',
            state: { teacherEmail: this.props.user.email }
        });
    }
    ifTeacher(){
        if(this.props.user.role === 'teacher'){
            return <NavLink href='#' onClick={this.assignStudentBtn}>Assign Students</NavLink>
        }
    }
    
    render() {
        const username = this.props.user.fname + ' ' + this.props.user.lname + ' ' + this.props.user.role;
        return (
            <div>
                <div id="user">
                    <h1>Welcome {username}!</h1>
                    {this.ifTeacher()}
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
                <CardDisplay changePage={this.deckView} cardsInfo={this.state.courses.slice(0, 9)}/>
                <Button id="newCourse" onClick={this.addCourse}>Add New Course</Button>
            </div>
            )
        }
};

export default withRouter(withAlert.withAlert(Home));