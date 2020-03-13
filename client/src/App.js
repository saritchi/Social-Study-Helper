import React from 'react';
import './App.css';
import Home from './components/Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AllCourses from './components/AllCourses';

import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"
import AddCourse from './components/AddCourse';
import CreateDeck from './components/CreateDeck';
import DeckDisplay from './components/DeckDisplay';

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
          </Switch>
      </div>
      </Router>
    );
}

export default App;
