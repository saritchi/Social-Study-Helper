import React from 'react';
import { withRouter } from "react-router-dom"
import ReactCardFlip from 'react-card-flip';
import { Button, Card, Progress } from 'shards-react';
import { TiMediaPlay, TiMediaPlayReverse } from 'react-icons/ti';
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
      deck_end: false,
      difficulty_selected: []
    };
  }

  async componentDidMount() {
    if (!this.props.user.isAuthenticated) {
      this.props.history.replace("/");
      return;
    }

    try {
      const cardResponse = await axios.get('/api/viewCards', {
        params: {
          id: this.props.location.state.deckId
        }
      });

      const flashcards = cardResponse.data.result;
      if(this.firsttime_study(flashcards)){
        this.setState({cards: flashcards});
      }
      else{
        this.extract_cards_today(flashcards)
      }

      document.addEventListener("keydown", this.handleKeyDown);

    } catch (error) {
      if (error.response.status === 401) {
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

    switch (difficulty){
      case "EASY":
        console.log("Easy button pressed")
        datetime.setDate(date + 3)
        break;
      case "MEDIUM":
        console.log("Medium button pressed")
        datetime.setDate(date + 2)
        break;
      case "HARD":
        console.log("Hard button pressed")
        datetime.setDate(date + 1)
        break;
      case null:
        // Here to change which date set to view when PULLING cards from db
        datetime.setDate(date + 1)
    }

    return datetime
  }

  extract_cards_today = (flashcards) => {
    var datetime = this.get_date()
    var results = this.state.cards
    var difficulty_check = this.state.difficulty_selected
    // Necessary to get correct format
    datetime = datetime.getFullYear() + "-" + (datetime.getMonth() + 1) + "-" + datetime.getDate()
    console.log("Adding cards with date: " + datetime)

    flashcards.forEach((card) => {
      // Splice studytime from query and reconstruct the string
      console.log(card)
      
      if(card.nextStudyTime != null){
        var studyTime = card.nextStudyTime
        var study_year = studyTime.slice(0, 4)
        var study_month = studyTime.slice(6, 7)
        var study_date1 = studyTime.slice(8, 9)
        var study_date2 = studyTime.slice(9, 10)
        if (study_date1 == 0) {
          studyTime = study_year + '-' + study_month + '-' + study_date2;
        }
        else {
          studyTime = study_year + '-' + study_month + '-' + study_date1 + study_date2;
        }
  
        if (datetime == studyTime) {
          results.push(card)
          difficulty_check.push(false)
        }
      }

    })
    this.setState({ cards: results , difficulty_selected: difficulty_check});
  }

  firsttime_study = (flashcards) => {
    var viewed = true;
    var difficulty_check = this.state.difficulty_selected
    flashcards.forEach((card) => {
      difficulty_check.push(false)
      if(card.nextStudyTime != null){
        console.log("Cards have been viewed before")
        viewed = false
      }
    })
    if(viewed == true){
      this.setState({ difficulty_selected: difficulty_check })
    }
    return viewed
  }


  markDifficulty = async (event, difficulty) => {
    const difficulty_check = this.state.difficulty_selected
    const currentCard = this.state.cardIndex
    
    difficulty_check[currentCard] = true
    this.setState({ difficulty_selected: difficulty_check })

    event.preventDefault()
    const card_id = this.state.cards[currentCard].id
    const deck_id = this.state.cards[currentCard].deckId

    var datetime = this.get_date(difficulty);

    datetime = datetime.getFullYear() + "-" + (datetime.getMonth() + 1) + "-" + datetime.getDate()

    const json = {
      card_id: card_id,
      deck_id: deck_id,
      datetime: datetime,
      difficulty: difficulty
    }

    try {
      const response = await axios.post("/api/timestampCard", json)
      console.log(response)
      this.props.showAlert(withAlert.successTheme, "Timestamp added to card!");
    } catch (error) {
      console.log(error);
      this.props.showAlert(withAlert.errorTheme, error.response.data.result);
    }

  }

  restartDeck = (e) => {
    this.setState({ cardIndex: 0, deck_end: false })
  }

  handleClick = (e) => {
    this.setState(prevState => ({ isFlipped: !prevState.isFlipped }));
  }

  increment_index = () => {
    const difficulty_check = this.state.difficulty_selected;
    if(difficulty_check[this.state.cardIndex] == false){
      this.props.showAlert(withAlert.errorTheme, "Please select a difficulty for the card!");
      return;
    }
    if (this.state.cardIndex < this.state.cards.length) {
      this.setState({ cardIndex: this.state.cardIndex + 1 }, () => {
        if (this.state.cardIndex == this.state.cards.length) {
          this.setState({ deck_end: true })
        }
      })
    }
    console.log(this.state.cardIndex)
  }

  decrement_index = () => {
    if (this.state.cardIndex > 0) {
      this.setState({ cardIndex: this.state.cardIndex - 1 }, () => {
        if (this.state.cardIndex < this.state.cards.length) {
          this.setState({ deck_end: false })
        }
      })
    }
  }

  updateCard = (type) => {
    if (type === "NEXT") {
      this.increment_index()
    }
    else if (type === "BACK" && this.state.cardIndex > 0) {
      this.decrement_index()
    }
  }

  handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      this.setState(prevState => ({ isFlipped: !prevState.isFlipped }));
    }
    else if (e.key === 'ArrowRight') {
      this.increment_index()
    }
    else if (e.key === 'ArrowLeft') {
      this.decrement_index()
    }
  }

  render() {
    if (this.state.deck_end == true) {
      return (
        <div>
          <div id="progress-bar">
            <Progress theme="primary" value={(this.state.cardIndex + 1 / this.state.cards.length) * 100} />
            <p>Done!</p>
          </div>
          <div className="flash-container">
            <Card className="flashcard-done">
              <h1>Great Work!</h1>
              <h3>You just studied {this.state.cards.length} card(s)!</h3>
              <Button onClick={this.restartDeck} block>Study Again!</Button>
              <Button block>Finish</Button>
            </Card>

            <div className="switch-card-button">
              <Button id="button-click" theme="secondary" onClick={() => { this.updateCard("BACK") }}>
                <TiMediaPlayReverse size={30} />
              </Button>
              <Button id="button-click" theme="secondary" disabled onClick={() => { this.updateCard("NEXT") }}>
                <TiMediaPlay size={30} />
              </Button>
            </div>
          </div>
        </div>
      );
    }
    else {
      return (
        <div>
          
          <div id="progress-bar">
            <Progress theme="primary" value={((this.state.cardIndex + 1)  / this.state.cards.length) * 100} />
            <p>{this.state.cardIndex + 1 + "/" + this.state.cards.length}</p>
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

            <div className="switch-card-button">
              <Button id="button-click" theme="secondary" disabled={this.state.cardIndex == 0} onClick={() => { this.updateCard("BACK") }}>
                <TiMediaPlayReverse size={30} />
              </Button>
              <Button id="button-click" theme="secondary" onClick={() => { this.updateCard("NEXT") }}>
                <TiMediaPlay size={30} />
              </Button>
            </div>
          </div>
          <div>
            <div className="difficulty-button-container">
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
    return (
      this.state.cards.slice(index, index + 1).map(card => <h3>{card.prompt}</h3>)
    );

  }

  renderAnswer = (index) => {
    return (
      this.state.cards.slice(index, index + 1).map(card => <h3>{card.answer}</h3>)
    );
  }

}

export default withMenu(withRouter(withAlert.withAlert(ViewCards)));