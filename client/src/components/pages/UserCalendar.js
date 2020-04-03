import React, {Component} from 'react';
import { withRouter } from "react-router-dom"
import {Calendar, momentLocalizer} from "react-big-calendar";
import {Button, Modal, ModalHeader, ModalBody, Row, Col} from 'shards-react'
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
          eventId: ''
        };
      }

      async componentDidMount() {
        if(!this.props.user.isAuthenticated) {
            this.props.history.replace("/");
            return;
        }
        
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
                this.props.showAlert(withAlert.errorTheme, error.response.data.result);
            }
        }
    }

    addEvent = () => {
        this.props.history.push("/addEvent");
    }

   deleteEvent = async e => {
        if(!this.props.user.isAuthenticated) {
            this.props.history.replace("/");
            return;
        }
        try {
            await axios.get('/api/deleteEvent', {
                params: {
                    id: this.state.eventId
                }
            });
            //Forces Calendar Update
            window.location.reload();

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
                            <h6>Start:</h6>
                            <p>{this.state.eventStart}</p>
                            <h6>End:</h6>
                            <p>{this.state.eventEnd}</p>
                            <h6>Description:</h6>
                            <p>{this.state.eventDesc}</p>
                    </ModalBody>
                </Modal>
                <Button id="newEvent" onClick={this.addEvent} >New Event</Button>
            </div>
        );
    }
}

export default  withRouter(withAlert.withAlert(UserCalendar));