import React, { Component } from 'react';
import './App.css';
import Home from './components/Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"

class App extends Component {
  constructor(props) {
function App() {
    return (
      <Router>
      <div className="App">
          <Switch>
            <Route 
              path="/home" 
              exact               
              render={props => (
                    <React.Fragment>
                      <Home />
                    </React.Fragment>
                  )} 
              />
              exact               
              render={props => (
                    <React.Fragment>
                      <CardExample value={this.state.cardData}/>
                      <Hover value={this.state.serverTime}/>
                      <Toggle value={this.state.serverData}/>
                    </React.Fragment>
                  )} 
              />
          </Switch>
      </div>
      </Router>
    );
  }
}

export default App;
