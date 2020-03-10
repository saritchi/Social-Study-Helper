import React, {Component} from "react";
import { Button, Form, FormInput, FormGroup } from "shards-react";
import EventAlert from './EventAlert';
import './AddCourse.css';
import axios from "axios";

export default class AddCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coursename: '',
      chapternames: {},
      chapters: [],
      showAlert: false,
      networkError: false,
      alertMessage: ''
    }
  }
  
  componentDidMount() {
    this.addChapterInput();
  }

  addChapterInput = () => {
    const numberOfChapters = this.state.chapters.length;
    const newChapters = [...this.state.chapters, this.renderChapterInput(numberOfChapters)];

    this.setState({chapters: newChapters})
    this.forceUpdate();
    console.log("added new chapter");
  }

  renderChapterInput = i => {
    const chapterId = "chapter" + i;
    
    let defaultValue = this.state.chapternames[chapterId];
    return (
      <FormGroup key={chapterId}>
        <label htmlFor={chapterId}>Chapter Name</label>
        <FormInput id={chapterId} 
                   name="chapternames" 
                   onChange={this.onInputChange} 
                   value={defaultValue} 
                   placeholder="Introduction to HTML"
          />
    </FormGroup>
    );
  }

  // renderAllChaptterInputs = () => {
  //   return this.state.chapters.map(chap => {
  //     const chapterId = "chapter" + i;
    
  //   let defaultValue = this.state.chapternames[chapterId];
  //   return (
  //     <FormGroup key={chapterId}>
  //       <label htmlFor={chapterId}>Chapter Name</label>
  //       <FormInput id={chapterId} 
  //                  name="chapternames" 
  //                  onChange={this.onInputChange} 
  //                  value={defaultValue} 
  //                  placeholder="Introduction to HTML"
  //         />
  //   </FormGroup>
  //   );
  //   })
  // }

  onSubmit = async e => {
    e.preventDefault();
    //TODO: check for empty valeus and change validation state 
    const coursename =  this.state.coursename;    
    const chaptersObject = this.state.chapternames;
    const chapternames = Object.keys(chaptersObject).map((key) => {
      return chaptersObject[key];
    });
    const json = {
      coursename: coursename,
      chapternames: chapternames,
    }

    console.log(json);
    try {
      const response = await axios.post("/api/addCourse", json);
      console.log(response.status);
      this.setState(
        {
          coursename: '', 
          chapternames: {}, 
          chapters: [],
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
    console.log("rendering...")
    const chapters = this.state.chapters;
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
          {chapters}
          <Button id="addChapter" onClick={this.addChapterInput}>Add Chapter</Button>
          <Button id="addCourse" onClick={this.onSubmit}>Add Course</Button>
        </Form>
      </div>
    );
  }
}
