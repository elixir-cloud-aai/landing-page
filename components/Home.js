import React, { useState } from "react";
import TextLoop from "react-text-loop";
import Zoom from "react-reveal/Zoom";
import window from "global/window";

const Home = () => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [backgroundImgUrl, setBackgroundImgUrl] = useState("url(/Landing.svg)");
  const [innerWidth, setinnerWidth] = useState(1000);

  const handleMouseMove = (e) => {
    setX(e.clientX);
    setY(e.clientY);
    setinnerWidth(window.innerWidth);
  };

  const renderTextLoop = () => {
    return (
      <span className="block md:inline">
        <TextLoop springConfig={{ stiffness: 180, damping: 8 }} noWrap={false}>
          <span className="text-elixirblue">aggregation</span>
          <span className="text-elixirgreen">standardisation</span>
          <span className="text-elixiryellow">integration</span>
          <span className="text-elixirred">harmonisation</span>
          <span className="text-elixirgreen">security</span>
        </TextLoop>
      </span>
    );
  };

  return (
    <div className="font-pop">
      <div>
        <div
          className="px-10 md:px-72 text-center text-4xl md:text-5xl font-extrabold h-screen flex items-center text-gray-800"
          style={{
            backgroundImage: innerWidth >= 650 ? backgroundImgUrl : "",
            backgroundRepeat: "no-repeat",
            backgroundSize: "100% 100%",
            backgroundPositionX: `${x / 50}px`,
            backgroundPositionY: `${y / 50}px`,
          }}
          onMouseMove={(e) => {
            handleMouseMove(e);
          }}
        >
          <div className="leading-relaxed">
            <div className="text-lg md:text-2xl leading-relaxed font-bold md:font-extrabold">
              ELIXIR Cloud and Authentication & Authorisation Infrastructure
            </div>
            Aims at the {renderTextLoop()} of{" "}
            <span className="inline md:block">the patient disease data.</span>
          </div>
        </div>
        <Zoom>
          {/* when={this.props.scroll > window.innerHeight * 0.25 ? true : false} */}
          <div className="p-0 md:px-10">
            <div className="flex items-center px-10 flex-col md:flex-row">
              <div className="text-lg text-gray-700 leading-loose text-justify">
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
        {/* <Zoom>
          when={this.props.scroll > window.innerHeight * 0.25 ? true : false}
          <div className="p-0 md:px-10">
            <div className="flex items-center px-10 flex-col md:flex-row">
              <div>
                <img src="/Nerd.svg" alt="Nerd"></img>
              </div>
              <div className="text-lg text-gray-700 leading-loose">
                The ELIXIR Cloud & AAI project will lay the groundwork to deliver the foundational
                capability of <span className="font-semibold">federation</span> of{" "}
                <span className="font-semibold">identities</span>, sensitive{" "}
                <span className="font-semibold">data access, trusted hybrid cloud providers</span>{" "}
                and sensitive <span className="font-semibold">data analysis services</span> across
                ELIXIR Nodes by underpinning the conversation between partners with the GA4GH
                standards and ELIXIR trans-national expertise.
              </div>
            </div>
          </div>
        </Zoom> */}
      </div>
    </div>
  );
};

export default Home;
