import React, {Component} from 'react'
import {withRouter } from "react-router-dom"
import { Button, Card, CardBody } from 'shards-react'
import './Home.css'
import axios from "axios"

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courses: [],
            username: null,
        };

        this.addCourse = this.addCourse.bind(this);
    }

    async componentDidMount() {
        //TODO: should not need to make a request for this. Should be passed in from login page.
        const user = (await axios.get('/api/user')).data.result ?? "";
        this.setState({username: user});
    }

    addCourse() {
        this.props.history.push("/addCourse");
    }

    
    render() {
        return (
            <div>
                <div id="user">
                    <h1>Welcome {this.state.username}!</h1>
                </div>
                <div>
                    <p>Courses: </p>
                    <p>View All Courses</p>
                </div>
                <div className="cardRow">
                    {this.renderCard(0)}
                    {this.renderCard(1)}
                    {this.renderCard(2)}
                </div>
                <div className="cardRow">
                    {this.renderCard(3)}
                    {this.renderCard(4)}
                    {this.renderCard(5)}
                </div>
                <div className="cardRow">
                    {this.renderCard(6)}
                    {this.renderCard(7)}
                    {this.renderCard(8)}
                </div>
                <div>
                    <Button onClick={() => this.addCourse}>Add New Course</Button>
                </div>
            </div>
            
            )
        }

        renderCard(i) {
            if (i > this.state.courses.length) {
                return;
            }
    
            return (
                <Card>
                    <CardBody>
                        {this.state.courses[i]}
                    </CardBody>
                </Card>
            );
        }
};

export default withRouter(Home)