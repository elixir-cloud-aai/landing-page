import React, { Component } from "react";
import TextLoop from "react-text-loop";

export default class Home extends Component {
  state = {
    x: 0,
    y: 0,
  };

  handleMouseMove = (e) => {
    this.setState({
      x: e.clientX,
      y: e.clientY,
    });
  };

  render() {
    return (
      <div>
        <div className="font-pop">
          <div
            className="px-72 text-center text-5xl font-extrabold h-screen flex items-center text-gray-800 leading-relaxed"
            style={{
              backgroundImage: "url(/Landing.svg)",
              backgroundRepeat: "no-repeat",
              backgroundSize: "100% 100%",
              backgroundPositionX: `${this.state.x / 50}px`,
              backgroundPositionY: `${this.state.y / 50}px`,
            }}
            onMouseMove={(e) => {
              this.handleMouseMove(e);
            }}
          >
            <div>
              <div className="text-2xl">
                ELIXIR Cloud and Authentication & Authorisation Infrastructure
              </div>
              Aims at the{" "}
              <TextLoop springConfig={{ stiffness: 180, damping: 8 }} noWrap={false}>
                <span className="text-elixirblue">aggregation</span>
                <span className="text-elixirgreen">standardisation</span>
                <span className="text-elixiryellow">integration</span>
                <span className="text-elixirred">harmonisation</span>
                <span className="text-elixirgreen">security</span>
              </TextLoop>{" "}
              of
              <div>the patient disease data.</div>
            </div>
          </div>
          <div className="p-10">
            lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod lorem ipsum
            dolor sit amet, consectetur adipiscing elit, sed do eiusmod lorem ipsum dolor sit amet,
            consectetur adipiscing elit, sed do eiusmod lorem ipsum dolor sit amet, consectetur
            adipiscing elit, sed do eiusmod lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod lorem ipsum
            dolor sit amet, consectetur adipiscing elit, sed do eiusmod lorem ipsum dolor sit amet,
            consectetur adipiscing elit, sed do eiusmod lorem ipsum dolor sit amet, consectetur
            adipiscing elit, sed do eiusmod lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod lorem ipsum
            dolor sit amet, consectetur adipiscing elit, sed do eiusmod lorem ipsum dolor sit amet,
            consectetur adipiscing elit, sed do eiusmod lorem ipsum dolor sit amet, consectetur
            adipiscing elit, sed do eiusmod lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod lorem ipsum
            dolor sit amet, consectetur adipiscing elit, sed do eiusmod lorem ipsum dolor sit amet,
            consectetur adipiscing elit, sed do eiusmod lorem ipsum dolor sit amet, consectetur
            adipiscing elit, sed do eiusmod lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          </div>
        </div>
      </div>
    );
  }
}
