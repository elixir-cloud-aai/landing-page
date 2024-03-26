import { useEffect, useState } from 'react';
import Link from 'next/link';
import TextTransition, { presets } from 'react-text-transition';
import { Zoom } from 'react-awesome-reveal';
import window from 'global/window';
import Image from 'next/image';

const TEXTS = [
  <span className="text-elixirred" key="findable">
    Findable
  </span>,
  <span className="text-elixirgreen" key="accessible">
    Accessible
  </span>,
  <span className="text-elixiryellow" key="interoperable">
    Interoperable
  </span>,
  <span className="text-elixirblue" key="reusable">
    Reusable
  </span>,
  <div className="flex" key="fair">
    <span className="text-elixirred">F</span>
    <span className="text-elixirgreen">A</span>
    <span className="text-elixiryellow">I</span>
    <span className="text-elixirblue">R</span>
  </div>,
];

function Home() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [innerWidth, setinnerWidth] = useState(1000);
  const [index, setIndex] = useState(0);
  const backgroundImgUrl = 'url(/Landing_Dark.svg)';

  const handleMouseMove = (e = { clientX: 0, clientY: 0 }) => {
    setX(e.clientX);
    setY(e.clientY);
    setinnerWidth(window.innerWidth);
  };

  useEffect(() => {
    handleMouseMove();
    const intervalId = setInterval(
      () => setIndex((index) => index + 1),
      2000, // every 2 seconds
    );
    return () => clearTimeout(intervalId);
  }, []);

  const renderTextLoop = () => (
    <TextTransition inline springConfig={presets.gentle}>
      {TEXTS[index % TEXTS.length]}
    </TextTransition>
  );

  return (
    <div className="font-pop dark:bg-gray-800 dark:text-white">
      <div>
        <div
          className="px-10 text-center text-4xl md:text-5xl font-extrabold h-screen flex items-center justify-center text-gray-800"
          onMouseMove={(e) => {
            handleMouseMove(e);
          }}
          style={{
            backgroundImage: innerWidth >= 650 ? backgroundImgUrl : '',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '101% 101%',
            backgroundPositionX: `${(x - 1000) / 100}px`,
            backgroundPositionY: `${y / 50}px`,
          }}
        >
          <Zoom triggerOnce>
            <div className="leading-relaxed dark:text-gray-200">
              {/* <div className="text-xl md:text-3xl mb-1 leading-relaxed font-bold md:font-extrabold">
                ELIXIR Cloud &#38; AAI
              </div> */}
              Making Cloud Infrastructure for
              <span className="block">
                the Life Sciences &nbsp;{renderTextLoop()}
              </span>
            </div>
          </Zoom>
        </div>
        <Zoom>
          <div className="p-0 md:px-10">
            <div className="flex items-center px-10 flex-col md:flex-row">
              <div className="text-lg text-gray-700 dark:text-gray-200 leading-loose text-justify">
                The{' '}
                <span className="font-semibold">
                  ELIXIR Cloud and Authentication and Authorization
                  Infrastructure (AAI)
                </span>{' '}
                project aims to leverage a coordinated network of{' '}
                <a
                  className="text-elixirblue font-semibold hover:underline"
                  href="https://elixir-europe.org/about-us/who-we-are/nodes"
                >
                  ELIXIR Nodes
                </a>{' '}
                to deliver a{' '}
                <a
                  className="text-elixirblue font-semibold hover:underline"
                  href="https://www.ga4gh.org/"
                >
                  GA4GH
                </a>{' '}
                standards-compliant federated environment to enable population
                scale genomic and phenotypic data analysis across international
                boundaries.{' '}
                <Link href="/overview" passHref>
                  <span className="text-elixirblue font-semibold hover:underline cursor-pointer">
                    More...
                  </span>
                </Link>
              </div>
              <div>
                <Image
                  alt="globe"
                  height={0}
                  sizes="100vw"
                  src="/Earth.svg"
                  style={{ width: '100%', height: 'auto' }}
                  width={0}
                />
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
}

export default Home;
