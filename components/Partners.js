import { useState } from "react";

const Partners = ({ partners }) => {
  const [query, setQuery] = useState("");
  const [filteredPartners, setFilteredPartners] = useState(partners);

  const handleSearch = (e) => {
    setQuery(e.target.value);
    const newFilteredPartners = partners.filter((partner) => {
      const title = partner.name.trim().toLowerCase();
      if (title.includes(e.target.value.trim().toLowerCase())) {
        return true;
      } else {
        return false;
      }
    });
    setFilteredPartners(newFilteredPartners);
  };

  const renderPartners = () => {
    return filteredPartners.map((partner) => {
      return (
        <>
          <a href={partner.website} target="_blank" rel="noopener noreferrer">
            <div
              key={partner.id}
              className="w-full rounded-lg border-2 shadow-lg hover:shadow-md my-5 hover:bg-gray-100 cursor-pointer"
            >
              <div className="flex md:flex-row flex-col">
                <img
                  src={partner.icon}
                  className="md:rounded-l-lg md:rounded-t-none rounded-t-lg md:w-32 md:h-32 p-5"
                  alt="Icon"
                ></img>
                <div className="flex-grow p-5">
                  <div className="text-xl font-semibold flex justify-between">
                    <div>{partner.name}</div>
                  </div>
                  <div className="text-gray-500 text-justify mt-1.5">{partner.description}</div>
                </div>
              </div>
            </div>
          </a>
        </>
      );
    });
  };

  return (
    <div className="mt-28 md:mx-64 mx-10 font-pop text-gray-700">
      <input
        className="md:text-base text-sm px-3 py-2 border-2 rounded-lg outline-none w-full focus:shadow-lg hover:shadow-lg mb-5 placeholder-opacity-50"
        placeholder="Search.."
        value={query}
        onChange={(e) => {
          handleSearch(e);
        }}
      ></input>
      {renderPartners()}
    </div>
  );
};

export default Partners;
