import React, {Component} from "react";
import { withRouter } from "react-router-dom"
import { Button, Col, Container, Form, FormInput, FormGroup, Row} from "shards-react";
import './AddCourse.css';
import axios from "axios";
import * as withAlert from "../HOC/ComponentWithAlert";
import withMenu from '../HOC/ComponentWithMenu';
import BackButton from '../subcomponents/BackButton'
import { TiDelete } from 'react-icons/ti';

class AddCourse extends Component {
  deckInputTitle = "Deck Name";
  deckInputToolTip = "Introduction to HTML";
  courseNameId = "courseName";
  invalidInputClassName = "is-invalid";

  constructor(props) {
    super(props);
    this.state = {
      coursename: '',
      //object of inputFormId : inputFormData
      //This stores data that the user types into the input fields
      //TODO: need to update when UI can select an midterm/final/test day.
      deckInfo: {},
      giveWarning: false,
      modal_open: false
    }
  }
  
  componentDidMount() {
    if(!this.props.user.isAuthenticated) {
      this.props.history.replace("/");
      return;
    }

    this.addDeckInput();
  }

  goBack = () => {
    this.props.history.goBack();
}

  toggle_modal = () => {
    this.setState({
      modal_open: !this.state.modal_open
    });
}

  addDeckInput = () => {
    const currentKey = "deck" + Object.keys(this.state.deckInfo).length;
    const newDeckInfo = this.state.deckInfo;
    newDeckInfo[currentKey] = '';
    this.setState({deckInfo: newDeckInfo});
  }

  renderAllDeckInputs = () => {
    const deckInfoArray = Object.keys(this.state.deckInfo);
    return deckInfoArray.map((deckInputKey, index) => {
      return (
        <FormGroup key={deckInputKey}>
          <Container id="deck-inputs">
            <Row>
              <Col>
                <label className="input-headers" htmlFor={deckInputKey}>{this.deckInputTitle}</label>
                <FormInput id={deckInputKey} onChange={this.onInputChange} placeholder={this.deckInputToolTip} name="deckInfo"/>
              </Col>
              {index >= 0 && <TiDelete className="deleteDeck" id={index} onClick={(evt) => this.deleteChapter(evt, deckInputKey)} size={"2em"}/>}
              
            </Row>
          </Container>
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
    const deckInfo = this.state.deckInfo;
    //TODO: need to update when UI can select an midterm/final/test day.
    const decknames = Object.keys(deckInfo).map((key) => deckInfo[key]);

    const json = {
      coursename: coursename,
      decks: decknames,
      email: this.props.user.email,
      lastAccess: new Date().toISOString().slice(0, 19).replace('T', ' '),
    }

    console.log(json);
    try {
      await axios.post("/api/addCourse", json);
      this.setState(
        {
          coursename: '', 
          deckInfo: {}, 
        }, this.addDeckInput);
        this.props.showAlert(withAlert.successTheme, "Added Course");
        this.props.history.goBack();
    } catch (error) {
      if(error.response.status === 401) {
        this.props.history.replace("/");
      }
      else {
          console.error(error);
          this.props.showAlert(withAlert.errorTheme, error.response.data.result);
      }
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
    
    const deckInfo = this.state.deckInfo;
    const deckInfoArray = Object.keys(deckInfo)
    for(var i = 0; i < deckInfoArray.length; i++)  {
      const key = deckInfoArray[i];
      var decknameInput = document.getElementById(key);
      if(!deckInfo[key]) {
        decknameInput.className += ' ' + this.invalidInputClassName;
        validInput = false;
      }
      else {
        decknameInput.classList.remove(this.invalidInputClassName);
      }
    }
    
    return validInput;
  }

  onInputChange = e => {
    if(this.state.giveWarning === false){
      this.setState({giveWarning: true})
    }
    if(e.target.name === "deckInfo") {
      const deckInfo = this.state.deckInfo;
      deckInfo[e.target.id] = e.target.value;
      this.setState({[e.target.name]: deckInfo});
    } else {
      this.setState({[e.target.name]: e.target.value});
    }
  }

  deleteChapter = (e, id) => {
    console.log(e.target.id);
    const updatedDeckNames = this.state.deckInfo;
    //delete property for that chapter name
    delete updatedDeckNames[id];
    this.setState({[e.target.name]: updatedDeckNames});
  }

  render() {
    return (
      <div>
        <div>
          <BackButton page="Home" 
                      goback={this.goBack} 
                      toggle={this.toggle_modal} 
                      open={this.state.modal_open} 
                      warning={this.state.giveWarning}
          />
        </div>
        <Container id="newCourseHeading"><h4>Course Information: </h4></Container>
        <Form id="courseInfo">
          <Container>
            <label className="input-headers" htmlFor={this.courseNameId}><h5>Course Name</h5></label>
            <FormInput id={this.courseNameId} name="coursename" onChange={this.onInputChange} value={this.state.coursename} placeholder="CMPT 470"/>
          </Container>    

          {/* <h5>Decks:</h5> */}
          {this.renderAllDeckInputs()}
          <Button id="addDeck" onClick={this.addDeckInput} theme="info" block size="lg">Add Deck</Button>
          <br></br>
          <Button id="addCourse" onClick={this.onSubmit} theme="success" size="lg">Done</Button>
        </Form>
      </div>
    );
  }
}

export default withMenu(withRouter(withAlert.withAlert(AddCourse)));