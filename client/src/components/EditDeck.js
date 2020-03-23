import React from 'react'
import { Button, Form, FormGroup, FormTextarea, FormInput} from "shards-react";
import { Container, Row, Col } from "shards-react";
import { TiDelete } from 'react-icons/ti';
import * as withAlert from "./ComponentWithAlert"
import axios from 'axios';
import './CreateDeck.css';

class EditDeck extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deckname: '',
            cards: [],
            card_count: 0,
            deckId: 0
        }
    }
    
    async componentDidMount(){
        try {
            console.log(this.props.deckId);
            const response = await axios.get('/api/editDeck', {
              params:{
                deck: this.props.deckId
              } 
            });
  
            const deckName = response.data.result_names;
            this.setState({deckname: deckName[0].name});
            console.log(this.state.deckname)

            var count = 0;
            const cardSet = response.data.result_cards;
            cardSet.forEach((card) => {
              console.log(card);
              
              count += 1;
            })
            console.log("Deck ID is " + cardSet[0].deckId)
            this.setState({cards: cardSet, card_count: count, deckId: cardSet[0].deckId});
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
        console.log("Event Target ID: " + event.target.id);
        console.log("deleting: " + index)
        event.preventDefault();
        const newCards = this.state.cards
        const total_cards = this.state.card_count - 1
        delete newCards[index]

        this.setState({cards: newCards, card_count: total_cards})
        
        console.log("New Cards are: " + newCards)
        console.log(newCards.length)
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
                            <label htmlFor={index}>Card Prompt:</label>
                            <FormTextarea id={index} onChange={this.onInputChange} defaultValue={this.state.cards[index].prompt} name="card_prompt"/>
                        </Col>
                        <Col>
                            <label htmlFor={index}>Card Answer:</label>
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
        event.stopPropagation();
        const deckname = this.state.deckname;
        const cardsObject = this.state.cards;
        const deckId = this.state.deckId;
        const card_count = this.state.card_count;

        const card = Object.keys(cardsObject).map((key) => {
            return cardsObject[key];
        });
        console.log(card)
        const json = {
            deckname: deckname,
            cards: card, 
            deckId: deckId,
            card_count: card_count
        }

        try{
            // query currently does not insert new rows, it currently only updates
            const response = await axios.post("/api/editDeck", json);
            console.log(response.status);
            this.props.showAlert(withAlert.successTheme, "Deck Updated!");
        } catch (error){
            console.log(error);
            this.props.showAlert(withAlert.errorTheme, error.response.data.result);
        }
    }

    onInputChange = (event) => {
        if(event.target.name === "card_prompt") {
            this.state.cards[event.target.id].prompt = event.target.value;
        }else if(event.target.name === "card_answer"){
            this.state.cards[event.target.id].answer = event.target.value;
        }else{
            this.setState({[event.target.name]: event.target.value});
        }
    }


    render(){  
        return(
            <div>
                <Container id="newDeckHeading"><h4>Edit Deck: </h4></Container>
                <Form id="deck">
                    
                    <Container>
                        <label htmlFor="deckName">Deck Name:</label>
                        <FormInput id="deckName" name="deckname" onChange={this.onInputChange} value={this.state.deckname} placeholder="Deck Name"/>
                    </Container>
                    {this.renderCardInputs()}
                    <Button id="addCard" onClick={this.addCard}>Add Card</Button>
                    <br></br>
                    <Button id="saveDeck" theme="danger" onClick={this.onSubmit}>Save</Button>
                </Form>
            </div>
        );
    }
}

export default withAlert.withAlert(EditDeck);