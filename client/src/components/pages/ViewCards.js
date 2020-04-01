import React from 'react';
import {withRouter} from "react-router-dom"
import ReactCardFlip from 'react-card-flip';
import { Button, Card, Progress} from 'shards-react';
import './ViewCards.css';
import * as withAlert from "../HOC/ComponentWithAlert";
import withMenu from '../HOC/ComponentWithMenu';
import axios from 'axios';

class ViewCards extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
      isFlipped: false,
      cardIndex: 0,
      cards: [],
    };
    this.handleClick = this.handleClick.bind(this);
    this.restartDeck = this.restartDeck.bind(this);
    this.markDifficulty = this.markDifficulty.bind(this);
  }

  async componentDidMount() {
    if(!this.props.user.isAuthenticated) {
      this.props.history.replace("/");
      return;
    }

    try {
      const cardResponse = await axios.get('/api/viewCards', {
        params:{
          id: this.props.location.state.deckId
        } 
      });
      const flashcards = cardResponse.data.result;

      this.extract_cards_today(flashcards)
      
      document.addEventListener("keydown", this.handleKeyDown);
    } catch(error) {
      if(error.response.status === 401) {
        this.props.history.replace("/");
      }
      else {
          console.error(error);
          this.props.showAlert(withAlert.errorTheme, error.response.data.result);
      }
    }
  }

  async componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  get_date = (difficulty = null) => {
    var year = new Date().getFullYear()
    var month = new Date().getMonth()
    var date = new Date().getDate()
    var datetime = new Date(year, month, date)

    if(difficulty != null){
      if(difficulty == "EASY"){
        console.log("Easy button pressed")
        datetime.setDate(date + 3)
      }
      else if(difficulty == "MEDIUM"){
        console.log("Medium button pressed")
        datetime.setDate(date + 2)
      }
      else{
        console.log("Hard button pressed")
        datetime.setDate(date + 1)
      }
    }
    else{
      // Here to change which date set to view...
      datetime.setDate(date + 1)
    }

    return datetime
  }

  extract_cards_today = (flashcards) => {

    var datetime = this.get_date()

    // Necessary to get correct format
    datetime = datetime.getFullYear() + "-" + (datetime.getMonth() + 1) + "-" +  datetime.getDate()
    console.log("Adding cards with date: " + datetime)

    flashcards.forEach((card) => {
      // Splice studytime from query and reconstruct the string
      var studyTime = card.nextStudyTime
      var study_year = studyTime.slice(0,4)
      var study_month = studyTime.slice(6,7)
      var study_date1 = studyTime.slice(8,9)
      var study_date2 = studyTime.slice(9,10)
      if(study_date1 == 0){
        studyTime = study_year + '-' + study_month + '-' + study_date2;
      }
      else{
        studyTime = study_year + '-' + study_month + '-' + study_date1 + study_date2;
      }

      if(datetime == studyTime){
        this.setState({cards: [...this.state.cards, card]});
      }
    })
  }
 
  markDifficulty = async (event, difficulty) => {
    const currentCard = this.state.cardIndex
    event.preventDefault()
    const card_id = this.state.cards[currentCard].id
    const deck_id = this.state.cards[currentCard].deckId

    console.log("Marking card number " + card_id + " from deck " + deck_id + " with EASY...")
    var datetime = this.get_date(difficulty);

    datetime = datetime.getFullYear() + "-" + (datetime.getMonth() + 1) + "-" +  datetime.getDate()
    console.log(datetime)

    const json = {
      card_id: card_id,
      deck_id: deck_id,
      datetime: datetime,
      difficulty: difficulty
    }

    try{
      const response = await axios.post("/api/timestampCard", json)
      console.log(response)
      this.props.showAlert(withAlert.successTheme, "Timestamp added to card!");
    } catch(error){
      console.log(error);
      this.props.showAlert(withAlert.errorTheme, error.response.data.result);
    }

  }

  restartDeck = (e) => {
    this.setState({cardIndex: 0})
  }

  handleClick = (e) => {
    this.setState(prevState => ({ isFlipped: !prevState.isFlipped }));
  }

  handleKeyDown = (e) => {
    if(e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown'){
      this.setState(prevState => ({ isFlipped: !prevState.isFlipped }));
    }
    else if(e.key === 'ArrowRight'){
      if(this.state.cardIndex < this.state.cards.length){
        this.setState({cardIndex: this.state.cardIndex + 1})
      }
    }
    else if(e.key === 'ArrowLeft' && this.state.cardIndex > 0){
      this.setState({cardIndex: this.state.cardIndex - 1})  
    }
    
  }

  render(){
    if(this.state.cardIndex == this.state.cards.length){
      return(
        <div>
          <div id="progress-bar">
            <Progress theme="primary" value={(this.state.cardIndex/this.state.cards.length) * 100} />          
          </div>
          <div id="deck-complete">
            <h1>Great Work!</h1>
            <h3>You just studied {this.state.cards.length} cards!</h3>
            <Button onClick={this.restartDeck}>Study Again!</Button>
          </div>
          <Button>Study Next Deck?</Button>
        </div>
      );
    } else {
      return (
        <div>
          <div id="progress-bar">
            <Progress theme="primary" value={(this.state.cardIndex/this.state.cards.length) * 100} />          
          </div>
          <div className="flash-container">  
              <ReactCardFlip isFlipped={this.state.isFlipped} flipDirection="vertical">
                <Card className="flashcard" onClick={this.handleClick}>
                  {this.renderPrompt(this.state.cardIndex)}
                </Card >
                <Card className="flashcard" onClick={this.handleClick}>
                  {this.renderAnswer(this.state.cardIndex)}
                </Card>
              </ReactCardFlip>
              <div className="button-container">
                <Button className="difficulty-button" size="lg" theme="success" onClick={(e) => this.markDifficulty(e, "EASY")}>Easy</Button>
                <Button className="difficulty-button" size="lg" onClick={(e) => this.markDifficulty(e, "MEDIUM")}>Medium</Button>
                <Button className="difficulty-button" size="lg" theme="danger" onClick={(e) => this.markDifficulty(e, "HARD")}>Hard</Button>
              </div>
          </div>
        </div>

      );
    }
  }

  renderPrompt = (index) => {
    return(
      this.state.cards.slice(index, index+1).map(card => <h3>{card.prompt}</h3>)
    );

  }

  renderAnswer = (index) => {
    return (
      this.state.cards.slice(index, index+1).map(card => <h3>{card.answer}</h3>)
    );
  }

}

export default withMenu(withRouter(withAlert.withAlert(ViewCards)));