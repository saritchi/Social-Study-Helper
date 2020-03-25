import React, { Component } from "react";
import { Modal, Button, ModalBody, ModalHeader } from "shards-react";
import { ReactMultiEmail, isEmail } from 'react-multi-email';
import 'react-multi-email/style.css';
import './ShareModal.css'

export default class ShareModal extends Component {
    state = { 
        emails: []
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

    render() {
        return (
            <Modal size="lg" open={this.props.open} toggle={this.props.toggle}>
            <ModalHeader>Share with others</ModalHeader>
            <ModalBody>
                <p>Add all the emails you want to share {this.props.name} with.</p>
                <h4>Emails:</h4>
                    <ReactMultiEmail
                        placeholder="Enter emal addresses...."
                        emails={this.state.emails}
                        validateEmail={email => isEmail(email)}
                        getLabel={this.renderEmailItem}
                    />
                    <Button className='shareContent'>Share</Button>
            </ModalBody>
            </Modal>
        );
    }
}

