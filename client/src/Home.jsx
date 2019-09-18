import React, { Component } from 'react';
import HomeAppBar from './HomeAppBar.jsx';
import Settings from './Settings.jsx';
import Availability from './Availability.jsx';
import { Switch, Route } from 'react-router-dom';

class Home extends Component {
  render () {
    return (
      <div>
        <HomeAppBar />
        <Switch>
          <Route exact path="/home/settings" component={Settings} />
          <Route exact path="/home/availability" component={Availability} />
        </Switch>
      </div>
    )
  }
}

export default Home;
