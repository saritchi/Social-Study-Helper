import React, {Component} from 'react'
import {withRouter } from "react-router-dom"
import { Button, Card, CardBody } from 'shards-react'
import EventAlert from './EventAlert';
import InfoCard from "./InfoCard";
import './Home.css'
import axios from "axios"

class AllCourses extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courseCards: [],
            networkError: false,
            networkErrorMessage: '',
        };

        this.addCourse = this.addCourse.bind(this);
    }

    async componentDidMount() {
        try {
            const coursesResponse = await axios.get('/api/courses');
            const courses = coursesResponse.data.result;
            courses.forEach((course) => {
                console.log(course);
            })
            this.generateCourseCards(courses);
        } catch(error) {
            console.error(error);
            this.setState(
            {
                networkError: true,
                networkErrorMessage: error.response.data.result,
            });
        }
    }

    generateCourseCards = (courses) => {
        var newCourseCards = []
        courses.forEach((course) => {
            newCourseCards.push(this.renderCard(course.name));
        });
        this.setState({courseCards: newCourseCards});
    }

    renderCard = (coursename) => {
        return <InfoCard info={coursename} />;
    }

    addCourse() {
        this.props.history.push("/addCourse");
    }

    dismissAlert = () => {
        this.setState({showAlert: false});
    }
    
    //TODO: add callback to update courses
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
                    <h1>All Courses</h1>
                </div>
                <div className="cards">
                    {this.state.courseCards}
                </div>
                    <Button id="addCourse" onClick={this.addCourse}>Add New Course</Button>
            </div>
            
            )
        }
};

export default withRouter(AllCourses)