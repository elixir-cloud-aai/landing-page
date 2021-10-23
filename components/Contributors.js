import Zoom from "react-reveal/Zoom";

const Contributors = ({ contributors }) => {
  const renderLinks = (contributor) => {
    return (
      <div className="flex pt-0.5">
        {contributor.email ? (
          <a href={`mailto:${contributor.email}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 ml-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </a>
        ) : (
          <></>
        )}
        {contributor.website ? (
          <a href={contributor.website}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 ml-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </a>
        ) : (
          <></>
        )}
        {contributor.linkedin ? (
          <a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              className="ml-3"
            >
              <path
                d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"
                fill="#374151"
              />
            </svg>
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
            <div className="w-full rounded-lg border-2 shadow-lg hover:shadow-md my-5 hover:bg-gray-100">
              <div className="flex md:flex-row flex-col">
                <img
                  src={contributor.image}
                  className="md:rounded-l-lg md:rounded-t-none rounded-t-lg md:w-36 md:h-36"
                  alt="Icon"
                ></img>
                <div className="flex-grow p-5">
                  <div className="flex justify-between">
                    <div className="text-xl font-semibold flex justify-between">
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
    <div className="mt-28 md:mx-64 mx-10 font-pop text-gray-700">
      <div className="text-3xl font-bold mb-1.5 mt-5 text-center">Contributors</div>
      <div className="my-10">
        <Zoom>{renderContributors()}</Zoom>
      </div>
    </div>
  );
};

export default Contributors;
