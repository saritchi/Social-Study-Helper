import React from 'react'
import { Button, Modal, ModalBody, ModalHeader } from 'shards-react'
import MultiSelect from "react-multi-select-component";

export default class TestModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            selected: [],
            setSelected: []
        };
        var coursename = null;
        const isExam = true;
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            open: !this.state.open
        });
    }


    
    render() {
        const { open } = this.state;
        const isExam = this.props.isExam;
        const options = [
            { label: "test1", value: "T1"},
            { label: "test2", value: "T2"},
            { label: "test3", value: "T3"},
            { label: "test4", value: "T4"},
        ];
        var selected = [];

        var header = (isExam) ? "New Test" : "New Test for " + this.props.coursename;
        console.log(header);
        if (!isExam) {

            return (
                <>
                    <Button onClick={this.toggle}>Add New Test</Button>
                    <Modal size="lg" open={open} toggle={this.toggle}>
                        <ModalHeader>{header}</ModalHeader>
                        <ModalBody>
                            <h3>Decks</h3>
                            <pre>{JSON.stringify(this.state.selected)}</pre>
                            <MultiSelect
                                options={options}
                                value={this.state.selected}
                                onChange={(temp) => {this.setState({selected: temp})}}
                                labelledBy={"Select Decks for test"}>
                            </MultiSelect>
                        </ModalBody>
                    </Modal>
                </>
            );
        }
        else {

            return (
                <>
                    <Button onClick={this.toggle}>Add New Test</Button>
                    <Modal size="lg" open={open} toggle={this.toggle}>
                        <ModalHeader>EXAM</ModalHeader>
                        <ModalBody>
                            !!!
                    </ModalBody>
                    </Modal>
                </>
            );
        }
    }
}
