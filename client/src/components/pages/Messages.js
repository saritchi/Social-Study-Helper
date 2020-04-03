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
            messageText: text 
        }

        try {
            await axios.post('/api/message', json)
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

    renderMessageItems = () => {
        console.log(this.state.users);
        return this.state.users.map((user) => <ListGroupItem key={user.email}>{user.fname + ' ' + user.lname}</ListGroupItem>)
    }
    
    render() {
        return (
            <div>
                <h1 id='title'>Your Messages</h1>
                <ListGroup id="messagesGroup">
                    <ListGroupItemHeading>Message Threads:</ListGroupItemHeading>
                    {this.renderMessageItems()}
                </ListGroup>
                <NewMessageModal open={this.state.openNewMessageModal}
                                 toggle={this.toggleNewMessageModal}
                                 sendMessage={this.sendNewMessage}/>
                <Button id="newMessage" onClick={this.toggleNewMessageModal}>New Message</Button>
            </div>
        )
    }
};

export default withMenu(withRouter(withAlert.withAlert(Messages)));