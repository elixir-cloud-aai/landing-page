import React, { Component } from "react";
import TextLoop from "react-text-loop";
import Zoom from "react-reveal/Zoom";

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
      <div className="font-pop">
        <div>
          <div
            className="px-10 md:px-72 text-center text-3xl md:text-5xl font-extrabold h-screen flex items-center text-gray-800 leading-relaxed"
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
              <div className="text-base md:text-2xl">
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
              of the patient disease data.
            </div>
          </div>
          <Zoom when={this.props.scroll > window.innerHeight * 0 + 230 ? true : false}>
            <div className="p-10">
              <div className="flex items-center px-10 flex-col md:flex-row">
                <div className="text-lg text-gray-700 leading-loose">
                  The <span className="font-semibold">ELIXIR Cloud and AAI</span> project aims to
                  leverage a coordinated network of{" "}
                  <a
                    href="https://elixir-europe.org/about-us/who-we-are/nodes"
                    className="text-elixirblue font-semibold hover:underline"
                  >
                    ELIXIR Nodes
                  </a>{" "}
                  to deliver a{" "}
                  <a
                    href="https://www.ga4gh.org/"
                    className="text-elixirblue font-semibold hover:underline"
                  >
                    GA4GH
                  </a>{" "}
                  standards-compliant federated environment to enable population scale genomic and
                  phenotypic data analysis across international boundaries and a potential
                  infrastructure to enable{" "}
                  <a
                    href="https://ec.europa.eu/digital-single-market/en/news/towards-access-least-1-million-genomes-eu-2022-1-year"
                    className="text-elixirblue font-semibold hover:underline"
                  >
                    1M Genome analysis
                  </a>
                  .
                </div>
                <div>
                  <img src="/Earth.svg" alt="globe"></img>
                </div>
              </div>
            </div>
          </Zoom>
        </div>
      </div>
    );
  }
}
