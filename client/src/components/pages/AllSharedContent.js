import React, {Component} from 'react'
import { withRouter } from "react-router-dom"
import './AllCourses.css'
import axios from "axios"
import CardDisplay from '../subcomponents/CardDisplay';
import * as withAlert from "../HOC/ComponentWithAlert";

class AllCourses extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            sharedCourses: [],
            sharedDecks: []
        };
    }

    async componentDidMount() {
        if(!this.props.user.isAuthenticated) {
            this.props.history.replace("/");
            return;
        }

        try {
            const sharedCoursesResponse = await axios.get('/api/sharedCourses', {
                params: {
                    email: this.props.user.email
                }
            });
            const sharedCourses = sharedCoursesResponse.data.result;
            console.log(sharedCourses);

            const sharedDecksResponse = await axios.get('/api/sharedDecks', {
                params: {
                    email: this.props.user.email
                }
            });
            const sharedDecks = sharedDecksResponse.data.result;
            console.log(sharedDecks);
            this.setState({sharedCourses: sharedCourses, sharedDecks: sharedDecks})
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

    deckView = (deckId, deckName) => {
        this.props.history.push({
            pathname: '/decks',
            state: {
                id: deckId,
                name: deckName
            }
        });
    }

    cardView = (deckId) => {
        this.props.history.push("/viewCards", {deckId});
    }
    
    render() {
        return (
            <div>
                <div id="sharedCourses">
                    <h1>Shared Courses</h1>
                    <CardDisplay changePage={this.deckView} cardsInfo={this.state.sharedCourses} />
                </div>
                <div id="sharedDecks">
                    <h1>Shared Decks</h1>
                    <CardDisplay changePage={this.cardView} cardsInfo={this.state.sharedDecks} />
                </div>
            </div>
            )
        }
};

export default withRouter(withAlert.withAlert(AllCourses));