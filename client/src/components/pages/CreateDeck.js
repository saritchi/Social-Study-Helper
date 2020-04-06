import React from 'react'
import { withRouter } from "react-router-dom"
import { Form, FormGroup, FormTextarea, FormInput, Button, Container, Row, Col} from "shards-react";
import { TiDelete } from 'react-icons/ti';
import * as withAlert from "../HOC/ComponentWithAlert";
import withMenu from '../HOC/ComponentWithMenu';
import BackButton from '../subcomponents/BackButton'
import Axios from 'axios';
import './CreateDeck.css';

class CreateDeck extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deckname: '',
            cards: [],
            giveWarning: false,
            modal_open: false
        }
    }
    
    componentDidMount(){
        if(!this.props.user.isAuthenticated) {
            this.props.history.replace("/");
            return;
        }

        this.addCard();
    }

    goBack = () => {
        this.props.history.goBack();
    }

    toggle_modal = () => {
        this.setState({
          modal_open: !this.state.modal_open
        });
    }

    addCard = () => {
        const newCards = [...this.state.cards, {prompt: this.prompt, answer: this.answer}];
        this.setState({cards: newCards});
    }

    deleteCard = async (event, index) => {
        event.preventDefault();
        const newCards = this.state.cards
        newCards.splice(index, 1);
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
                            <label className="input-headers" htmlFor={index}><h6>Prompt</h6></label>
                            <FormTextarea id={index} onChange={this.onInputChange} name="card_prompt"/>
                        </Col>
                        <Col>
                            <label className="input-headers" htmlFor={index}><h6>Answer</h6></label>
                            <FormTextarea id={index} onChange={this.onInputChange} name="card_answer"/>
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
            this.props.history.goBack();
        } catch (error){
            console.log(error);
            this.props.showAlert(withAlert.errorTheme, error.response.data.result);
        }
    }

    isValidInput() {
        var validInput = true
        const deckname = this.state.deckname;
        
        if (!deckname) {
          this.props.showAlert(withAlert.errorTheme, "Error. Deckname is required")
          validInput = false;
        }
        else if(deckname.length > 50){
            this.props.showAlert(withAlert.errorTheme, "Error. Deckname can't be longer then 50 characters. Please choose a different name.")
            validInput = false;
        }

        const cardSet = this.state.cards;

        for(var i = 0; i < cardSet.length; i++){
            if (typeof cardSet[i] !== 'undefined'){
                if(cardSet[i].prompt){
                    if(cardSet[i].prompt.length > 2000){
                        this.props.showAlert(withAlert.errorTheme, "Error. Card Prompt and Card Answer can't be longer then 2000 characters.")
                        validInput = false;
                    }
                }
                else if(cardSet[i].answer){
                    if(cardSet[i].answer.length > 2000){
                        this.props.showAlert(withAlert.errorTheme, "Error. Card Prompt and Card Answer can't be longer then 2000 characters.")
                        validInput = false;
                    }
                }
            }
        }

        return validInput;
    }

    onInputChange = event => {
        const card = this.state.cards;
        if(this.state.giveWarning === false){
            this.setState({giveWarning: true})
        }
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
                <div>
                    <BackButton page="Decks" 
                                goback={this.goBack} 
                                toggle={this.toggle_modal} 
                                open={this.state.modal_open} 
                                warning={this.state.giveWarning}
                    />
                </div>
                <Container id="newDeckHeading"><h4>Create New Deck: </h4></Container>
                <Form id="deck">
                    
                    <Container>
                        <label className="input-headers" htmlFor="deckName"><h5>Deck Name</h5></label>
                        <FormInput id="deckName" name="deckname" onChange={this.onInputChange} value={this.state.deckname} placeholder="Deck Name"/>
                    </Container>
                    {this.renderCardInputs()}
                    <Button id="addCard" onClick={this.addCard} theme="info" block size="lg">Add Card</Button>
                    <br></br>
                    <Button id="addDeck" theme="success" onClick={this.onSubmit} size="lg">Create Deck</Button>
                </Form>
            </div>
        );
    }
}

export default withMenu(withRouter(withAlert.withAlert(CreateDeck)));