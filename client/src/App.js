import React, { Component } from 'react';
import './App.css';
import Register from './components/Register';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Home from './components/Home';
import AllCourses from './components/AllCourses';

import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"
import AddCourse from './components/AddCourse';
import CreateDeck from './components/CreateDeck';
import DeckDisplay from './components/DeckDisplay';
import ViewCards from './components/ViewCards';

class App extends Component {
  state = {
    isAuthenticated: false
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
                      <LoginPage setAuthenticationStatus={this.setAuthenticationStatus}/>
                    </React.Fragment>
                  )} 
              />
            <Route 
              path="/home" 
              exact               
              render={props => (
                    <React.Fragment>
                      <Home isAuthenticated={this.state.isAuthenticated} />
                    </React.Fragment>
                  )} 
              />
            <Route 
              path="/deckDisplay" 
              exact               
              render={props => (
                    <React.Fragment>
                      <DeckDisplay isAuthenticated={this.state.isAuthenticated} />
                    </React.Fragment>
                  )} 
              />
              <Route
                path="/addCourse" 
                exact               
                render={props => (
                      <React.Fragment>
                        <AddCourse isAuthenticated={this.state.isAuthenticated} />
                      </React.Fragment>
                    )} 
              />
              <Route
                path="/createDeck" 
                exact               
                render={props => (
                      <React.Fragment>
                        <CreateDeck isAuthenticated={this.state.isAuthenticated} />
                      </React.Fragment>
                    )}
              />
               <Route
                path="/allCourses" 
                exact               
                render={props => (
                      <React.Fragment>
                        <AllCourses isAuthenticated={this.state.isAuthenticated} />
                      </React.Fragment>
                    )} 
              />
              <Route
                path="/viewCards"
                exact
                render={props => (
                  <React.Fragment>
                    <ViewCards isAuthenticated={this.state.isAuthenticated} />
                  </React.Fragment>
                )}
              />
              <Route
                path="/register"
                exact
                render={props => (
                  <React.Fragment>
                    <Register/>
                  </React.Fragment>
                )}
              />
          </Switch>
      </div>
      </Router>
    );
  }

  setAuthenticationStatus = authStatus => {
    this.setState({isAuthenticated: authStatus});
  }
}

export default App;
