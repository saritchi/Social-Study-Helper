import React, {Component} from 'react';
import {withRouter} from "react-router-dom"
import { Button, Nav, NavItem } from 'shards-react';
import axios from "axios";
import './DeckDisplay.css';
import * as withAlert from "./HOC/ComponentWithAlert";
import CardDisplay from './CardDisplay';


class DeckDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            decklist: []
        };
    }

    async componentDidMount() {
        if(!this.props.user.isAuthenticated) {
            this.props.history.replace("/");
            return;
        }
        
        try {
            const deckResponse = await axios.get('/api/decks',  {
                params: {
                    id: this.props.location.state.id,
                }
            });
            const decklist = deckResponse.data.result;
            decklist.forEach((deck) => {
                console.log(deck);
            })
            this.setState({decklist: decklist})
        } catch(error) {
            if(error.response.status === 401) {
                this.props.history.replace("/");
            }
            else {
                console.error(error);
                this.props.showAlert(withAlert.errorTheme, error.response.data.result);
            }
        }
    }

    addDeck = () => {
        this.props.history.push(
        {
            pathname: "/createDeck", 
            state: {courseId: this.props.location.state.id}
        });
    }

    cardView = (deckId) => {
        this.props.history.push("/viewCards", {deckId});
    }

    render() {
        const coursename = this.props.location?.state?.name || '';
        return (
            <div>
                <div id="courseName">
                    <h1>{coursename}</h1>
                </div>
                <div>
                    <Nav>
                        <NavItem id="decklist">
                            <h3>Decks: </h3>
                        </NavItem>
                    </Nav>
                </div>
                <CardDisplay changePage={this.cardView} cardsInfo={this.state.decklist} />
                <Button id="newDeck" onClick={this.addDeck}>Add New Deck</Button>
            </div>
        )
    }
};

export default withRouter(withAlert.withAlert(DeckDisplay));