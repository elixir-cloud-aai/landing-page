import { useState } from "react";
import Zoom from "react-reveal/Zoom";

const Contributors = ({ contributors }) => {
  const [showMorePositions, setShowMorePositions] = useState([]);

  const renderLinks = (contributor) => {
    return (
      <div className="flex pt-0.5 space-x-2">
        {contributor.email ? (
          <a href={`mailto:${contributor.email}`}>
            <ion-icon name="mail-outline"></ion-icon>
          </a>
        ) : (
          <></>
        )}
        {contributor.website ? (
          <a href={contributor.website}>
            <ion-icon name="link-outline"></ion-icon>
          </a>
        ) : (
          <></>
        )}
        {contributor.orcid ? (
          <a href={contributor.orcid}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://img.icons8.com/windows/512/orcid.png" className="w-6 h-6" alt="orcid-link" />
          </a>
        ) : (
          <></>
        )}
        {contributor.researchgate ? (
          <a href={contributor.researchgate}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://img.icons8.com/windows/512/researchgate.png" className="w-6 h-6" alt="researchgate-link" />
          </a>
        ) : (
          <></>
        )}
        {contributor.scholar ? (
          <a href={contributor.scholar}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://img.icons8.com/material-sharp/384/google-scholar.png" className="w-6 h-6" alt="scholar-link" />
          </a>
        ) : (
          <></>
        )}
        {contributor.github ? (
          <a href={contributor.github}>
            <ion-icon name="logo-github"></ion-icon>
          </a>
        ) : (
          <></>
        )}
        {contributor.linkedin ? (
          <a href={contributor.linkedin}>
            <ion-icon name="logo-linkedin"></ion-icon>
          </a>
        ) : (
          <></>
        )}
      </div>
    );
  };

  const renderMore = (id) => {
    setShowMorePositions([...showMorePositions, id]);
  }

  const renderPositions = (contributor) => {
    if (contributor.positions.length <= 3) {
      return contributor.positions.map((position, index) => {
        return (
          <div className="text-gray-500" key={position}>
            {position}
          </div>
        );
      });
    } else {
      return (
        <>
          <div className="text-gray-500">
            {contributor.positions[0]}
          </div>
          <div className="text-gray-500">
            {contributor.positions[1]}
          </div>
          <div className="text-gray-500">
            {contributor.positions[2]}
            {
              showMorePositions.includes(contributor.id) ? <></> : <span className="pl-2 text-elixirblue cursor-pointer" onClick={() => renderMore(contributor.id)}>More...</span>
            }
          </div>
          {
            showMorePositions.includes(contributor.id) ? (
              contributor.positions.slice(3).map((position, index) => {
                return (
                  <div className="text-gray-500" key={position}>
                    {position}
                    {
                      index === contributor.positions.slice(3).length - 1 ? <span className="pl-2 text-elixirblue cursor-pointer" onClick={() => setShowMorePositions(showMorePositions.filter((id) => id !== contributor.id))}>Less...</span> : <></>
                    }
                  </div>
                );
              }
              )) : (
              <></>
            )
          }
        </>

      );
    }
  };

  const renderContributors = () => {
    return contributors.map((contributor) => {
      return (
        <>
          <Zoom key={contributor.id}>
            <div className="w-full rounded-lg border-2 shadow-lg hover:shadow-md my-5 hover:bg-gray-100  dark:text-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800 dark:border-gray-800 dark:hover:border-gray-900 transition-all">
              <div className="flex md:flex-row flex-col transition-all">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={contributor.image}
                  className="md:rounded-l-lg md:rounded-t-none rounded-t-lg md:w-36 md:h-36 object-cover"
                  alt="Icon"
                  width="auto"
                  height="auto"
                ></img>
                <div className="flex-grow p-4">
                  <div className="flex justify-between">
                    <div className="text-xl font-semibold flex justify-between dark:text-gray-200">
                      <div>{contributor.name}</div>
                    </div>
                    <div>{renderLinks(contributor)}</div>
                  </div>
                  <div className="mt-1  transition-all">{renderPositions(contributor)}</div>
                </div>
              </div>
            </div>
          </Zoom>
        </>
      );
    });
  };

  return (
    <div className="mt-32 md:mx-64 mx-10 font-pop text-gray-700">
      <div className="text-3xl font-bold mb-1.5 mt-5 text-center dark:text-gray-200">
        Contributors
      </div>
      <div className="my-10">
        <Zoom>{renderContributors()}</Zoom>
      </div>
    </div>
  );
};

export default Contributors;
