import React, {Component} from 'react'
import { withRouter } from "react-router-dom"
import { Button, ListGroup, ListGroupItemHeading, ListGroupItem } from 'shards-react'
import axios from 'axios';
import * as withAlert from "../HOC/ComponentWithAlert";
import withMenu from '../HOC/ComponentWithMenu';
import NewMessageModal from '../subcomponents/NewMessageModal'
import './Messages.css'


class Messages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openNewMessageModal: false,
            users: []
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
            this.setState({users: messagedUsers});
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

    sendNewMessage = async (recipientEmail, text) => {
        const json = {
            toUser: recipientEmail,
            fromUser: this.props.user.email,
            message: text,
            timeSent: new Date().toISOString().slice(0, 19).replace('T', ' ')
        }

        try {
            const toUserResponse = await axios.post('/api/message', json)
            const toUser = toUserResponse.data.result;
            const users = this.state.users;
            users.push(toUser);
            console.log(users);
            this.setState({users: users})
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

        this.toggleNewMessageModal();
    }

    toggleNewMessageModal = () => {
        this.setState({openNewMessageModal: !this.state.openNewMessageModal})
    }

    messageThreadView = (toUser) => {
        console.log(this.props.user.email);
        this.props.history.push({
            pathname: '/messageThread',
            state: {
                otherUser: toUser,
            }
        });
    }

    renderMessageThreads = () => {
        console.log(this.state.users);
        return this.state.users.map((user) => {
            return <ListGroupItem key={user.email} className='messageThread' action={true} onClick={() => this.messageThreadView(user)}>
                {user.fname + ' ' + user.lname}
            </ListGroupItem>
        })
    }
    
    render() {
        return (
            <div>
                <h1 id='title'>Your Chats</h1>
                <ListGroup small={true} flush={true} id="messagesGroup">
                    <ListGroupItemHeading>Message Threads:</ListGroupItemHeading>
                    {this.renderMessageThreads()}
                </ListGroup>
                <NewMessageModal open={this.state.openNewMessageModal}
                                 toggle={this.toggleNewMessageModal}
                                 sendMessage={this.sendNewMessage}/>
                <Button id="newMessageThread" onClick={this.toggleNewMessageModal}>New Message</Button>
            </div>
        )
    }
};

export default withMenu(withRouter(withAlert.withAlert(Messages)));