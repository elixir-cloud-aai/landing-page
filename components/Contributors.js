import Link from "next/link";

const Contributors = ({ contributors }) => {
  const renderContributors = () => {
    return contributors.map((contributor) => {
      console.log(contributor);
      return (
        <>
          <div
            key={contributor.id}
            className="w-full rounded-lg border-2 hover:shadow-lg my-5 hover:bg-gray-100"
          >
            <div className="flex md:flex-row flex-col">
              <img
                src={contributor.image}
                className="md:rounded-l-lg md:rounded-t-none rounded-t-lg md:w-32 md:h-32"
                alt="Icon"
              ></img>
              <div className="flex-grow p-5">
                <div className="text-xl font-semibold flex justify-between">
                  <div>{contributor.name}</div>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
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
                {/* <div className="text-gray-500 text-justify mt-1.5">{product.description}</div> */}
              </div>
            </div>
          </div>
        </>
      );
    });
  };

  console.log(contributors);
  return (
    <div className="mt-28 md:mx-64 mx-10 font-pop text-gray-700">
      <div className="text-3xl font-bold mb-1.5 mt-5 text-center">Contributors</div>
      <div>{renderContributors()}</div>
    </div>
  );
};

export default Contributors;
