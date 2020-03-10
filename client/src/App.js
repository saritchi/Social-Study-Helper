import React, { Component } from 'react';
import './App.css';
import Home from './components/Home';
import AllCourses from './components/AllCourses';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"
import AddCourse from './components/AddCourse';

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
                path="/addCourse" 
                exact               
                render={props => (
                      <React.Fragment>
                        <AddCourse />
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
