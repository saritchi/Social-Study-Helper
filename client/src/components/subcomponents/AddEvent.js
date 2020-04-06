import React, {Component} from "react";
import { withRouter } from "react-router-dom"
import { Button, Form, FormInput, FormTextarea, DatePicker, Container, Row, Col} from "shards-react";
import './AddEvent.css';
import axios from "axios";
import * as withAlert from "../HOC/ComponentWithAlert";
import withMenu from '../HOC/ComponentWithMenu';
import moment from 'moment';

class AddEvent extends Component {
    titleId = "Title"
    descpId ="Description"
    startDateId = "Start Date"
    constructor(props) {
        super(props);
        this.state = {
          title: '',
          description: '',
          startDate: new Date(),
          endDate: new Date()
        }
        this.startDateChange = this.startDateChange.bind(this);
        this.endDateChange = this.endDateChange.bind(this);
      }

    startDateChange(date){
        //prevents setting a start date ahead of the end date
        if(date > this.state.endDate){
            this.setState({
                endDate: date,
                startDate: date
            })
        } else{
            this.setState({
                startDate: date
            })
        } 
    }

    endDateChange(date){
        //prevents setting an end date before a start date
        if(date < this.state.startDate){
            this.setState({
                endDate: date,
                startDate: date
            })
        } else {
            this.setState({
                endDate: date
            })
        }
    }

    onInputChange = e => {
        if(e.target.name === "EventTitle"){
            this.setState({title: e.target.value});
        }else if(e.target.name === "EventDescription"){
            this.setState({description: e.target.value});
        }
    }
    
    onSubmit = async e => {
        e.preventDefault();

        if (!this.state.title || !this.state.description) {
            this.props.showAlert(withAlert.errorTheme, "Error some inputs are empty.")
            return;
        }

        const json = {
            title: this.state.title,
            description: this.state.description,
            startDate: moment(this.state.startDate).format('YYYY-MM-DD HH:mm:ss').replace('T', ' '),
            endDate: moment(this.state.endDate).format('YYYY-MM-DD HH:mm:ss').replace('T', ' ')
        }

        try{
            await axios.post("/api/addEvent", json);
            this.setState({
                title: '', 
                description: '',
                startDate: new Date(new Date().setHours(new Date().getHours())),
                endDate: new Date(new Date().setHours(new Date().getHours()))
            })
            this.props.showAlert(withAlert.successTheme, "Added Event");
        }catch(error){
            if(error.response.status === 401){
                this.props.history.replace("/");
            }else{
                console.log(error);
                this.props.showAlert(withAlert.errorTheme, error.response.data.result);
            }
        }
    }

    render(){
        return(
            <div>
                <Form id="EventInfo">
                    <h1>Create New Event</h1>
                    <label htmlFor={this.titleId}>Title:</label>
                    <br></br>
                    <FormInput id={this.titleId} name="EventTitle" value={this.state.title} onChange={this.onInputChange} placeholder="Title"></FormInput>
                    <br></br>
                    <label htmlFor={this.descpId}>Description:</label>
                    <FormTextarea id={this.descpId} name="EventDescription" value={this.state.description} onChange={this.onInputChange} placeholder="Description"></FormTextarea>
                    <br></br>
                    <Container>
                        <Row>
                            <Col>
                                <DatePicker
                                    htmlFor={this.startDateId}
                                    name="startDate"
                                    selected={this.state.startDate}
                                    onChange={this.startDateChange}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    timeCaption="Time"
                                    dateFormat="MMMM d, yyyy h:mm aa"
                                ></DatePicker>
                            </Col>
                            <Col sm="1">
                                <h6></h6>
                                <h6>to</h6>

                            </Col>
                            <Col >
                                <DatePicker
                                    htmlFor={this.endDateId}
                                    name="endDate"
                                    selected={this.state.endDate}
                                    onChange={this.endDateChange}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    timeCaption="Time"
                                    dateFormat="MMMM d, yyyy h:mm aa"
                                ></DatePicker>
                            </Col>
                        </Row>

                    </Container>
                        <br></br>
                        <br></br>
                        <Button id="addEvent" onClick={this.onSubmit}>Add Event</Button>

            
                </Form>
            </div>
        )
    }
}

export default withMenu(withRouter(withAlert.withAlert(AddEvent)));