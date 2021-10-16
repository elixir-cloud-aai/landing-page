import React from "react";
import Link from "next/link";

const Guides = ({ guides }) => {
  const renderGuides = () => {
    return guides.map((guide) => {
      return (
        <>
          <Link href={`guide/${guide.id}`} passHref>
            <div
              key={guide.id}
              className="w-full rounded-lg border-2 shadow-lg hover:shadow-md my-5 hover:bg-gray-100 cursor-pointer"
            >
              <div className="flex md:flex-row flex-col">
                <div className="flex-grow p-5">
                  <div className="text-xl font-semibold flex justify-between">
                    <div>{guide.title}</div>
                  </div>
                  <div className="text-gray-500 text-justify mt-1.5">{guide.description}</div>
                </div>
              </div>
            </div>
          </Link>
        </>
      );
    });
  };

  return <div className="mt-28 md:mx-64 mx-10 font-pop text-gray-700">{renderGuides()}</div>;
};

export default Guides;
