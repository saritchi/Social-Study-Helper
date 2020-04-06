import React, {Component} from 'react';
import { withRouter } from "react-router-dom"
import {Calendar, momentLocalizer} from "react-big-calendar";
import {Button, Modal, ModalHeader, ModalBody, Row, Col, Form, FormInput, FormTextarea, DatePicker, Container} from 'shards-react'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './UserCalendar.css';
import moment from 'moment';
import axios from 'axios';
import * as withAlert from "../HOC/ComponentWithAlert";

const localizer = momentLocalizer(moment)

class UserCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
          events: [],
          eventOpen: false,
          eventTitle: '',
          eventDesc: '',
          eventStart: moment(),
          eventEnd: moment(),
          eventId: '',
          addEventOpen: false,
          title: '',
          titleInalid: false,
          description: '',
          descriptionInvalid: false,
          startDate: new Date(),
          endDate: new Date()
        };
        this.startDateChange = this.startDateChange.bind(this);
        this.endDateChange = this.endDateChange.bind(this);
      }

      async componentDidMount() {
        try {
            const eventsResponse = await axios.get('/api/events', {
                params: {
                    email: this.props.user.email
                }
            });
            const events = eventsResponse.data.result;
            var parsedEvents = [];
            events.forEach((event)=>{
               
                parsedEvents.push({
                    id: event.id,
                    title: event.title,
                    description: event.description,
                    start: moment(event.startDate)._d,
                    end: moment(event.endDate)._d
                });
                
            })
            this.setState({events: parsedEvents}); 
        } catch(error) {
            if(error.response.status === 401) {
                this.props.history.replace("/");
            }
            else {
                console.error(error);
                this.props.displayError(error.response.data.result);
            }
        }
    }

   deleteEvent = async e => {
        try {
            
            let idx_event = this.state.events.findIndex(({id}) => id === this.state.eventId);
            this.state.events.splice(idx_event, 1);

            this.setState({
                eventOpen: !this.state.eventOpen
            })

            await axios.get('/api/deleteEvent', {
                params: {
                    id: this.state.eventId
                }
            });


        } catch(error) {
            if(error.response.status === 401) {
                this.props.history.replace("/");
            }
            else {
                console.error(error);
                this.props.displayError(error.response.data.result);
            }
        }
        
    }

    //Clicking on an Event
    onEventClick = (e) => {
        if(e){
            this.setState({
                eventTitle: e.title,
                eventDesc: e.description,
                eventStart: moment(e.start).format("dddd, MMMM Do YYYY, h:mm a").toString(),
                eventEnd: moment(e.end).format("dddd, MMMM Do YYYY, h:mm a").toString(),
                eventId: e.id
            })
        }
        this.setState({
            eventOpen: !this.state.eventOpen
        })
    }

    //Add Event
    onNewEvent = (e) =>{
        this.setState({
            addEventOpen: !this.state.addEventOpen
        })
    }

    //Add Event
    startDateChange(date){
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

    //Add Event
    endDateChange(date){
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

    //Add Event
    onSubmit = async e => {
        e.preventDefault();

        this.setState({titleInvalid: false});
        this.setState({descriptionInvalid: false});

        if (!this.state.title || !this.state.description) {

            if(!this.state.title){
                this.setState({titleInvalid: true});
            }

            if(!this.state.description){
                this.setState({descriptionInvalid: true});
            }    

            return;
        }else{
            this.setState({
                addEventOpen: !this.state.addEventOpen
            })
        }

        const json = {
            title: this.state.title,
            description: this.state.description,
            startDate: moment(this.state.startDate).format('YYYY-MM-DD HH:mm:ss').replace('T', ' '),
            endDate: moment(this.state.endDate).format('YYYY-MM-DD HH:mm:ss').replace('T', ' ')
        }

        try{
            const eventId = await axios.post("/api/addEvent", json);
            this.props.displayEventPrompt("Added Event");
            this.setState(prevState => ({
                events: [...prevState.events, {id: eventId, title: this.state.title, description: this.state.description, start: moment(this.state.startDate)._d, end: moment(this.state.endDate)._d}]
            }))
            this.setState({
                title: '', 
                description: '',
                startDate: new Date(),
                endDate: new Date()
            })

        }catch(error){
            if(error.response.status === 401){
                this.props.history.replace("/");
            }else{
                console.log(error);
                this.props.displayError(error.response.data.result);
            }
        }


    }

    //Add Event
    onInputChange = e => {
        if(e.target.name === "EventTitle"){
            this.setState({title: e.target.value});
        }else if(e.target.name === "EventDescription"){
            this.setState({description: e.target.value});
        }
    }

    render(){
        return(
            <div id="CalendarWrapper">
                <Calendar
                    events={this.state.events}
                    startAccessor="start"
                    endAccessor="end"
                    defaultDate={moment().toDate()}
                    localizer={localizer}
                    views={['month','week', 'day']}
                    onSelectEvent={this.onEventClick}
                />
                <Modal open={this.state.eventOpen} toggle={this.onEventClick}>
                    <ModalHeader>
                        <Row>
                            <Col id="eventTitle" lg="6">
                                {this.state.eventTitle}
                            </Col>
                            <Col lg="6">
                                <Button id="editEvent" theme="danger" onClick={this.deleteEvent}>Delete</Button>
                            </Col>
                        </Row>
                    </ModalHeader>
                    <ModalBody>
                            <h6 className="calender-text">Start:</h6>
                            <p>{this.state.eventStart}</p>
                            <h6 className="calender-text">End:</h6>
                            <p>{this.state.eventEnd}</p>
                            <h6 className="calender-text">Description:</h6>
                            <p>{this.state.eventDesc}</p>
                    </ModalBody>
                </Modal>
                <Modal id="AddEventModal" open={this.state.addEventOpen} toggle={this.onNewEvent}>
                    <div>
                    <Form id="EventInfo">
                        <h3>Create New Event</h3>
                        <label htmlFor={this.titleId}>Title:</label>
                        <br></br>
                        <FormInput invalid={this.state.titleInvalid} id={this.titleId} name="EventTitle" value={this.state.title} onChange={this.onInputChange} placeholder="Title"></FormInput>

                        <br></br>
                        <label htmlFor={this.descpId}>Description:</label>
                        <FormTextarea invalid={this.state.descriptionInvalid} id={this.descpId} name="EventDescription" value={this.state.description} onChange={this.onInputChange} placeholder="Description"></FormTextarea>
                        <br></br>
                        <Container id="datepicker">
                            <div id="date-start">
                                <h6>Start</h6>
                                    <DatePicker
                                        id="calender-datepicker"
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
                            </div>
                            <div id="date-end">
                                <h6>End</h6>
                                <DatePicker
                                        id="calender-datepicker"
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
                            </div>


                        </Container>
                            <br></br>
                            <br></br>
                            <Button id="addEvent" onClick={this.onSubmit} theme="info">Add Event</Button>
                    </Form>
                    </div>
                </Modal>
                <Button id="newEvent" onClick={this.onNewEvent} theme="info">New Event</Button>
            </div>
        );
    }
}

export default  withRouter(withAlert.withAlert(UserCalendar));