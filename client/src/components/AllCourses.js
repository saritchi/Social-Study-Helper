import React, {Component} from 'react'
import {withRouter } from "react-router-dom"
import { Button, Card, CardBody } from 'shards-react'
import EventAlert from './EventAlert';
import './Home.css'
import axios from "axios"
import CardDisplay from './CardDisplay';

class AllCourses extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courses: [],
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
            this.setState({courses: courses})
        } catch(error) {
            console.error(error);
            this.setState(
            {
                networkError: true,
                networkErrorMessage: error.response.data.result,
            });
        }
    }

    addCourse() {
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
                    <h1>All Courses</h1>
                </div>
                <CardDisplay cardsInfo={this.state.courses} />
                <Button id="addCourse" onClick={this.addCourse}>Add New Course</Button>
            </div>
            
            )
        }
};

export default withRouter(AllCourses)