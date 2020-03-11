import React from 'react'
import { Form, FormGroup, FormTextarea, FormInput} from "shards-react";
import { Container, Row, Col } from "shards-react";
import {
    Button
  } from "shards-react";
import EventAlert from './EventAlert';
import Axios from 'axios';
import './CreateDeck.css';


export default class CreateDeck extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deckname: '',
            cards: [],
            prompts: {},
            answers: {},
            showAlert: false,
            networkError: false,
            message: ''
        }
    }
    
    componentDidMount(){
        this.addCard();
    }

    addCard = () => {
        const numberOfCards = this.state.cards.length;
        const newCards = [...this.state.cards, this.renderNewCard(numberOfCards)];

        this.setState({cards: newCards})
        this.forceUpdate();
        console.log("New Card Added!")
    }


    renderNewCard = i => {
        const cardId = "card" + i;
        const promptId = "prompt" + i;
        const answerId = "answer" + i;

        return (
            <FormGroup key={cardId}>
                <Container id="cards">
                    <Row>
                        <h6>{i+1}</h6>
                    </Row>
                    <hr></hr>
                    
                    <Row>
                        <Col>
                            <label htmlFor={promptId}>Card Prompt:</label>
                            <FormTextarea id={promptId} onChange={this.onInputChange} name="card_prompt"/>
                        </Col>
                        <Col>
                            <label htmlFor={answerId}>Card Answer:</label>
                            <FormTextarea id={answerId} onChange={this.onInputChange} name="card_answer"/>
                        </Col>
                    </Row>
                </Container>

            </FormGroup>
        )
    }


    onSubmit = async event => {
        event.preventDefault();
        const deckname = this.state.deckname;
        const prompts = this.state.prompts;
        const answers = this.state.answers;


        const json = {
            deckname: deckname,
            prompts: prompts,
            answers: answers,
            
        }
 
        console.log(json);

        try{
            const response = await Axios.post("/api/addDeck", json);
            console.log(response.status);
            this.setState(
                {
                    deckname: '',
                    cards: [],
                    prompts: {}, 
                    answers: {},
                    showAlert: true,
                    networkError: false,
                    message: "Added Deck"
                }, this.addCard
            );
        } catch (error){
            console.log(error);
            this.setState(
                {
                  showAlert: true,
                  networkError: true,
                  message: error.response.data.result,
            });
        }
    }

    onInputChange = event => {
        if(event.target.name === "card_prompt") {
            const prompt = this.state.prompts;
            prompt[event.target.id] = event.target.value;
            this.setState({[event.target.id]: prompt});
        }else if(event.target.name === "card_answer"){
            const answer = this.state.answers;
            answer[event.target.id] = event.target.value;
            this.setState({[event.target.name]: answer})
        }else{
            this.setState({[event.target.name]: event.target.value});
        }
    }

    dismissAlert = () => {
        this.setState({showAlert: false});
    }

    render(){
        const cards = this.state.cards;
        const visible = this.state.showAlert;
        const theme = this.state.networkError ? "danger" : "success";
        const messasge = this.state.message;
        
        return(
            <div>
                <EventAlert visible={visible} dismissAlert={this.dismissAlert} theme={theme} message={messasge} />
                <Container id="newDeckHeading"><h4>Create New Deck: </h4></Container>
                <Form id="deck">
                    
                    <Container>
                        <label htmlFor="deckName">Deck Name:</label>
                        <FormInput id="deckName" name="deckname" onChange={this.onInputChange} value={this.state.deckname} placeholder="Deck Name"/>
                    </Container>
                    {cards}
                    <Button id="addCard" onClick={this.addCard}>Add Card</Button>
                    <br></br>
                    <Button id="addDeck" theme="danger" onClick={this.onSubmit}>Finished</Button>
                </Form>
            </div>
        );
    }
}
