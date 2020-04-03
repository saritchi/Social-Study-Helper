import React, { Component } from "react";
import { Modal, Button, ModalBody, ModalHeader, FormGroup, FormTextarea, FormInput } from "shards-react";

class NewMessageModal extends Component {
    state = { 
        recipientEmail: '',
        message: ''
    };

    onChange = e => {
        this.setState({[e.target.name]: e.target.value})
    }
    
    render() {
        return (
            <div>
                
                <Modal size="md" open={this.props.open} toggle={this.props.toggle}>
                    <ModalHeader>New Message</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <label htmlFor="recipientEmail">Recipient Email</label>
                            <FormInput id="recipientEmail" name="recipientEmail" onChange={this.onChange}/>
                            <label htmlFor="message">Message</label>
                            <FormTextarea id="message" name="message" onChange={this.onChange}/>
                        </FormGroup>
                    </ModalBody>
                <Button onClick={() => this.props.sendMessage(this.state.recipientEmail, this.state.message)}>Send</Button>
                </Modal>
            </div>
        );
    }
}

export default NewMessageModal