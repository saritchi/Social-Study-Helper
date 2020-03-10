import React, {Component} from "react";
import { Button, Form, FormInput, FormGroup } from "shards-react";
import EventAlert from './EventAlert';
import './AddCourse.css';
import axios from "axios";

export default class AddCourse extends Component {
  chpaterInputTitle = "Chapter Name";
  chapterInputToolTip = "Introduction to HTML";

  constructor(props) {
    super(props);
    this.state = {
      coursename: '',
      chapternames: {},
      chapterInputs: [],
      showAlert: false,
      networkError: false,
      alertMessage: ''
    }
  }
  
  componentDidMount() {
    this.addChapterInput();
  }

  addChapterInput = () => {
    const newChapterInputs = [...this.state.chapterInputs, {name: this.chpaterInputTitle, toolTip: this.chapterInputToolTip}];
    this.setState({chapterInputs: newChapterInputs});
  }

  renderAllChapterInputs = () => {
    return this.state.chapterInputs.map((chapterInput, index) => {
      const chapterId = "chapter" + index;
      return (
        <FormGroup key={chapterId}>
          <label htmlFor={chapterId}>{chapterInput.name}</label>
          <FormInput id={chapterId} 
                     name="chapternames" 
                     onChange={this.onInputChange} 
                     placeholder={chapterInput.toolTip}
            />
        </FormGroup>
      )
    });
  }

  onSubmit = async e => {
    e.preventDefault();
    //TODO: check for empty values and change validation state 
    const coursename =  this.state.coursename;    
    const chapterNamesObjects = this.state.chapternames;
    const chapterNames = Object.keys(chapterNamesObjects).map((key) => {
      return chapterNamesObjects[key];
    });
    const json = {
      coursename: coursename,
      chapters: chapterNames,
    }

    console.log(json);
    try {
      const response = await axios.post("/api/addCourse", json);
      console.log(response.status);
      this.setState(
        {
          coursename: '', 
          chapternames: {}, 
          chapterInputs: [],
          showAlert: true,
          networkError: false,
          alertMessage: "Added Course"
        }, this.addChapterInput);
    } catch (error) {
      console.error(error);
      this.setState(
        {
          showAlert: true,
          networkError: true,
          alertMessage: error.response.data.result,
        });
    }
  }

  onInputChange = e => {
    if(e.target.name === "chapternames") {
      const chapterNames = this.state.chapternames;
      chapterNames[e.target.id] = e.target.value;
      this.setState({[e.target.name]: chapterNames});
    } else {
      this.setState({[e.target.name]: e.target.value});
    }
  }

  

  dismissAlert = () => {
    this.setState({showAlert: false});
  }

  render() {
    const visible = this.state.showAlert;
    const theme = this.state.networkError ? "danger" : "success";
    const messasge = this.state.alertMessage;

    return (
      <div>
        <EventAlert visible={visible} dismissAlert={this.dismissAlert} theme={theme} message={messasge} />
        <Form id="courseInfo">
        <h1>Course Information</h1>
          <FormGroup>
            <label htmlFor="courseName">Course Name:</label>
            <FormInput id="courseName" name="coursename" onChange={this.onInputChange} value={this.state.coursename} placeholder="CMPT 470" />
          </FormGroup>

          <h2>Chapters:</h2>
          {this.renderAllChapterInputs()}
          <Button id="addChapter" onClick={this.addChapterInput}>Add Chapter</Button>
          <Button id="addCourse" onClick={this.onSubmit}>Add Course</Button>
        </Form>
      </div>
    );
  }
}
