import React, {Component} from 'react'
import { withRouter } from "react-router-dom"
import { Button } from 'shards-react'
import './AllCourses.css'
import axios from "axios"
import CardDisplay from './CardDisplay';
import * as withAlert from "./HOC/ComponentWithAlert";
import withMenu from './HOC/ComponentWithMenu';


class AllCourses extends Component {
    constructor(props) {
        super(props);
        this.state = { courses: [] };
    }

    async componentDidMount() {
        if(!this.props.user.isAuthenticated) {
            this.props.history.replace("/");
            return;
        }

        try {
            const coursesResponse = await axios.get('/api/courses', {
                params: {
                    email: this.props.location.state.email
                }
            });
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

    deckView = (deckId, deckName) => {
        this.props.history.push({
            pathname: '/decks',
            state: {
                id: deckId,
                name: deckName
            }
        });
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

export default withMenu(withRouter(withAlert.withAlert(AllCourses)));