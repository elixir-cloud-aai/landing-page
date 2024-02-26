import { useContext, useState } from 'react';
import { Zoom } from 'react-awesome-reveal';
import themeContext from '../context/defaultTheme';
import Image from 'next/image';

function Partners({ funders }) {
  const [query, setQuery] = useState('');
  const [filteredFunders, setFilteredFunders] = useState(funders);
  const theme = useContext(themeContext);

  const handleSearch = (e) => {
    setQuery(e.target.value);
    const term = e.target.value.trim().toLowerCase();
    if (term === '') {
      setFilteredFunders(funders);
      return;
    }
    const newFilteredFunders = funders.filter((funder) => {
      return Object.values(funder).join(' ').toLowerCase().includes(term);
    });
    setFilteredFunders(newFilteredFunders);
  };

  const renderReciepients = (recipients) => {
    return recipients.map((recipient, i) => {
      return (
        <span key={recipient.id}>
          {i !== 0 ? ', ' : ''}
          {recipient.name}
        </span>
      );
    });
  };

  const formatDate = (d) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(d);
    return date.toLocaleDateString('en-GB', options);
  };

  const renderFunders = () => {
    return filteredFunders?.map((funder) => {
      return (
        <Zoom key={funder.id}>
          <a href={funder.website} rel="noopener noreferrer" target="_blank">
            <div className="w-full rounded-lg border-2 shadow-lg hover:shadow-md my-5 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 dark:border-gray-800 dark:hover:border-gray-900 cursor-pointer ">
              <div className="flex lg:flex-row flex-col">
                <Image
                  alt="Icon"
                  className={`m-auto md:rounded-l-lg md:rounded-t-none rounded-t-lg p-5 lg:w-40 lg:h-40 lg:mt-0 ${
                    theme === 'dark' ? 'darkMode' : ''
                  }`}
                  height={400}
                  src={theme !== 'dark' ? funder.icon : funder.iconDark}
                  width={400}
                />
                <div className="flex-grow p-5">
                  <div className="text-xl font-semibold dark:text-gray-200">
                    {funder.instrument}
                  </div>
                  <div className="text-base mt-1 text-gray-500">
                    <span className="font-semibold">Project: </span>
                    {funder.projectTitle}
                  </div>
                  <div className="text-base text-gray-500">
                    <span className="font-semibold">Reciepients: </span>
                    {renderReciepients(funder.recipients)}
                  </div>
                  <div className="text-base text-gray-500 flex flex-col md:flex-row md:gap-2">
                    <span className="font-semibold">Duration: </span>
                    {formatDate(funder.timeline.start) +
                      ' - ' +
                      formatDate(funder.timeline.end)}
                  </div>
                </div>
              </div>
            </div>
          </a>
        </Zoom>
      );
    });
  };

  return (
    <div className="mt-32 md:mx-64 mx-10 font-pop text-gray-700">
      <p className="md:text-xl sm:text-base text-sm mt-1 md:mt-0 dark:text-gray-200 font-bold text-center my-5">
        We would like to express our gratitude to our funders
      </p>
      <input
        className="md:text-base text-sm px-3 py-2 border-2 rounded-lg outline-none w-full focus:shadow-lg hover:shadow-lg mb-5 placeholder-opacity-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:border-gray-800 dark:hover:border-gray-900 dark:text-gray-200"
        onChange={(e) => {
          handleSearch(e);
        }}
        placeholder="Search.."
        value={query}
      />
      {renderFunders()}
    </div>
  );
}

export default Partners;
