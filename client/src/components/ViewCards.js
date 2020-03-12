import React from 'react';
import ReactCardFlip from 'react-card-flip';
import './ViewCards.css';
import * as withAlert from "./ComponentWithAlert";
import axios from 'axios';

class ViewCards extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
      isFlipped: false,
      cardIndex: 0,
      cards: []
    };
    this.handleClick = this.handleClick.bind(this);
  }

  async componentDidMount() {
    try {
      const cardResponse = await axios.get('/api/viewCards');
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
 
  handleClick = (e) => {
    this.setState(prevState => ({ isFlipped: !prevState.isFlipped }));
  }

  handleKeyDown = (e) => {
    console.log(e)
    if(e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown'){
      this.setState(prevState => ({ isFlipped: !prevState.isFlipped }));
    }
    else if(e.key === 'ArrowRight' && this.state.cardIndex < this.state.cards.length){
      this.setState({cardIndex: this.state.cardIndex + 1})
    }
    else if(e.key === 'ArrowLeft' && this.state.cardIndex > 0){
      this.setState({cardIndex: this.state.cardIndex - 1})
    }
    
  }

  render(){
    return (
      <div className="flash-container">  
          <ReactCardFlip isFlipped={this.state.isFlipped} flipDirection="vertical">
            <div className="card" onClick={this.handleClick}>
              {this.renderPrompt(this.state.cardIndex)}
            </div >
            <div className="card" onClick={this.handleClick}>
              {this.renderAnswer(this.state.cardIndex)}
            </div>
          </ReactCardFlip>
      </div>
      
    );
  }

  renderPrompt = (index) => {
    const id = this.state.cards.map(card => card.id);
    console.log(id)
    return (
      <p>{id[index]}</p>
    );

  }

  renderAnswer = (index) => {
    const name = this.state.cards.map(card => card.name);
    console.log(name)
    return (
      <p>{name[index]}</p>
    );
  }

}

export default withAlert.withAlert(ViewCards);