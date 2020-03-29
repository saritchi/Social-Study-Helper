import React, {Component} from 'react'
import { withRouter } from "react-router-dom"
import { Button, ButtonGroup } from 'shards-react'
import axios from 'axios';
import * as withAlert from "./HOC/ComponentWithAlert";

class AssignStudents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            students:[]
        };
        this.studentClicked = this.studentClicked.bind(this);
    }
    studentClicked(e){
        e.persist()
        console.log(this.props.location.state.teacher + " " + e.target.value);
    }
    async componentDidMount() {
        try {
            const studentsResponse = await axios.get('/api/allStudents');
            let students = studentsResponse.data.result;
            students = students.map(student => (
                <Button key={student.email} outline theme="success" onClick={this.studentClicked} value={student.email}>{student.fname + ' ' + student.lname}</Button>
            ));
            this.setState({students: students});
        } catch(error) {
            this.props.showAlert(withAlert.errorTheme, error.response.data.result);
        }
    }

    
    render() {
        return (
            <div>
                <div id="user">
                    <h1>Select Student to assign</h1>
                </div>
                <div>
                    <ButtonGroup vertical>{this.state.students}</ButtonGroup>
                </div>
            </div>
            )
        }
};

export default withRouter(withAlert.withAlert(AssignStudents));