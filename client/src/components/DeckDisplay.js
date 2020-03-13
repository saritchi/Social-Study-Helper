import React, {Component} from 'react';
import {withRouter} from "react-router-dom"
import { Button, Nav, NavItem, NavLink } from 'shards-react';
import axios from "axios";
import './DeckDisplay.css';
import * as withAlert from "./ComponentWithAlert"
import CardDisplay from './CardDisplay';


class DeckDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coursename: 'TestCourse',
            courseId: 0,
            decklist: []
        };
    }

    async componentDidMount() {
        try {
            const deckResponse = await axios.get('/api/decklist');
            const decklist = deckResponse.data.result;
            decklist.forEach((deck) => {
                console.log(deck);
            })
            this.setState({decklist: decklist})
        } catch(error) {
            console.error(error);
            console.error("ERROR");
            this.props.showAlert(withAlert.errorTheme, error.response.data.result);
        }
    }

    addDeck = () => {
        this.props.history.push("/createDeck");
    }

    render() {
        return (
            <div>
                <div id="courseName">
                    <h1>{this.state.coursename}</h1>
                </div>
                <div>
                    <Nav>
                        <NavItem id="decklist">
                            <h3>Decklist: </h3>
                        </NavItem>
                    </Nav>
                </div>
                <CardDisplay cardsInfo={this.state.decklist} />
                <Button id="newDeck" onClick={this.addDeck}>Create New Deck</Button>
            </div>
        )
    }
};

export default withRouter(withAlert.withAlert(DeckDisplay));