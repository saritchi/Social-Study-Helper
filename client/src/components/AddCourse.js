import React, {Component} from "react";
import { Button, Form, FormInput, FormGroup } from "shards-react";
import './AddCourse.css'

export default class AddCourse extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chapters: Array(1).fill(this.renderChapterInput(0)),
    }
  }

  addChapterInput() {
    const numberOfChapters = this.state.chapters.length;
    const newChapters = [...this.state.chapters, this.renderChapterInput(numberOfChapters)];

    this.setState({chapters: newChapters})
  }

  renderChapterInput(i) {
    const chapterId = "#chapter" + i;
    return (
      <FormGroup>
        <label htmlFor={chapterId}>Chapter Name</label>
        <FormInput id={chapterId} placeholder="Introduction to HTML" />
    </FormGroup>
    );
  }

  render() {
    const chapters = this.state.chapters;
    return (
      <div>
        <h1>Course Information</h1>
        <Form id="courseInfo">
          <FormGroup>
            <label htmlFor="#courseName">Course Name:</label>
            <FormInput id="#courseName" placeholder="CMPT 470" />
          </FormGroup>

          <h2>Chapters:</h2>
          {this.state.chapters}
          <Button id="addChapter" onClick={() => this.addChapterInput()}>Add Chapter</Button>
          <Button id="addCourse" >Add Course</Button>
        </Form>
      </div>
    );
  }
}
