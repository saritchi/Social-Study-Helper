import React from 'react'
import { Button, Form, FormGroup, FormTextarea, FormInput} from "shards-react";
import { Container, Row, Col } from "shards-react";
import { TiDelete } from 'react-icons/ti';
import * as withAlert from "../HOC/ComponentWithAlert";
import withMenu from '../HOC/ComponentWithMenu';
import axios from 'axios';
import './CreateDeck.css';

class EditDeck extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deckname: '',
            cards: [],
            deckId: 0,
            courseId: 0
        }
    }
    
    async componentDidMount(){
        if(!this.props.user.isAuthenticated) {
            this.props.history.replace("/");
            return;
        }

        try {
            const response = await axios.get('/api/editDeck', {
              params:{
                deck: this.props.location.state.deckId
              } 
            });
  
            const deckName = response.data.result_names;
            const cardSet = response.data.result_cards;
            console.log(deckName);
            cardSet.forEach((card) => {
              console.log(card);
            })

            // From GET, copy the contents to the state
            this.setState({cards: cardSet, deckId: this.props.location.state.deckId, deckname: deckName.name, courseId: deckName.courseId});
            this.addCard();

        } catch(error) {
            console.error(error);
            this.props.showAlert(withAlert.errorTheme, error.response.data.result);
        }

    }

    addCard = () => {
        const newCards = [...this.state.cards, {prompt: this.prompt, answer: this.answer}];
        this.setState({cards: newCards});
    }

    deleteCard = async (event, index) => {
        event.preventDefault();
        const newCards = this.state.cards
        delete newCards[index]
        this.setState({cards: newCards})
    }

    renderCardInputs = () => {
        return this.state.cards.map((cardInput, index) => {
            const cardId = "card" + index;
            return (
                <FormGroup key={cardId}>
                <Container id="cards">
                    <Row>
                        <h6>{index+1}</h6>
                        
                    </Row>
                    <hr></hr>
                    
                    <Row>
                        <Col>
                            <label htmlFor={index}><h6>Prompt:</h6></label>
                            <FormTextarea id={index} onChange={this.onInputChange} defaultValue={this.state.cards[index].prompt} name="card_prompt"/>
                        </Col>
                        <Col>
                            <label htmlFor={index}><h6>Answer:</h6></label>
                            <FormTextarea id={index} onChange={this.onInputChange} defaultValue={this.state.cards[index].answer} name="card_answer"/>
                            
                        </Col>
                        <TiDelete id={index} onClick={(e) => this.deleteCard(e, index) }size={"2em"} />
                    </Row>
                    
                </Container>
                

                </FormGroup>
            )
        })

    }

    onSubmit = async event => {
        event.preventDefault();

        if (!this.isValidInput()) {
            return false;
        }

        const deckname = this.state.deckname;
        const cardsObject = this.state.cards;
        const deckId = this.state.deckId;
        const courseId = this.state.courseId;

        const card = Object.keys(cardsObject).map((key) => {
            return cardsObject[key];
        });

        const json = {
            deckname: deckname,
            cards: card, 
            deckId: deckId,
            courseId: courseId
        }

        try{
            // query currently does not insert new rows, it currently only updates
            const response = await axios.post("/api/editDeck", json);
            console.log(response.status);
            this.props.history.goBack();
        } catch (error){
            console.log(error);
            this.props.showAlert(withAlert.errorTheme, error.response.data.result);
        }
        return true
    }

    isValidInput() {
        const deckname = this.state.deckname;
        
        if (!deckname) {
          this.props.showAlert(withAlert.errorTheme, "Error. Deckname is required.")
          return false;
        }
        else if(deckname.length > 50){
            this.props.showAlert(withAlert.errorTheme, "Error. Deckname can't be longer then 50 characters. Please choose a different name.")
            return false;
        }

        const cardSet = this.state.cards;

        for(var i = 0; i < cardSet.length; i++){
            if(cardSet[i].prompt){
                if(cardSet[i].prompt.length > 2000){
                    this.props.showAlert(withAlert.errorTheme, "Error. Card Prompt and Card Answer can't be longer then 2000 characters.")
                    return false;
                }
            }
            else if(cardSet[i].answer){
                if(cardSet[i].answer.length > 2000){
                    this.props.showAlert(withAlert.errorTheme, "Error. Card Prompt and Card Answer can't be longer then 2000 characters.")
                    return false;
                }
            }
        }

        return true;
      }

    onInputChange = (event) => {
        const card = this.state.cards;
        if(event.target.name === "card_prompt") {
            card[event.target.id].prompt = event.target.value;
            this.setState({cards: card});
        }else if(event.target.name === "card_answer"){
            card[event.target.id].answer = event.target.value;
            this.setState({cards: card});
        }else if(event.target.name === "deckname"){
            this.setState({deckname: event.target.value});
        }
    }


    render(){  
        return(
            <div>
                <Container id="newDeckHeading"><h4>Edit Deck: </h4></Container>
                <Form id="deck">
                    
                    <Container>
                        <label htmlFor="deckName"><h5>Deck Name:</h5></label>
                        <FormInput id="deckName" name="deckname" onChange={this.onInputChange} value={this.state.deckname} placeholder="Deck Name"/>
                    </Container>
                    {this.renderCardInputs()}
                    <Button id="addCard" onClick={this.addCard} size="lg">Add Card</Button>
                    <br></br>
                    <Button id="saveDeck" theme="success" onClick={this.onSubmit} size="lg">Done</Button>
                </Form>
            </div>
        );
    }
}

export default withMenu(withAlert.withAlert(EditDeck));