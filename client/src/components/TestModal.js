import React from 'react'
import { Button, Modal, ModalBody, ModalHeader } from 'shards-react'

export default class TestModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = { open: false };
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            open: !this.state.open
        });
    }

    render() {
        const { open } = this.state;
        return (
            <div>
                <Button onClick={this.toggle}>Add New Test</Button>
                <Modal open={open} toggle={this.toggle}>
                    <ModalHeader>Header</ModalHeader>
                    <ModalBody>Hello World</ModalBody>
                </Modal>
            </div>
        );
    }
}
