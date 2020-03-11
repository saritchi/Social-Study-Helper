import React, { Component } from 'react';
import './App.css';
import CardExample from './components/CardExample';
import Hover from './components/Hover';
import Toggle from './components/Toggle';
import Register from './components/Register';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serverTime: "",
      serverData: "",
      cardData: ""
    };
  }

  async componentDidMount() {
    try {
      const serverTimeResponse = await axios.get('/api/serverTime');
      const serverDataResponse = await axios.get('/api/serverData');
      const serverCardDataResponse = await axios.get('/api/cardData');

      this.setState({serverTime: serverTimeResponse.data.result, 
                     serverData: serverDataResponse.data.result, 
                     cardData: serverCardDataResponse.data.result});
    } catch (error) {
      console.error("Server error: " + error);
    }
  }

  render() {
    return (
      <Router>
      <div className="App">
          <Switch>
            <Route 
              path="/" 
              exact               
              render={props => (
                    <React.Fragment>
                      <CardExample value={this.state.cardData}/>
                      <Hover value={this.state.serverTime}/>
                      <Toggle value={this.state.serverData}/>
                      <Link to="/register">SignUP</Link>
                    </React.Fragment>
                  )} 
              />
              <Route path="/register" component={Register} />
          </Switch>
      </div>
      </Router>
    );
  }
}

export default App;
