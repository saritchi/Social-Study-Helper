import React, {Component} from 'react'
import { withRouter } from "react-router-dom"
import { Button } from 'shards-react'
import './AllCourses.css'
import axios from "axios"
import CardDisplay from './CardDisplay';
import * as withAlert from "./HOC/ComponentWithAlert";

class AllCourses extends Component {
    constructor(props) {
        super(props);
        this.state = { courses: [] };
    }

    async componentDidMount() {
        if(!this.props.isAuthenticated) {
            this.props.history.replace("/");
            return;
        }

        try {
            const coursesResponse = await axios.get('/api/courses');
            const courses = coursesResponse.data.result;
            courses.forEach((course) => {
                console.log(course);
            })
            this.setState({courses: courses})
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

    deckView = () => {
        this.props.history.push("/deckDisplay");
    }
    
    render() {
        return (
            <div>
                <div id="user">
                    <h1>All Courses</h1>
                </div>
                <CardDisplay changePage={this.deckView} cardsInfo={this.state.courses} />
                <Button id="newCourse" onClick={this.addCourse}>Add New Course</Button>
            </div>
            
            )
        }
};

export default withRouter(withAlert.withAlert(AllCourses));