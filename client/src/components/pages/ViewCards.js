import React from 'react';
import { withRouter } from "react-router-dom"
import ReactCardFlip from 'react-card-flip';
import { Button, Card, Progress} from 'shards-react';
import './ViewCards.css';
import * as withAlert from "../HOC/ComponentWithAlert";
import withMenu from '../HOC/ComponentWithMenu';
import DifficultButtons from "../subcomponents/DifficultyOptions"
import ChangeCardButtons from "../subcomponents/ChangeCardButtons"
import PopOverButtonGroup from "../subcomponents/PopOverViewCards"
import BackButton from '../subcomponents/BackButton'
import axios from 'axios';

class ViewCards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFlipped: false,
      view_all: null,
      open_toggle: false,
      cardIndex: 0,
      all_cards: [],
      today_cards: [],
      cards: [],
      difficulty_selected: [],
      user_role: props.user.role
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
      if(this.has_studied(flashcards)){
        this.setState({all_cards: flashcards, cards: flashcards, today_cards: flashcards});
      }
      else{
        this.extract_cards_today(flashcards)
      }

      if(!this.state.cards.length){
        this.setState({cards: this.state.all_cards, view_all: true});
      }

      if(this.props.user.role === "teacher"){
        this.setState({view_all: true});
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

  // Returns the current date. If a difficulty button is pressed
  // it adds a corresponding value to the days depending on difficulty
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
      default:
        // Here to change which date set to view when PULLING cards from db
        datetime.setDate(date)
    }

    return datetime
  }

  // Extract cards from query where nextStudyTime is 'today'
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
        if (study_date1 === '0') {
          studyTime = study_year + '-' + study_month + '-' + study_date2;
        }
        else {
          studyTime = study_year + '-' + study_month + '-' + study_date1 + study_date2;
        }
  
        if (datetime === studyTime) {
          results.push(card)
          difficulty_check.push(false)
        }
      }

    })
    this.setState({ all_cards: flashcards, cards: results , today_cards: results, difficulty_selected: difficulty_check});
  }

  // Checks to see if cards have been studied yet. Used to determine
  // if all cards have nextStudyTime == null. If all null all cards need to be studied.
  has_studied = (flashcards) => {
    var not_studied = true;
    var difficulty_check = this.state.difficulty_selected
    flashcards.forEach((card) => {
      difficulty_check.push(false)
      if(card.nextStudyTime != null){
        console.log("Deck has been viewed before")
        not_studied = false
      }
    })
    if(not_studied){
      this.setState({ difficulty_selected: difficulty_check })
    }
    return not_studied
  }

  // Updates nextStudyTime is Cards table. When a difficulty button is pressed
  // it will increment cardIndex and submit query.  
  markDifficulty = async (event, difficulty) => {
    event.preventDefault()
    const difficulty_check = this.state.difficulty_selected
    const currentCard = this.state.cardIndex
    const card_id = this.state.cards[currentCard].id
    const deck_id = this.state.cards[currentCard].deckId
    
    difficulty_check[currentCard] = true
    this.setState({ difficulty_selected: difficulty_check })

    this.increment_index()

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
    } catch (error) {
      console.log(error);
      this.props.showAlert(withAlert.errorTheme, error.response.data.result);
    }

  }

  // Return to previous page
  goBack = (e) => {
    this.props.history.goBack();
  }

  restartDeck = (e) => {
    this.setState({ cardIndex: 0})
    document.addEventListener("keydown", this.handleKeyDown);
  }

  increment_index = () => {
    const difficulty_check = this.state.difficulty_selected;
    if(difficulty_check[this.state.cardIndex] === false && this.state.view_all === false){
      return;
    }

    if (this.state.cardIndex < this.state.cards.length) {
      this.setState({ cardIndex: this.state.cardIndex + 1 }, () => {
        if (this.state.cardIndex === this.state.cards.length) {
          document.removeEventListener("keydown", this.handleKeyDown);
        }
      })
    }
  }

  decrement_index = () => {
    if (this.state.cardIndex > 0) {
      this.setState({ cardIndex: this.state.cardIndex - 1 })
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

  // Flip Flashcard if clicked
  handleClick = (e) => {
    this.setState(prevState => ({ isFlipped: !prevState.isFlipped }));
  }

  // Hotkeys to change/flip flashcard
  handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      this.setState(prevState => ({ isFlipped: !prevState.isFlipped }));
    }
    else if (e.key === 'ArrowRight' && this.state.view_all) {
      this.increment_index()
    }
    else if (e.key === 'ArrowLeft' && this.state.view_all) {
      this.decrement_index()
    }
  }

  toggle_popover = () => {
    this.setState({ open_toggle: !this.state.open_toggle });
  }

  // Show flashcards required for studying today
  viewToday = () => {
    console.log("Viewing Today's cards...")
    if(this.state.today_cards.length === 0){
      this.toggle_popover()
      return;
    }
    this.setState({ view_all: false, cardIndex: 0, cards: this.state.today_cards})
  }

  // Show all flashcards
  viewAll = () => {
    console.log("Viewing All cards...")
    this.setState({ view_all: true, cardIndex: 0, cards: this.state.all_cards})
  }

  renderPrompt = (index) => {
    return (
      this.state.cards.slice(index, index + 1).map(card => <h3 key={'prompt' + index}>{card.prompt}</h3>)
    );

  }

  renderAnswer = (index) => {
    return (
      this.state.cards.slice(index, index + 1).map(card => <p key={'answer' + index}>{card.answer}</p>)
    );
  }

  render() {
    if (this.state.cardIndex === this.state.cards.length) {
      return (
        <div>
          <div id="progress-bar">
            <Progress theme="primary" value={100} />
            <p>Done!</p>
          </div>
          <div className="flash-container">
            <Card className="flashcard-done">
              <h2>Great Work!</h2>
              <h4>You just studied {this.state.cards.length} card(s)!</h4>
              <div id="end-deck-buttons">
                <Button onClick={this.restartDeck} block theme="info">Study Again!</Button>
                <Button onClick={this.goBack} block theme="success">Finish</Button>
              </div>
            </Card>
          </div>
        </div>
      );
    }
    else if(this.state.cards.length && !this.state.cards[0].prompt && !this.state.cards[0].answer){
      return(
        <div>
          <div className="flash-container">
            <Card className="flashcard-done">
              <h3>There are no cards in this deck...</h3>
              <div id="end-deck-buttons">
                <Button onClick={this.goBack} block theme="info">Go Back</Button>
              </div>
            </Card>
          </div>
        </div>
      )
    }
    else {
      return (
        <div id="test">
          <div id="progress-bar">
            <Progress theme="primary" value={((this.state.cardIndex + 1)  / this.state.cards.length) * 100} />
            <p>{this.state.cardIndex + 1 + "/" + this.state.cards.length}</p>
          </div>
          <div>
            <BackButton page="Decks" goback={this.goBack} />
          </div>

          <PopOverButtonGroup function_today={this.viewToday} 
                              function_all={this.viewAll} 
                              function_toggle={this.toggle_popover} 
                              open={this.state.open_toggle}
                              view={this.state.view_all}
                              user_role={this.state.user_role}/>
          
          <div className="flash-container">
            <ReactCardFlip isFlipped={this.state.isFlipped} flipDirection="vertical">
              <Card className="flashcard" onClick={this.handleClick}>
                {this.renderPrompt(this.state.cardIndex)}
              </Card >
              <Card className="flashcard" onClick={this.handleClick}>
                {this.renderAnswer(this.state.cardIndex)}
              </Card>
            </ReactCardFlip>

            <ChangeCardButtons passedFunction={this.updateCard} index={this.state.cardIndex} view={this.state.view_all} user_role={this.state.user_role}/>
          </div>
          <div>
            <DifficultButtons passedFunction={this.markDifficulty} view={this.state.view_all} user_role={this.state.user_role}/>
          </div>

        </div>
      );
    }
  }
}

export default withMenu(withRouter(withAlert.withAlert(ViewCards)));
