import React, { Component } from "react";
import { Router, Route, Switch } from "react-router-dom";
import history from "../history";
import Home from "./Home";
import NavBar from "./NavBar";

export default class App extends Component {
  render() {
    return (
      <div>
        <Router history={history}>
          <NavBar></NavBar>
          <Switch>
            <Route exact path="/" component={Home} />
          </Switch>
        </Router>
      </div>
    );
  }
}
