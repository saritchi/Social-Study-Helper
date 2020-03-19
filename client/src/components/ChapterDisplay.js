import React, {Component} from 'react';
import {withRouter} from "react-router-dom"
import { Button, Nav, NavItem } from 'shards-react';
import axios from "axios";
import './ChapterDisplay.css';
import * as withAlert from "./ComponentWithAlert"
import CardDisplay from './CardDisplay';


class DeckDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chapterList: []
        };
    }

    async componentDidMount() {
        try {
            const chaptersResponse = await axios.get('/api/chapters',  {
                params: {
                    id: this.props.location.state.id,
                }
            });
            const chapterList = chaptersResponse.data.result;
            chapterList.forEach((chapter) => {
                console.log(chapter);
            })
            this.setState({chapterList: chapterList})
        } catch(error) {
            console.error(error);
            console.error("ERROR");
            this.props.showAlert(withAlert.errorTheme, error.response.data.result);
        }
    }

    addDeck = () => {
        this.props.history.push("/createDeck");
    }

    cardView = (deckId) => {
        this.props.history.push("/viewCards", {deckId});
    }

    render() {
        return (
            <div>
                <div id="courseName">
                    <h1>{this.props.location.state.name}</h1>
                </div>
                <div>
                    <Nav>
                        <NavItem id="chapterList">
                            <h3>Chapters: </h3>
                        </NavItem>
                    </Nav>
                </div>
                <CardDisplay changePage={this.cardView} cardsInfo={this.state.chapterList} />
                <Button id="newChapter" onClick={this.addDeck}>Add New Chapter</Button>
            </div>
        )
    }
};

export default withRouter(withAlert.withAlert(DeckDisplay));