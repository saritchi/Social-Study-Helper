import React, {Component} from 'react';
import {withRouter} from "react-router-dom"
import { Button, Nav, NavItem } from 'shards-react';
import axios from "axios";
import './DeckDisplay.css';
import * as withAlert from "../HOC/ComponentWithAlert";
import CardDisplay from '../subcomponents/CardDisplay';


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
            const decklist = await this.getPageContent();
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

    getPageContent = async() => {
        const deckResponse = await axios.get('/api/decks',  {
            params: {
                id: this.props.location.state.id,
            }
        });
        const sharedContentResponse = await axios.get('/api/sharedDeckContent', {
            params: {
                email: this.props.user.email
            }
        })

        var decklist = deckResponse.data.result;
        const sharedContent = sharedContentResponse.data.result;
        console.log(sharedContent);

        const deckIds = decklist.map((deck) => deck.id);
        const sharedUsers = sharedContent.filter((sharedContent) => deckIds.includes(sharedContent.deckId))
        console.log(sharedUsers);
        //find the user each deck has been shared with and add them to the deck object
        decklist.forEach((deck) => {
            const users = sharedUsers.filter((sharedUser) => sharedUser.deckId === deck.id).map((sharedUser) => {
                return {sharedId: sharedUser.id, email: sharedUser.toUser}
            });
            deck['sharedWith'] = users;
        })

        console.log(decklist);
        return decklist
    }


    /**
     * @param {*} deckId id of the course to share
     * @param {*} toEmails an Array of emails of users to share the course with 
     */
    shareDeckCallback = async (deckId, toEmails, deckName) => {
        try {
            const sharedContentResponse = await axios.post('api/shareDeck', {
                fromEmail: this.props.user.email,
                toEmails: toEmails,
                id: deckId
            })
            
            const sharedContent = sharedContentResponse.data.result;
            this.addUsersToSharedWith(sharedContent, deckId)
            
            const users = toEmails.join(', ')
            this.props.showAlert(withAlert.successTheme, `Shared ${deckName} with ${users}.` )
        } catch (error) {
            console.error(error);
            this.props.showAlert(withAlert.errorTheme, error.response.data.result);
        }
    }

    addUsersToSharedWith = (sharedContent, deckId) => {
        var decklist = this.state.decklist;
        var deckIndex = decklist.findIndex(deck => deck.id === deckId);
        var  users = sharedContent.map((content) => {
            return {sharedId: content.id, email: content.toUser}
        })
        decklist[deckIndex].sharedWith = decklist[deckIndex].sharedWith.concat(users);
        this.setState({decklist: decklist});
    }

      /**
     * @param {*} contentId id of the deck to delete
     * @returns {*} boolean if the callback succeeded
     */
    removeSharedDeckCallback = async (contentId) => {
        try {
            await axios.delete('api/sharedDeck', {
                params: {
                    id: contentId
                }
            })
            return true;
        } catch (error) {
            console.error(error);
            this.props.showAlert(withAlert.errorTheme, error.response.data.result);
        }

        return false;
    }

    addDeck = () => {
        this.props.history.push(
        {
            pathname: "/createDeck", 
            state: {courseId: this.props.location.state.id}
        });
    }

     /**
     * @param {*} deckId id of the deck the user is clicking
     */
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
                <CardDisplay changePage={this.cardView} options={true}
                             shareContentCallback={this.shareDeckCallback}
                             removeSharedContentCallback={this.removeSharedDeckCallback}
                             cardsInfo={this.state.decklist} />
                <Button id="newDeck" onClick={this.addDeck}>Add New Deck</Button>
            </div>
        )
    }
};

export default withRouter(withAlert.withAlert(DeckDisplay));