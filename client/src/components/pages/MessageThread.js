import React, {Component} from 'react'
import { withRouter } from "react-router-dom"
import { Button, ListGroup, Form, ListGroupItem, FormTextarea, Container, Row, Col } from 'shards-react'
import axios from 'axios';
import * as withAlert from "../HOC/ComponentWithAlert";
import withMenu from '../HOC/ComponentWithMenu';
import './MessageThread.css'

class MessageThread extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            newMessage: ''
        };
    }

    async componentDidMount() {
        console.log(this.props.user.isAuthenticated)
        if(!this.props.user.isAuthenticated) {
            this.props.history.replace("/");
            return;
        }
        try {
            const otherUser = this.props.location?.state?.otherUser;
            const messagesResponse = await axios.get('/api/messages', {
                params: {
                    currentUser: this.props.user.email,
                    otherUser: otherUser?.email,
                }
            })
            const messages = messagesResponse.data.result;
            console.log(messages);
            this.setState({messages: messages});
        } catch(error) { 
            console.error(error);
            if(error.response?.status === 401) {
                this.props.history.replace("/");
            }
            else {
                const errorMessage = error.response?.data.result ? error.response.data.result : "An error has occured. Please try again later."
                this.props.showAlert(withAlert.errorTheme, errorMessage);
            }
        }
    }

    onMessageChange = e => {
        this.setState({[e.target.name]: e.target.value})
    }

    sendNewMessage = async () => {
        const newMessage = {
            toUser: this.props.location?.state?.otherUser.email,
            fromUser: this.props.user.email,
            message: this.state.newMessage,
            timeSent: new Date().toISOString().slice(0, 19).replace('T', ' ')
        }

        try {
            await axios.post('/api/message', newMessage)
            var messages = this.state.messages;
            messages.push(newMessage);

            this.setState({messages: messages, newMessage: ''})
            this.props.showAlert(withAlert.successTheme, "Message Sent!");
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

    renderMessages = () => {
        return this.state.messages.map((messageObj, index) => {
            var userMessage = '';
            var className
            if(messageObj.fromUser ===  this.props.user.email) {
                className = 'even'
                userMessage = 'You: ' + messageObj.message;
            } else {
                className = 'odd'
                userMessage = messageObj.fromUser + ': ' + messageObj.message;
            }
            return <ListGroupItem key={index} className={className}>
                {userMessage}
            </ListGroupItem>
        })
    }
    
    render() {
        const otherUser = this.props.location?.state?.otherUser;
        var otherUserName = '';
        if (otherUser) {
            otherUserName = otherUser.fname + ' ' + otherUser.lname;
        }

        return (
            <div>
                <h1 id='title'>Chat with {otherUserName}</h1>
                <ListGroup small={true} flush={true} id="messages">
                    {this.renderMessages()}
                </ListGroup>
                <Form>
                    <FormTextarea id="newMessage" value={this.state.newMessage} name="newMessage" onChange={this.onMessageChange}/>
                </Form>
                <Button id="sendMessage" onClick={this.sendNewMessage}>Send</Button>
                <Container>
                    <Row>
                        <Col>
                        </Col>
                        <Col>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
};

export default withMenu(withRouter(withAlert.withAlert(MessageThread)));