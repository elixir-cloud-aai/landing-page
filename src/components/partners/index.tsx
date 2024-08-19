'use client';
import { FC, useContext, useState } from 'react';
import { Zoom } from 'react-awesome-reveal';
import themeContext from '../../context/default-theme';
import { PartnerComponentProps } from './types';

const Partners: FC<PartnerComponentProps> = ({ partners }) => {
  const [query, setQuery] = useState('');
  const [filteredPartners, setFilteredPartners] = useState(partners);
  const context = useContext(themeContext);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    const newFilteredPartners = partners.filter((partner) => {
      const title = partner.name.trim().toLowerCase();
      const term = e.target.value.trim().toLowerCase();
      return title.includes(term);
    });
    setFilteredPartners(newFilteredPartners);
  };

  const resetFilters = () => {
    setFilteredPartners(partners);
    setQuery('');
  };

  const renderPartners = () => {
    if (filteredPartners.length === 0) {
      return (
        <div className="flex items-center">
          <div className="text-base text-gray-700 dark:text-gray-300">
            No Partners
          </div>
          <button
            className="bg-elixirred text-white ml-3 px-20 py-2 rounded-lg md:text-base text-sm"
            onClick={() => resetFilters()}
          >
            Reset
          </button>
        </div>
      );
    }
    return filteredPartners.map((partner) => (
      <Zoom key={partner.id}>
        <a href={partner.website} rel="noopener noreferrer" target="_blank">
          <div className="w-full rounded-lg border-2 shadow-lg hover:shadow-md my-5 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 dark:border-gray-800 dark:hover:border-gray-900 cursor-pointer ">
            <div className="flex md:flex-row flex-col">
              <img
                alt="Icon"
                className="md:rounded-l-lg md:rounded-t-none rounded-t-lg md:w-32 md:h-32 p-5"
                height="auto"
                id={context?.theme === 'dark' ? 'darkMode' : ''}
                src={
                  context?.theme === 'light' ? partner.icon : partner.iconDark
                }
                width="auto"
              />
              <div className="flex-grow p-5">
                <div className="text-xl font-semibold flex justify-between dark:text-gray-200">
                  <div>{partner.name}</div>
                </div>
                <div className="text-gray-500 text-justify mt-1.5">
                  {partner.description}
                </div>
              </div>
            </div>
          </div>
        </a>
      </Zoom>
    ));
  };

  return (
    <div className="mt-32 md:mx-64 mx-10 font-pop text-gray-700">
      <input
        className="md:text-base text-sm px-3 py-2 border-2 rounded-lg outline-none w-full focus:shadow-lg hover:shadow-lg mb-5 placeholder-opacity-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:border-gray-800 dark:hover:border-gray-900 dark:text-gray-200"
        onChange={(e) => {
          handleSearch(e);
        }}
        placeholder="Search.."
        value={query}
      />
      {renderPartners()}
    </div>
  );
};

export default Partners;