import React from 'react';
import './App.css';
import Home from './components/Home';
import SignUp from './components/SignUp';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import store from './store';

function App() {
  return (
    <Router>
    <Provider store={store}>
    <div className="App">
        <Switch>
          <Route 
            path="/" 
            exact               
            render={props => (
                  <React.Fragment>
                    <Home/>
                  </React.Fragment>
                )} 
            />

          <Route path="/SignUp" component={SignUp} />
        </Switch>
    </div>
    </Provider>
    </Router>
  );
}

export default App;
