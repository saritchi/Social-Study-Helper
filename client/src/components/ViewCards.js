import React from 'react';
import ReactCardFlip from 'react-card-flip';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"
import './ViewCards.css';
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
    document.addEventListener("keydown", this.handleKeyDown);
  }

  async componentDidMount() {
    const cardResponse = await axios.get('/api/viewCards');
    const flashcards = cardResponse.data.result;
    flashcards.forEach((card) => {
      console.log(card);
    })
    this.setState({cards: flashcards});
  }
 
  handleClick = (e) => {
    this.setState(prevState => ({ isFlipped: !prevState.isFlipped }));
  }

  handleKeyDown = (e) => {
    console.log(e)
    if(e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown'){
      this.setState(prevState => ({ isFlipped: !prevState.isFlipped }));
    }
    if(e.key === 'ArrowRight'){
      this.setState({cardIndex: this.state.cardIndex + 1})
    }
    if(e.key === 'ArrowLeft'){
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

export default ViewCards;