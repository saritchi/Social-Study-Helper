import React from 'react'
import { Button, Modal, ModalBody, ModalHeader, Form, FormInput } from 'shards-react'
import MultiSelect from "react-multi-select-component";
import Axios from 'axios';

export default class TestModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            selected: [],
            options: [],
            testName: '',
            testDate: "2020-01-01T00:00"
        };

        this.toggle = this.toggle.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        
    }

    toggle() {
        this.setState({
            open: !this.state.open
        });
    }

    onInputChange = event => {
        if (event.target.name === "testName") {
            this.setState({ testName: event.target.value });
            console.log(this.state.testName);
        } else if (event.target.name === "testDate") {
            this.setState({ testDate: event.target.value });
            console.log(this.state.testDate);
        }
    }



    onSubmit = async event => {
        event.preventDefault();
        // console.log(this.state.testName);
        // console.log(this.state.testDate);
        // console.log(this.state.selected);
        // console.log(this.props);

        const testName = this.state.testName;
        const courseId = this.props.courseId;
        const testDate = this.state.testDate;
        const userEmail = "placeholder@test.com"
        const decklist = {};
        this.state.selected.map(function (item) {
            decklist[item.value] = item.label;
        });

        const json = {
            name: testName,
            courseId: courseId,
            testDate: testDate,
            decklist: decklist,
            userEmail: userEmail
        };

        console.log(json);

        try {
            const response = await Axios.post("api/addTest", json);
            console.log(response.status);
            this.setState (
                {
                    selected: [],
                    options: [],
                    testName: '',
                    testDate: "2020-01-01T00:00"
                }
            );
        } catch (error){
            console.log(error);
        }
        console.log("Test Submitted");
    }

    render() {
        const { open } = this.state;
        const isExam = this.props.isExam;
        const options = this.props.options.map(function (item) {
            return {
                label: item.name,
                value: item.id
            }
        });
        var header = (isExam) ? "New Exam" : "New Test for " + this.props.coursename;
        if (!isExam) {

            return (
                <>
                    <Button onClick={this.toggle}>Add New Test</Button>
                    <Modal size="lg" open={open} toggle={this.toggle}>
                        <ModalHeader>{header}</ModalHeader>
                        <ModalBody>
                            <Form onSubmit={this.onSubmit}>
                                <FormInput name="testName" value={this.state.testName} onChange={this.onInputChange} placeholder="Test Name" />
                                <br />
                                <MultiSelect
                                    options={options}
                                    value={this.state.selected}
                                    onChange={(val) => this.setState({ selected: val })}
                                    labelledBy={"Select"}
                                    overrideStrings={{ 'selectSomeItems': "Select Decks for Test" }} />
                                <br />
                                <FormInput name="testDate" value={this.state.testDate} onChange={this.onInputChange} type="datetime-local" />
                                <br />
                                <Button type="submit">Submit</Button>
                            </Form>
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
