import React from 'react';
import {withRouter} from "react-router-dom"
import ReactCardFlip from 'react-card-flip';
import { Button, Progress} from 'shards-react';
import './ViewCards.css';
import * as withAlert from "./ComponentWithAlert";
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
    try {
      const cardResponse = await axios.get('/api/viewCards', {
        params:{
          id: this.props.location.state.deckId
        } 
      });
      const flashcards = cardResponse.data.result;
      flashcards.forEach((card) => {
        console.log(card);
      })
      this.setState({cards: flashcards});
      document.addEventListener("keydown", this.handleKeyDown);
    } catch(error) {
      console.error(error);
      this.props.showAlert(withAlert.errorTheme, error.response.data.result);
    }
  }

  async componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }
 
  markDifficulty = async (event, difficulty) => {
    const currentCard = this.state.cardIndex
    event.preventDefault()
    const card_id = this.state.cards[currentCard].id
    const deck_id = this.state.cards[currentCard].deckId
    console.log("Marking card number " + card_id + " from deck " + deck_id + " with EASY...")
    var year = new Date().getFullYear()
    var month = new Date().getMonth()
    var date = new Date().getDate()
    var datetime = new Date(year, month, date)
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
                <div id="flashcard" onClick={this.handleClick}>
                  {this.renderPrompt(this.state.cardIndex)}
                </div >
                <div id="flashcard" onClick={this.handleClick}>
                  {this.renderAnswer(this.state.cardIndex)}
                </div>
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
      this.state.cards.slice(index, index+1).map(card => <p>{card.prompt}</p>)
    );

  }

  renderAnswer = (index) => {
    return (
      this.state.cards.slice(index, index+1).map(card => <p>{card.answer}</p>)
    );
  }

}

export default withRouter(withAlert.withAlert(ViewCards));