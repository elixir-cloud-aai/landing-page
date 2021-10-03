import React, { Component } from "react";
import { Router, Route, Switch } from "react-router-dom";
import history from "../history";
import Footer from "./Footer";
import Home from "./Home";
import NavBar from "./NavBar";
import News from "./News";

export default class App extends Component {
  state = {
    scroll: 0,
  };

  componentDidMount() {
    window.onscroll = () => {
      this.setState({ scroll: window.scrollY });
    };
  }

  render() {
    return (
      <Router history={history}>
        <div className="flex flex-col min-h-screen">
          <div>
            <NavBar scroll={this.state.scroll}></NavBar>
          </div>
          <div className="flex-grow mb-10">
            <Switch>
              <Route exact path="/">
                <Home scroll={this.state.scroll}></Home>
              </Route>
              <Route exact path="/">
                <News scroll={this.state.scroll}></News>
              </Route>
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
