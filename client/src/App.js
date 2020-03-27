import React from 'react';
import './App.css';
import Register from './components/Register';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
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
import UserCalendar from './components/UserCalendar';

function App() {
    return (
      <Router>
      <div className="App">
          <Switch>
          <Route 
              path="/" 
              exact               
              render={props => (
                    <React.Fragment>
                      <LoginPage/>
                    </React.Fragment>
                  )} 
              />
            <Route 
              path="/home" 
              exact               
              render={props => (
                    <React.Fragment>
                      <Home />
                      
                    </React.Fragment>
                  )} 
              />
            <Route 
              path="/deckDisplay" 
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
                        <AddCourse />
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
                        <AllCourses />
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
              <Route
                path="/calendar"
                exact
                render={props => (
                  <React.Fragment>
                    <UserCalendar />
                  </React.Fragment>
                )}
              />
          </Switch>
      </div>
      </Router>
    );
}

export default App;
