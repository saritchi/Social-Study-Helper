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
      cards: []
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  async componentDidMount() {
    const cardResponse = await axios.get('/api/viewCards');
    const flashcards = cardResponse.data.result;
    flashcards.forEach((card) => {
      console.log(card);
    })
    this.setState({cards: flashcards});
  }
 
  handleClick(e) {
    console.log(e.keyCode)
    this.setState(prevState => ({ isFlipped: !prevState.isFlipped }));
  }

  //Not currently used in build
  handleKeyPress(e) {
    console.log(e.keyCode)
    if(e.key === "Space"){
      this.setState(prevState => ({ isFlipped: !prevState.isFlipped }));
    }
  }

  render(){
    return (
      <div className="flash-container">  
          <ReactCardFlip isFlipped={this.state.isFlipped} flipDirection="vertical">
            <div className="card" onClick={this.handleClick}>
              {this.renderPrompt()}
            </div >
            <div className="card" onClick={this.handleClick}>
              {this.renderAnswer()}
            </div>
          </ReactCardFlip>
      </div>
      
    );
  }

  renderPrompt = () => {
    const id = this.state.cards.map(card => card.id);
    console.log(id)
    return (
      <p>{id[0]}</p>
    );

  }

  renderAnswer = () => {
    const name = this.state.cards.map(card => card.name);
    console.log(name)
    return (
      <p>{name[0]}</p>
    );
  }

}

export default ViewCards;