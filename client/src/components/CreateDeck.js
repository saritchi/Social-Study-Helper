import React from 'react'
import { withRouter } from "react-router-dom"
import { Form, FormGroup, FormTextarea, FormInput} from "shards-react";
import { Container, Row, Col } from "shards-react";
import {
    Button
  } from "shards-react";
import * as withAlert from "./HOC/ComponentWithAlert";
import Axios from 'axios';
import './CreateDeck.css';

class CreateDeck extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deckname: '',
            cards: [],
        }
    }
    
    componentDidMount(){
        if(!this.props.user.isAuthenticated) {
            this.props.history.replace("/");
            return;
        }

        this.addCard();
    }

    addCard = () => {
        const newCards = [...this.state.cards, {prompt: this.prompt, answer: this.answer}];
        this.setState({cards: newCards});
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
                            <FormTextarea id={index} onChange={this.onInputChange} name="card_prompt"/>
                        </Col>
                        <Col>
                            <label htmlFor={index}>Card Answer:</label>
                            <FormTextarea id={index} onChange={this.onInputChange} name="card_answer"/>
                        </Col>
                    </Row>
                </Container>

                </FormGroup>
            )
        })

    }


    onSubmit = async event => {
        event.preventDefault();
        const deckname = this.state.deckname;
        const cardsObject = this.state.cards;
        const card = Object.keys(cardsObject).map((key) => {
            return cardsObject[key];
        });
        
        const json = {
            deckname: deckname,
            cards: card
        }

        try{
            const response = await Axios.post("/api/addDeck", json, {
                params:{
                  id: this.props.location.state.courseId
                } 
            });
            console.log(response.status);
            this.setState(
                {
                    deckname: '',
                    cards: [],
                }, this.addCard
            );
            this.props.showAlert(withAlert.successTheme, "Deck Added!");
        } catch (error){
            console.log(error);
            this.props.showAlert(withAlert.errorTheme, error.response.data.result);
        }
    }

    onInputChange = event => {
        const card = this.state.cards;
        if(event.target.name === "card_prompt") {
            card[event.target.id].prompt = event.target.value;
            this.setState({cards: card});
        }else if(event.target.name === "card_answer"){
            card[event.target.id].answer = event.target.value;
            this.setState({cards: card});
        }else{
            this.setState({[event.target.name]: event.target.value});
        }
    }


    render(){  
        return(
            <div>
                <Container id="newDeckHeading"><h4>Create New Deck: </h4></Container>
                <Form id="deck">
                    
                    <Container>
                        <label htmlFor="deckName">Deck Name:</label>
                        <FormInput id="deckName" name="deckname" onChange={this.onInputChange} value={this.state.deckname} placeholder="Deck Name"/>
                    </Container>
                    {this.renderCardInputs()}
                    <Button id="addCard" onClick={this.addCard}>Add Card</Button>
                    <br></br>
                    <Button id="addDeck" theme="danger" onClick={this.onSubmit}>Finished</Button>
                </Form>
            </div>
        );
    }
}

export default withRouter(withAlert.withAlert(CreateDeck));