import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";

import Register from './components/pages/Register';
import LoginPage from './components/pages/LoginPage';
import Home from './components/pages/Home';
import AllCourses from './components/pages/AllCourses';
import AddCourse from './components/pages/AddCourse';
import CreateDeck from './components/pages/CreateDeck';
import DeckDisplay from './components/pages/DeckDisplay';
import ViewCards from './components/pages/ViewCards';
import EditDeck from './components/pages/EditDeck';
import EditCourse from './components/pages/EditCourse';
import AllSharedContent from './components/pages/AllSharedContent'
import Messages from './components/pages/Messages'
import AssignedStudents from './components/pages/AssignedStudents';

import User from './User';
const userStorageKey = 'user';

class App extends Component {
  //read the user object out of the browser sotrage to allow the page to be refreshed and not lose the user information
  state = {
    user: JSON.parse(localStorage.getItem(userStorageKey)) || new User(),
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
                      <Home user={this.state.user} setUser={this.setUser} />
                    </React.Fragment>
                  )} 
              />
            <Route 
              path="/decks" 
              exact               
              render={props => (
                    <React.Fragment>
                      <DeckDisplay user={this.state.user} setUser={this.setUser} />
                    </React.Fragment>
                  )} 
              />
              <Route
                path="/addCourse" 
                exact               
                render={props => (
                      <React.Fragment>
                        <AddCourse user={this.state.user} setUser={this.setUser} />
                      </React.Fragment>
                    )} 
              />
              <Route
                path="/createDeck" 
                exact               
                render={props => (
                      <React.Fragment>
                        <CreateDeck user={this.state.user} setUser={this.setUser} />
                      </React.Fragment>
                    )}
              />
               <Route
                path="/allCourses" 
                exact               
                render={props => (
                      <React.Fragment>
                        <AllCourses user={this.state.user} setUser={this.setUser} />
                      </React.Fragment>
                    )} 
              />
                <Route
                path="/allSharedContent" 
                exact               
                render={props => (
                      <React.Fragment>
                        <AllSharedContent user={this.state.user} setUser={this.setUser} />
                      </React.Fragment>
                    )} 
              />
              <Route
                path="/viewCards"
                exact
                render={props => (
                  <React.Fragment>
                    <ViewCards user={this.state.user} setUser={this.setUser} />
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
              <Route
                path="/assignedStudents"
                exact
                render={props => (
                  <React.Fragment>
                    <AssignedStudents user={this.state.user} setUser={this.setUser}/>
                  </React.Fragment>
                )}
             />
             <Route
                path="/editDeck"
                exact
                render={props => (
                  <React.Fragment>
                    <EditDeck  user={this.state.user} setUser={this.setUser}/>
                  </React.Fragment>
                )}
              />
               <Route
                path="/messages"
                exact
                render={props => (
                  <React.Fragment>
                    <Messages  user={this.state.user} setUser={this.setUser}/>
                  </React.Fragment>
                )}
              />
              <Route
                path="/editCourse"
                exact
                render={props => (
                  <React.Fragment>
                    <EditCourse  user={this.state.user} setUser={this.setUser}/>
                  </React.Fragment>
                )}
              />
          </Switch>
      </div>
      </Router>
    );
  }

  setUser = (currentUser) => {
    //store the user object into browser storage so we can refresh the page and not lose the user information
    this.setState({user: currentUser}, () => {
      localStorage.setItem('user', JSON.stringify(this.state.user));
    });
  }
}

export default App;
