import React, { Component } from "react";
import HomeAppBar from "./HomeAppBar.jsx";
import Settings from "./Settings.jsx";
import Search from "./Search.jsx";
import Availability from "./Availability.jsx";
import { Switch, Route } from "react-router-dom";


const Home = () => {

  return (
    <div>
      <HomeAppBar />
      <Switch>
        <Route exact path="/home/search" component={Search} />
        <Route exact path="/home/settings" component={Settings} />
        <Route exact path="/home/availability" component={Availability} />
      </Switch>
    </div>
  );
};

export default Home;
