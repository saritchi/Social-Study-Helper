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

const userStorageKey = 'user';
class App extends Component {
  state = {
    user: JSON.parse(localStorage.getItem(userStorageKey)),
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
                      <LoginPage setUser={this.setUser} />
                    </React.Fragment>
                  )} 
              />
            <Route 
              path="/home" 
              exact               
              render={props => (
                    <React.Fragment>
                      <Home user={this.state.user} />
                    </React.Fragment>
                  )} 
              />
            <Route 
              path="/decks" 
              exact               
              render={props => (
                    <React.Fragment>
                      <DeckDisplay />
                    </React.Fragment>
                  )} 
              />
              <Route
                path="/addCourse" 
                exact               
                render={props => (
                      <React.Fragment>
                        <AddCourse user={this.state.user} />
                      </React.Fragment>
                    )} 
              />
              <Route
                path="/createDeck" 
                exact               
                render={props => (
                      <React.Fragment>
                        <CreateDeck />
                      </React.Fragment>
                    )}
              />
               <Route
                path="/allCourses" 
                exact               
                render={props => (
                      <React.Fragment>
                        <AllCourses user={this.state.user} />
                      </React.Fragment>
                    )} 
              />
              <Route
                path="/viewCards"
                exact
                render={props => (
                  <React.Fragment>
                    <ViewCards />
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

  setUser = (currentUser) => {
    this.setState({user: currentUser}, () => {
      localStorage.setItem('user', JSON.stringify(this.state.user));
    });
  }
}

export default App;
