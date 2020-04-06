import React, { Component } from "react";
import { Modal, Button, ModalBody, ModalHeader, FormGroup, FormTextarea } from "shards-react";
import './NewMessageModal.css'
import { ReactMultiEmail, isEmail } from "react-multi-email";

//The code for this was adapted from herer: https://www.npmjs.com/package/react-multi-email
class NewMessageModal extends Component {
    state = { 
        recipientEmails: [],
        message: ''
    };

    onChange = e => {
        this.setState({[e.target.name]: e.target.value})
    }

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

    //when send message button send the request to the server and close the modal
    sendMessage = () => {
        this.props.sendMessage(this.state.recipientEmails, this.state.message)
        this.setState({recipientEmails: []})
    }

    render() {
        return (
            <div>
                
                <Modal size="lg" open={this.props.open} toggle={this.props.toggle}>
                    <ModalHeader>New Message</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                             <h4>Add Users Emails</h4>
                            <ReactMultiEmail
                                placeholder="Enter email addresses...."
                                emails={this.state.recipientEmails}
                                onChange={(enteredEmails) => this.setState({recipientEmails: enteredEmails})}
                                validateEmail={(email => isEmail(email))}
                                getLabel={this.renderEmailItem}
                            />
                            <label htmlFor="message">Message</label>
                            <FormTextarea id="message" name="message" onChange={this.onChange}/>
                        </FormGroup>
                    </ModalBody>
                    <Button id='sendInitialMessage' onClick={() => this.sendMessage(this.state.recipientEmail, this.state.message)} theme="info">Send Message</Button>
                </Modal>
            </div>
        );
    }
}

export default NewMessageModal