import React, {Component} from 'react'
import { withRouter } from "react-router-dom"
import { Button, ListGroup, ListGroupItemHeading, ListGroupItem, Container, Row, Form, FormTextarea } from 'shards-react'
import axios from 'axios';
import * as withAlert from "../HOC/ComponentWithAlert";
import withMenu from '../HOC/ComponentWithMenu';
import NewMessageModal from '../subcomponents/NewMessageModal'
import './Messages.css'
import MessageThread from '../subcomponents/MessageThread';


class Messages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openNewMessageModal: false,
            threadUser: null,
            threadUsers: [],
            threadMessages: [],
            newMessage: '',
        };
    }

    async componentDidMount() {
        if(!this.props.user.isAuthenticated) {
            this.props.history.replace("/");
            return;
        }
        try {
            const messagedUsersResponse = await axios.get('/api/messagedUsers', {
                params: {
                    email: this.props.user.email,
                }
            })
            const messagedUsers = messagedUsersResponse.data.result;

            if(messagedUsers.length === 0) {
                this.setState({threadUsers: messagedUsers});
                return;
            }
            
            this.setState({threadUsers: messagedUsers, threadUser: messagedUsers[0]}, () => {this.selectMessageThread(0)})

        } catch(error) { 
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

    
    createNewChat = async (recipientEmails, message) => {
        try {
            const usersMessaged = await this.sendNewMessage(recipientEmails, message);
            const users = this.state.threadUsers;
            users.push(...usersMessaged);
            this.setState({threadUsers: this.removeDuplicates(users)})
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
    
    //filters the users array into a distinct set using the json objects and then converts it back to an array.
    removeDuplicates = (users) => {
        const userSet = new Set(users.map((user) => JSON.stringify(user)));
        return [...userSet].map((jsonUser) => JSON.parse(jsonUser))
    }

    sendNewChatMessage = async() => {
        try {
            await this.sendNewMessage([this.state.threadUser.email], this.state.newMessage);
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

    sendNewMessage = async (recipientEmails, message) => {
        const newMessage = {
            toUsers: recipientEmails,
            fromUser: this.props.user.email,
            message: message,
            timeSent: new Date().toISOString().slice(0, 19).replace('T', ' ')
        }

        const usersMessagedResponse = await axios.post('/api/message', newMessage)
        var messages = this.state.threadMessages;
        messages.push(newMessage);
        this.setState({threadMessages: messages, newMessage: ''})

        return usersMessagedResponse.data.result;
    }


    onMessageChange = e => {
        this.setState({newMessage: e.target.value})
    }

    toggleNewMessageModal = () => {
        this.setState({openNewMessageModal: !this.state.openNewMessageModal})
    }

    renderMessageThreads = () => {
        return this.state.threadUsers.map((user, index) => {
            return <ListGroupItem key={user.email} className='messageThread' action={true} onClick={() => this.selectMessageThread(index)}>
                {user.fname + ' ' + user.lname}
            </ListGroupItem>
        })
    }

    selectMessageThread = async (index) => {
        try {
            const otherUser = this.state.threadUsers[index];
            const messagesResponse = await axios.get('/api/messages', {
                params: {
                    currentUser: this.props.user.email,
                    otherUser: otherUser.email,
                }
            })
            const messages = messagesResponse.data.result;
            console.log(messages);
            this.setState({threadMessages: messages});
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
    
    render() {
        const sendDisabled = this.state.otherUser ? true : false;
        return (
            <>
                <h1 id='title'>Your Chats</h1>
                <Container id="messageContainer">
                    <Row id="messagesRow">
                        <ListGroup small={true} flush={true} id="messageThreads">
                            <ListGroupItemHeading>Message Threads:</ListGroupItemHeading>
                            <div id="threads">
                                {this.renderMessageThreads()}
                            </div>
                            <Button id="newMessageThread" onClick={this.toggleNewMessageModal}>New Chat</Button>
                        </ListGroup>
                        <MessageThread messages={this.state.threadMessages} user={this.props.user} />
                    </Row>
                    <Row>
                        <Form id="newMessageForm">
                            <FormTextarea value={this.state.newMessage} onChange={this.onMessageChange}/>
                        </Form>
                    </Row>
                    <Row>
                        <Button id="sendMessage" disabled={sendDisabled} onClick={this.sendNewChatMessage}>Send</Button>    
                    </Row>
                </Container>
                <NewMessageModal open={this.state.openNewMessageModal}
                                 toggle={this.toggleNewMessageModal}
                                 sendMessage={this.createNewChat}/>
            </>
        )
    }
};

export default withMenu(withRouter(withAlert.withAlert(Messages)));