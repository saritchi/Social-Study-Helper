import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import AllCourses from './components/AllCourses';
import AddCourse from './components/AddCourse';

import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"

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
