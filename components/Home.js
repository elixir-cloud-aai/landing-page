import React, { useState, useContext } from "react";
import TextLoop from "react-text-loop";
import Zoom from "react-reveal/Zoom";
import window from "global/window";

const Home = () => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [backgroundImgUrl, setBackgroundImgUrl] = useState("url(/Landing_Dark.svg)");
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
          <span className="text-elixirred">Findable</span>
          <span className="text-elixirgreen">Accessible</span>
          <span className="text-elixiryellow">Interoperable</span>
          <span className="text-elixirblue">Reusable</span>
          <div>
          	<span className="text-elixirred">F</span>
          	<span className="text-elixirgreen">A</span>
          	<span className="text-elixiryellow">I</span>
          	<span className="text-elixirblue">R</span>
	  </div>
        </TextLoop>
      </span>
    );
  };

  return (
    <div className="font-pop dark:bg-gray-800 dark:text-white">
      <div>
        <div
          className="px-10 md:px-72 text-center text-4xl md:text-5xl font-extrabold h-screen flex items-center text-gray-800"
          style={{
            backgroundImage: innerWidth >= 650 ? backgroundImgUrl : "",
            backgroundRepeat: "no-repeat",
            backgroundSize: "101% 101%",
            backgroundPositionX: `${(x - 1000) / 100}px`,
            backgroundPositionY: `${y / 50}px`,
          }}
          onMouseMove={(e) => {
            handleMouseMove(e);
          }}
        >
          <Zoom>
            <div className="leading-relaxed dark:text-gray-200">
              {/* <div className="text-xl md:text-3xl mb-1 leading-relaxed font-bold md:font-extrabold">
                ELIXIR Cloud &#38; AAI
              </div> */}
              Making Cloud Infrastructure for{" "}
              <span className="inline md:block">the Life Sciences {renderTextLoop()}</span>
            </div>
          </Zoom>
        </div>
        <Zoom>
          <div className="p-0 md:px-10">
            <div className="flex items-center px-10 flex-col md:flex-row">
              <div className="text-lg text-gray-700 dark:text-gray-200 leading-loose text-justify">
                The{" "}
                <span className="font-semibold">
                  ELIXIR Cloud and Authentication and Authorization Infrastructure (AAI)
                </span>{" "}
                project aims to leverage a coordinated network of{" "}
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
                phenotypic data analysis across international boundaries.
              </div>
              <div>
                <img src="/Earth.svg" alt="globe" width="auto" height="auto"></img>
              </div>
            </div>
          </div>
        </Zoom>
        {/* <Zoom>
          <div className="p-0 md:px-10">
            <div className="flex items-center px-10 flex-col md:flex-row">
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
