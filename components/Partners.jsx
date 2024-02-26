import { useContext, useState } from 'react';
import { Zoom } from 'react-awesome-reveal';
import themeContext from '../context/defaultTheme';
import Image from 'next/image';

function Partners({ partners }) {
  const [query, setQuery] = useState('');
  const [filteredPartners, setFilteredPartners] = useState(partners);
  const theme = useContext(themeContext);

  const handleSearch = (e) => {
    setQuery(e.target.value);
    const newFilteredPartners = partners.filter((partner) => {
      const title = partner.name.trim().toLowerCase();
      const term = e.target.value.trim().toLowerCase();
      return title.includes(term);
    });
    setFilteredPartners(newFilteredPartners);
  };

  const renderPartners = () =>
    filteredPartners.map((partner) => (
      <Zoom key={partner.id}>
        <a href={partner.website} rel="noopener noreferrer" target="_blank">
          <div className="w-full rounded-lg border-2 shadow-lg hover:shadow-md my-5 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 dark:border-gray-800 dark:hover:border-gray-900 cursor-pointer ">
            <div className="flex flex-col lg:flex-row">
              <Image
                alt="Icon"
                className="md:rounded-l-lg md:rounded-t-none rounded-t-lg m-auto mt-0 p-5 lg:w-32 lg:h-32"
                height={400}
                id={theme.theme === 'dark' ? 'darkMode' : ''}
                src={theme.theme === 'light' ? partner.icon : partner.iconDark}
                width={400}
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
}

export default Partners;
