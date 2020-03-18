import React, {Component} from "react";
import { Button, Form, FormInput, FormGroup } from "shards-react";
import './AddCourse.css';
import axios from "axios";
import * as withAlert from "./HOC/ComponentWithAlert";
import { TiDelete } from 'react-icons/ti';

class AddCourse extends Component {
  chpaterInputTitle = "Chapter Name";
  chapterInputToolTip = "Introduction to HTML";
  courseNameId = "courseName";
  invalidInputClassName = "is-invalid";

  constructor(props) {
    super(props);
    this.state = {
      coursename: '',
      //object of inputFormId : inputFormData
      //This stores data that the user types into the input fields
      chapterInfo: {},
    }
  }
  
  componentDidMount() {
    this.addChapterInput();
  }

  addChapterInput = () => {
    const currentKey = "chapter" + Object.keys(this.state.chapterInfo).length;
    const newChapterInfo = this.state.chapterInfo;
    newChapterInfo[currentKey] = '';
    this.setState({chapterInfo: newChapterInfo});
  }

  renderAllChapterInputs = () => {
    const chapterInfoArray = Object.keys(this.state.chapterInfo);
    return chapterInfoArray.map((chapterInputKey, index) => {
      return (
        <FormGroup key={chapterInputKey}>
          <label htmlFor={chapterInputKey}>{this.chpaterInputTitle}</label>
          <FormInput id={chapterInputKey} 
                     name="chapterInfo" 
                     onChange={this.onInputChange}
                     placeholder={this.chapterInputToolTip}
          />
          {index >= 1 && <TiDelete className="deleteChapter" id={index} onClick={(evt) => this.deleteChapter(evt, chapterInputKey)} size={"2em"}/>}
        </FormGroup>
      )
    });
  }

  onSubmit = async e => {
    e.preventDefault();

    if (!this.isValidInput()) {
      this.props.showAlert(withAlert.errorTheme, "Error some inputs are empty. Please remove or fill empty forms.")
      return;
    }
    
    const coursename =  this.state.coursename;
    const chapterInfo = this.state.chapterInfo;
    const chapterNames = Object.keys(chapterInfo).map((key) => chapterInfo[key]);

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
          chapterInfo: {}, 
        }, this.addChapterInput);
        this.props.showAlert(withAlert.successTheme, "Added Course");
    } catch (error) {
      console.error(error);
      this.props.showAlert(withAlert.errorTheme, error.response.data.result);
    }
  }

  isValidInput() {
    var validInput = true;
    const coursename =  this.state.coursename;
    
    var courseNameInput = document.getElementById(this.courseNameId);
    if (!coursename) {
      courseNameInput.className += ' ' + this.invalidInputClassName;
      validInput = false;
    }
    else {
      courseNameInput.classList.remove(this.invalidInputClassName);
    }
    
    const chapterInfo = this.state.chapterInfo;
    const chapterInfoArray = Object.keys(chapterInfo)
    for(var i = 0; i < chapterInfoArray.length; i++)  {
      const key = chapterInfoArray[i];
      var courseNameInput = document.getElementById(key);
      if(!chapterInfo[key]) {
        courseNameInput.className += ' ' + this.invalidInputClassName;
        validInput = false;
      }
      else {
        courseNameInput.classList.remove(this.invalidInputClassName);
      }
    }
    
    return validInput;
  }

  onInputChange = e => {
    if(e.target.name === "chapterInfo") {
      const chapterInfo = this.state.chapterInfo;
      chapterInfo[e.target.id] = e.target.value;
      this.setState({[e.target.name]: chapterInfo});
    } else {
      this.setState({[e.target.name]: e.target.value});
    }
  }

  deleteChapter = (e, id) => {
    console.log(e.target.id);
    const updatedChapterNames = this.state.chapterInfo;
    //delete property for that chapter name
    delete updatedChapterNames[id];
    this.setState({[e.target.name]: updatedChapterNames});
  }

  render() {
    return (
      <div>
        <Form id="courseInfo">
        <h1>Course Information</h1>
          <FormGroup id="courseNameGroup">
            <label htmlFor={this.courseNameId}>Course Name:</label>
            <FormInput id={this.courseNameId} name="coursename" onChange={this.onInputChange} value={this.state.coursename} placeholder="CMPT 470" />
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

export default withAlert.withAlert(AddCourse);