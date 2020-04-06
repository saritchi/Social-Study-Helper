import React, {Component} from 'react'
import { withRouter } from "react-router-dom"
import { ListGroup, ListGroupItemHeading, ListGroupItem, Collapse } from 'shards-react'
import * as withAlert from "../HOC/ComponentWithAlert";
import axios from "axios"
import withMenu from '../HOC/ComponentWithMenu';
import './AssignedStudents.css'

class AssignedStudents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            assignedCourses: [],
            collapsed: []
        };
    }

    async componentDidMount() {
        if(!this.props.user.isAuthenticated) {
            this.props.history.replace("/");
            return;
        }

        if(this.props.user.role !== 'teacher') {
            this.props.history.goBack();
        }

        try {
            const assignedCoursesResponse = await axios.get('/api/assignedCourses', {
                params: {
                    email: this.props.user.email
                }
            })
            const assignedCourses = assignedCoursesResponse.data.result;
            this.setState({assignedCourses: assignedCourses});
        } catch (error) {
            if(error.response?.status === 401) {
                this.props.history.replace("/");
            }
            else {
                console.error(error);
                const errorMessage = error.response?.data.result ? error.response.data.result : "An error has occured. Please try again later."
                this.props.showAlert(withAlert.errorTheme, errorMessage);
            }
        }
    }

    toggleCollapsed = (index) => {
        const collapsed = this.state.collapsed;
        collapsed[index] = !collapsed[index];
        this.setState({collapsed: collapsed})
    }

    renderAssignedCourses = () => {
        return this.state.assignedCourses.map((assignedCourse, index) => {
            return (
                <ListGroupItem className='courseName' action={true} onClick={() => this.toggleCollapsed(index)}>
                    {assignedCourse.name}
                    <Collapse open={this.state.collapsed[index]}>
                        <ListGroupItemHeading className='studentHeading'>Students: </ListGroupItemHeading>
                        <ListGroup className='students'>
                        {assignedCourse.students.map((student) => {
                                return <ListGroupItem className='studentName'>{student.fname + ' ' + student.lname}</ListGroupItem>
                            })}
                        </ListGroup>
                    </Collapse>
                </ListGroupItem>
            )
        })
    }

    
    render() {
        return (
            <>
                <h1 id='assignedCourseTitle'>Assigned Content</h1>
                
                <div id="info">
                    <p>Here you can see the courses you've shared with your students and which students are in your which courses you're managing.</p>
                </div>
                <ListGroup id='assignedCoursesGroup'>
                    <ListGroupItemHeading>Assigned Courses</ListGroupItemHeading>
                    {this.renderAssignedCourses()}
                </ListGroup>
            </>
            )
        }
};

export default withMenu(withRouter(withAlert.withAlert(AssignedStudents)));