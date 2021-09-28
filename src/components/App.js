import React, { Component } from "react";
import { Router, Route, Switch } from "react-router-dom";
import history from "../history";
import Footer from "./Footer";
import Home from "./Home";
import NavBar from "./NavBar";

export default class App extends Component {
  render() {
    return (
      <Router history={history}>
        <div className="flex flex-col min-h-screen">
          <div>
            <NavBar></NavBar>
          </div>
          <div className="flex-grow mb-10">
            <Switch>
              <Route exact path="/" component={Home} />
            </Switch>
          </div>
          <div>
            <Footer></Footer>
          </div>
        </div>
      </Router>
    );
  }
}
