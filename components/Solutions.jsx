import { useContext, useState } from 'react';
import Link from 'next/link';
import { Zoom } from 'react-awesome-reveal';
import themeContext from '../context/defaultTheme';

function Solutions({ solutions }) {
  const [query, setQuery] = useState('');
  const [filteredSolutions, setFilteredSolutions] = useState(solutions);
  const theme = useContext(themeContext);

  const handleSearch = (e) => {
    setQuery(e.target.value);
    const newFilteredSolutions = solutions.filter((solution) => {
      const title = solution.title.trim().toLowerCase();
      const term = e.target.value.trim().toLowerCase();
      return title.includes(term);
    });
    setFilteredSolutions(newFilteredSolutions);
  };

  const renderSolutions = () =>
    filteredSolutions.map((solution) => (
      <Zoom key={solution.id}>
        <Link href={`solution/${solution.id}`} passHref>
          <div className="w-full my-5 border-2 rounded-lg shadow-lg cursor-pointer hover:shadow-md dark:bg-gray-900 dark:hover:bg-gray-800 dark:border-gray-800 dark:hover:border-gray-900 hover:bg-gray-100">
            <div className="flex flex-col md:flex-row">
              <img
                alt="Icon"
                className={`md:rounded-l-lg md:rounded-t-none rounded-t-lg md:w-32 md:h-32 p-5 ${
                  theme === 'dark' ? 'darkMode' : ''
                }`}
                height="auto"
                src={theme !== 'dark' ? solution.icon : solution.iconDark}
                width="auto"
              />
              <div className="flex-grow p-5">
                <div className="flex justify-between text-xl font-semibold">
                  <div className="dark:text-gray-200">{solution.title}</div>
                </div>
                <div className="text-gray-500 text-justify mt-1.5 dark:text-gray-400">
                  {solution.description}
                </div>
              </div>
            </div>
          </div>
        </Link>
      </Zoom>
    ));

  return (
    <div className="mx-10 mt-32 text-gray-700 md:mx-64 font-pop">
      <input
        className="w-full px-3 py-2 mb-5 text-sm placeholder-opacity-50 border-2 rounded-lg outline-none md:text-base focus:shadow-lg hover:shadow-lg dark:bg-gray-900 dark:hover:bg-gray-800 dark:border-gray-800 dark:hover:border-gray-900 dark:text-gray-200"
        onChange={(e) => {
          handleSearch(e);
        }}
        placeholder="Search.."
        value={query}
      />
      {renderSolutions()}
    </div>
  );
}

export default Solutions;
