import React, { Component } from 'react';
import Login from './Login.jsx';
import SignUp from './SignUp.jsx';
import Home from './Home.jsx';
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";

class App extends Component {
  render () {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/signup" component={SignUp} />
          <Route path="/home" component={Home} />
          <Route component={Login} />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App;
