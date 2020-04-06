import React from 'react'
import { Button, Modal, ModalBody, ModalHeader, Form, FormInput, FormSelect } from 'shards-react'
import MultiSelect from "react-multi-select-component";
import axios from 'axios';
import './CreateTest.css';


export default class TestModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            selected: [],
            deckOptions: [],
            options: [],
            courseId: 0,
            testName: '',
            testDate: "",
            invalidInput: false
        };

        this.toggle = this.toggle.bind(this);
        this.onSubmit = this.onSubmit.bind(this);


    }

    toggle() {
        this.initValues();
        this.setState({
            open: !this.state.open,
            courseId: this.props?.courseId
        });
    }

    initValues = async() => {
        var d = new Date();
        d = d - (d.getTimezoneOffset() * 60000);
        d = new Date(d);
        this.setState({
            testDate: d.toISOString().substr(0, 19)
        });
        if (!this.props.isHome) {
            await this.setState({
                deckOptions: this.props.deckOptions
            });
            this.getOptions();

        }
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
        const courseId = this.state.courseId;
        const testDate = this.state.testDate;
        const userEmail = this.props.userEmail;
        var decklist = {};
        this.state.selected.forEach(function (item) {
            decklist[item.value] = item.label;
        });

        if(courseId === 0) {
            this.setState({
                invalidInput: true
            })
            return;
        }

        decklist = JSON.stringify(decklist);

        const json = {
            name: testName,
            courseId: courseId,
            testDate: testDate,
            decklist: decklist,
            userEmail: userEmail
        };
        try {
            const response = await axios.post("api/addTest", json);
            console.log(response.status);
            this.initValues();
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

    changeCourse = async event => {
        const courseId = event.target.value;
        const deckResponse = await axios.get('/api/decks', {
            params: {
                id: courseId,
            }
        });
        this.setState({
            deckOptions: deckResponse.data.result,
            courseId: courseId,
            selected: [],
            invalidInput: false
        })
        this.getOptions();
    }

    getOptions = () => {
        var options = this.state.deckOptions.map(function (item) {
            return {
                label: item.name,
                value: item.id
            }
        });
        this.setState({
            options: options
        })
    }

    render() {
        const { open } = this.state;
        var header = this.props.isHome ? "New Test" : "New Test for " + this.props.coursename;
        let courseSelect;
        if (this.props.isHome) {
            courseSelect = <FormSelect onChange={this.changeCourse} invalid={this.state.invalidInput}>
                <option key={0} value={0}>Please select a course</option>
                {this.props.courseOptions.map(courseInfo =>
                    <option key={courseInfo.id} value={courseInfo.id}>{courseInfo.name}</option>)}
            </FormSelect>
        }
        else {
            courseSelect = <></>;
        }

        return (
            <div>
                <Button onClick={this.toggle} theme="info">Add New Test</Button>
                <Modal size="lg" open={open} toggle={this.toggle}>
                    <ModalHeader>{header}</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.onSubmit}>
                            <FormInput name="testName" value={this.state.testName} onChange={this.onInputChange} placeholder="Test Name" />
                            <br/>
                            {courseSelect}
                            <br/>
                            <br/>
                            <MultiSelect
                                options={this.state.options}
                                value={this.state.selected}
                                onChange={(val) => this.setState({ selected: val })}
                                overrideStrings={{ 'selectSomeItems': "Select Decks for Test" }} />
                            <br />
                            <FormInput name="testDate" value={this.state.testDate} onChange={this.onInputChange} type="datetime-local" />
                            <br/>
                            <Button type="submit" theme="success">Submit</Button>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}
