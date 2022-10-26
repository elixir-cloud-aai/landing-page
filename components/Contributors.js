import Zoom from "react-reveal/Zoom";

const Contributors = ({ contributors }) => {
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
        {contributor.scholar ? (
          <a href={contributor.scholar}>
            <ion-icon name="school-outline"></ion-icon>
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

  const renderPositions = (contributor) => {
    return contributor.positions.map((position) => {
      return (
        <div className="text-gray-500" key={position}>
          {position}
        </div>
      );
    });
  };

  const renderContributors = () => {
    return contributors.map((contributor) => {
      return (
        <>
          <Zoom key={contributor.id}>
            <div className="w-full rounded-lg border-2 shadow-lg hover:shadow-md my-5 hover:bg-gray-100  dark:text-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800 dark:border-gray-800 dark:hover:border-gray-900">
              <div className="flex md:flex-row flex-col">
                <img
                  src={contributor.image}
                  className="md:rounded-l-lg md:rounded-t-none rounded-t-lg md:w-36 md:h-auto"
                  alt="Icon"
                  width="auto"
                  height="auto"
                ></img>
                <div className="flex-grow p-5">
                  <div className="flex justify-between">
                    <div className="text-xl font-semibold flex justify-between dark:text-gray-200">
                      <div>{contributor.name}</div>
                    </div>
                    <div>{renderLinks(contributor)}</div>
                  </div>
                  <div className="mt-1">{renderPositions(contributor)}</div>
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
