import React, {Component} from 'react'
import { withRouter } from "react-router-dom"
import './AllSharedContent.css'
import axios from "axios"
import CardDisplay from '../subcomponents/CardDisplay';
import * as withAlert from "../HOC/ComponentWithAlert";
import withMenu from "../HOC/ComponentWithMenu";


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
            const {sharedCourses, sharedDecks} = await this.getPageContent();
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

    getPageContent = async () => {
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

        return {sharedCourses: sharedCourses, sharedDecks: sharedDecks}
    }


    /**
     * @param {*} courseId id of the course the user is clicking
     * @param {*} courseName name of the course the user is clicking
     */
    courseView = (courseId, courseName) => {
        this.props.history.push({
            pathname: '/decks',
            state: {
                id: courseId,
                name: courseName
            }
        });
    }

    /**
     * @param {*} deckId id of the deck the user is clicking
     */
    cardView = (deckId) => {
        this.props.history.push("/viewCards", {deckId});
    }
    
    render() {
        return (
            <div>
                <div id="sharedCourses">
                    <h1>Shared Courses</h1>
                    <CardDisplay changePage={this.courseView} cardsInfo={this.state.sharedCourses} />
                </div>
                <div id="sharedDecks">
                    <h1>Shared Decks</h1>
                    <CardDisplay changePage={this.cardView} cardsInfo={this.state.sharedDecks} />
                </div>
            </div>
            )
        }
};

export default withMenu(withRouter(withAlert.withAlert(AllCourses)));