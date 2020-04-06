import React, { Component } from "react";
import * as withAlert from "../HOC/ComponentWithAlert";
import { Modal, Button, ModalBody, ModalHeader, ListGroup, ListGroupItem, ListGroupItemHeading } from "shards-react";
import { ReactMultiEmail, isEmail } from 'react-multi-email';
import { MdClear } from 'react-icons/md'
import 'react-multi-email/style.css';
import './ShareModal.css'

//The code for this was adapted from herer: https://www.npmjs.com/package/react-multi-email
class ShareModal extends Component {
    state = { 
        emails: [],
        sharedWithUsers: this.props.sharedWithUsers
    };

    /**
     * 
     * @param {*} email the email that is displayed to the user
     * @param {*} index the index of the email in the list of emails
     * @param {*} removeEmail a built in function that removes an email at the given index
     */
    renderEmailItem(email, index, removeEmail) {
        return ( <div data-tag key={index}>
            {email}
            <span data-tag-handle onClick={() => removeEmail(index)}>
              ×
            </span>
          </div>
        );
    }

    //when pressing the share button send the request to the server and close the modal
    shareContent = () => {
        //TODO: check for empty emails.
        this.props.sharedContentCallback(this.props.id, this.state.emails, this.props.name)
        this.setState({emails: []})
        this.props.toggle();
    }

    renderUserAccessList = () => {
        return this.state.sharedWithUsers.map((user) => {
            return <ListGroupItem key={user.sharedId} className='sharedUser' >{user.email}<MdClear onClick={() => this.removeUser(user.sharedId)} className="removeUser"/></ListGroupItem>
        })
    }

    removeUser = async (id) => {
        const success = await this.props.removeSharedContentCallback(id)
        if (success) {
            const removeIndex = this.state.sharedWithUsers.map((user) => user.sharedId).indexOf(id);
            var updatedSharedWithUsers = this.state.sharedWithUsers;
            updatedSharedWithUsers.splice(removeIndex, 1);
            this.setState({sharedWithUsers: updatedSharedWithUsers})
        }
    }

    validateEmail = (email) => {
        const sharedEmails = this.state.sharedWithUsers.map((user) => user.email)
        return isEmail(email) && !sharedEmails.includes(email)
    }

    render() {
        var headerText = 'Share ' + this.props.name + ' with others';
        var listHeaderText = 'Who has access: ';
        var userHeaderText = 'Add People';
        var placeholderText = "Enter email addresses....";
        var shareButtontext = 'Share';
        
        const isTeacher = this.props.user.role === 'teacher' ? true : false
        if(isTeacher) {
            headerText = 'Assign ' + this.props.name + ' to students'
            listHeaderText = "Student's who have access: "
            userHeaderText = 'Add Students'
            placeholderText = "Enter student's email addresses...."
            shareButtontext = 'Assign'
        }

        return (
            <Modal size="lg" open={this.props.open} toggle={this.props.toggle}>
            <ModalHeader>{headerText}</ModalHeader>
            <ModalBody>
                <ListGroup>
                    <ListGroupItemHeading>{listHeaderText} </ListGroupItemHeading>
                    {this.renderUserAccessList()}
                </ListGroup>
                <div className="addUsers">
                    <h4>{userHeaderText}</h4>
                    <ReactMultiEmail
                        placeholder={placeholderText}
                        emails={this.state.emails}
                        onChange={(enteredEmails) => this.setState({emails: enteredEmails})}
                        validateEmail={this.validateEmail}
                        getLabel={this.renderEmailItem}
                    />
                    <Button className='shareContent' onClick={() => this.shareContent()}>{shareButtontext}</Button>
                </div>
            </ModalBody>
            </Modal>
        );
    }
}

export default withAlert.withAlert(ShareModal)