import React from 'react'

import { Button, Modal, ModalBody, ModalHeader, Form, FormInput } from 'shards-react'
import MultiSelect from "react-multi-select-component";
import Axios from 'axios';
import './CreateTest.css';


export default class TestModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            selected: [],
            options: [],
            testName: '',
            testDate: ""
        };

        this.toggle = this.toggle.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        

    }

    toggle() {
        this.setDate();
        this.setState({
            open: !this.state.open
        });
    }

    setDate = () => {
        var d = new Date();
        d = d - (d.getTimezoneOffset() * 60000);
        d = new Date(d);
        this.setState({
            testDate: d.toISOString().substr(0,19)
        });
    }

    onInputChange = event => {
        if (event.target.name === "testName") {
            this.setState({ testName: event.target.value });
        } else if (event.target.name === "testDate") {
            this.setState({ testDate: event.target.value });
        }
    }



    onSubmit = async event => {
        event.preventDefault();
        const testName = this.state.testName;
        const courseId = this.props.courseId;
        const testDate = this.state.testDate;
        const userEmail = this.props.userEmail;
        var decklist = {};
        this.state.selected.map(function (item) {
            decklist[item.value] = item.label;
        });

        decklist = JSON.stringify(decklist);

        const json = {
            name: testName,
            courseId: courseId,
            testDate: testDate,
            decklist: decklist,
            userEmail: userEmail
        };
        try {
            const response = await Axios.post("api/addTest", json);
            console.log(response.status);
            this.setDate();
            this.setState(
                {
                    selected: [],
                    options: [],
                    testName: '',
                }
            );
            console.log(this.state);
            this.props.submitCallback(0);
        } catch (error) {
            this.props.submitCallback(error);
        }
        this.toggle();
    }

    render() {
        const { open } = this.state;
        const options = this.props.options.map(function (item) {
            return {
                label: item.name,
                value: item.id
            }
        });
        var header = "New Test for " + this.props.coursename;

        return (
            <div>
                <Button onClick={this.toggle}>Add New Test</Button>
                <Modal size="lg" open={open} toggle={this.toggle}>
                    <ModalHeader>{header}</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.onSubmit}>
                            <FormInput name="testName" value={this.state.testName} onChange={this.onInputChange} placeholder="Test Name" />
                            <br/>
                            <MultiSelect
                                
                                options={options}
                                value={this.state.selected}
                                onChange={(val) => this.setState({ selected: val })}
                                overrideStrings={{ 'selectSomeItems': "Select Decks for Test" }} />  
                            <br/>                          
                            <FormInput name="testDate" value={this.state.testDate} onChange={this.onInputChange} type="datetime-local" />
                            <br/>
                            <Button type="submit">Submit</Button>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}
