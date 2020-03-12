import React, {Component} from "react";
import { Button, Form, FormInput, FormGroup } from "shards-react";
import './AddCourse.css';
import axios from "axios";
import './ComponentWithAlert';
import * as withAlert from "./ComponentWithAlert";
import { TiDelete } from 'react-icons/ti';

//TODO: needs a way to remove added chapters in case of mistakes
class AddCourse extends Component {
  chpaterInputTitle = "Chapter Name";
  chapterInputToolTip = "Introduction to HTML";

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
    //TODO: check for empty values and change validation state 
    const coursename =  this.state.coursename;    
    const chapterNamesObject = this.state.chapterInfo;
    const chapterNames = Object.keys(chapterNamesObject).map((key) => chapterNamesObject[key]);
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

export default withAlert.withAlert(AddCourse);