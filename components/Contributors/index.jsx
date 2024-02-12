import { useContext, useEffect, useState } from 'react';
import { Zoom } from 'react-awesome-reveal';
import themeContext from '../../context/defaultTheme';
import ContributorFilter from './ContributorFilter';
import { FaXTwitter } from 'react-icons/fa6';

function Contributors({ contributors }) {
  const [showMorePositions, setShowMorePositions] = useState([]);
  const theme = useContext(themeContext);
  const [query, setQuery] = useState('');
  const [filteredContributors, setFilteredContributors] =
    useState(contributors);
  const [filteredContributorBySearch, setFilteredContributorBySearch] =
    useState(filteredContributors);
  const [roles, setRoles] = useState([]);
  const [affiliations, setAffiliations] = useState([]);
  const [filterformValues, setFilterformValues] = useState({
    pastContributorCheckBox: false,
    projectLeadCheckbox: false,
    roleInput: [],
    affiliationInput: {},
  });

  const [isFilterOpen, setFilterIsOpen] = useState(false);

  const toggleFilters = () => {
    setFilterIsOpen(!isFilterOpen);
  };

  useEffect(() => {
    setFilteredContributorBySearch(filteredContributors);
  }, [filteredContributors]);

  const handleSearch = (e) => {
    setQuery(e.target.value);
    const term = e.target.value.trim().toLowerCase();
    if (term === '') {
      setFilteredContributorBySearch(filteredContributors);
      return;
    }
    const newFilteredContributors = filteredContributors.filter(
      (contributor) => {
        return Object.values(contributor)
          .join(' ')
          .toLowerCase()
          .includes(term);
      },
    );
    setFilteredContributorBySearch(newFilteredContributors);
  };

  const getRoleArray = () => {
    const roleSet = new Set();
    contributors.forEach((contributor) => {
      contributor?.positions?.forEach((position) => {
        roleSet.add(position);
      });
    });
    const roleArray = [...roleSet];
    setRoles(roleArray);
  };
  const getAffiliationsArray = () => {
    const affiliationSet = new Set();
    contributors.forEach((contributor) => {
      const affiliation = contributor?.affiliation;
      affiliationSet.add(affiliation);
    });
    const affiliationArray = [...affiliationSet];
    setAffiliations(affiliationArray);
  };
  useEffect(() => {
    getRoleArray();
    getAffiliationsArray();
  }, []);

  const resetFilters = () => {
    setFilteredContributors(contributors);
    setFilteredContributorBySearch(contributors);
    setQuery('');
    setFilterformValues({
      pastContributorCheckBox: false,
      projectLeadCheckbox: false,
      roleInput: [],
    });
  };

  const renderLinks = (contributor) => {
    return (
      <div className="flex items-baseline pt-0.5 space-x-2">
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
            <svg
              fill={theme.theme === 'light' ? '#000000' : '#ffffff'}
              height="24px"
              viewBox="0 0 32 32"
              width="24px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M 16 3 C 8.8321388 3 3 8.832144 3 16 C 3 23.167856 8.8321388 29 16 29 C 23.167861 29 29 23.167856 29 16 C 29 8.832144 23.167861 3 16 3 z M 16 5 C 22.086982 5 27 9.9130223 27 16 C 27 22.086978 22.086982 27 16 27 C 9.9130183 27 5 22.086978 5 16 C 5 9.9130223 9.9130183 5 16 5 z M 11 8 A 1 1 0 0 0 11 10 A 1 1 0 0 0 11 8 z M 10 11 L 10 22 L 12 22 L 12 11 L 10 11 z M 14 11 L 14 12 L 14 22 L 18.5 22 C 21.525577 22 24 19.525577 24 16.5 C 24 13.474423 21.525577 11 18.5 11 L 14 11 z M 16 13 L 18.5 13 C 20.444423 13 22 14.555577 22 16.5 C 22 18.444423 20.444423 20 18.5 20 L 16 20 L 16 13 z" />
            </svg>
          </a>
        ) : (
          <></>
        )}
        {contributor.researchgate ? (
          <a href={contributor.researchgate}>
            <svg
              fill={theme.theme === 'light' ? '#000000' : '#ffffff'}
              height="26px"
              viewBox="0 0 32 32"
              width="26px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M 5 5 L 5 27 L 27 27 L 27 5 L 5 5 z M 7 7 L 25 7 L 25 25 L 7 25 L 7 7 z M 19.164062 10.001953 C 17.881062 10.001953 17.441406 10.919156 17.441406 11.535156 L 17.441406 13.169922 C 17.441406 13.999922 17.8935 14.792969 19.0625 14.792969 C 21.0245 14.790969 20.787109 13.306391 20.787109 12.275391 L 19.253906 12.275391 L 19.253906 12.816406 L 20.158203 12.816406 C 20.158203 13.621406 19.781453 14.162109 19.064453 14.162109 C 18.498453 14.162109 18.171875 13.671188 18.171875 12.992188 L 18.171875 11.634766 C 18.171875 11.005766 18.762062 10.642578 19.164062 10.642578 C 19.881062 10.642578 20.15625 11.271484 20.15625 11.271484 L 20.697266 10.90625 C 20.697266 10.90625 20.434062 10.001953 19.164062 10.001953 z M 13.583984 13.091797 C 12.678984 13.091797 11.296953 13.178906 10.001953 13.128906 L 10.001953 13.53125 C 10.781953 13.68225 11.107422 13.606281 11.107422 14.738281 L 11.107422 20.269531 C 11.107422 21.413531 10.780953 21.325563 10.001953 21.476562 L 10.001953 21.892578 C 10.378953 21.879578 11.031266 21.841797 11.697266 21.841797 C 12.326266 21.841797 13.144094 21.867578 13.496094 21.892578 L 13.496094 21.476562 C 12.490094 21.338562 12.1875 21.451531 12.1875 20.269531 L 12.1875 17.931641 C 12.5275 17.956641 12.817531 17.955078 13.269531 17.955078 C 14.124531 19.489078 14.94125 20.634781 15.40625 21.175781 C 16.24825 22.193781 17.594875 22.043578 17.921875 21.892578 L 17.921875 21.515625 C 17.418875 21.514625 16.914781 21.175437 16.550781 20.773438 C 15.934781 20.107437 15.104781 19.025641 14.425781 17.806641 C 15.557781 17.529641 16.400391 16.461297 16.400391 15.404297 C 16.400391 13.820297 15.179984 13.091797 13.583984 13.091797 z M 13.320312 13.730469 C 14.502313 13.730469 15.205078 14.346516 15.205078 15.478516 C 15.204078 16.586516 14.450359 17.326172 13.193359 17.326172 C 12.728359 17.326172 12.5145 17.314063 12.1875 17.289062 L 12.1875 13.767578 C 12.5145 13.729578 12.942312 13.730469 13.320312 13.730469 z" />
            </svg>{' '}
          </a>
        ) : (
          <></>
        )}
        {contributor.scholar ? (
          <a href={contributor.scholar}>
            <svg
              className=""
              fill={theme.theme === 'light' ? '#000000' : '#ffffff'}
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M 11 4 L 3 9 L 8.4921875 9 C 8.4715892 9.0754986 8.4383718 9.1441171 8.421875 9.2226562 C 8.375875 9.4646562 8.3398437 9.7308125 8.3398438 10.007812 C 8.3398438 13.578812 11.990234 13.175781 11.990234 13.175781 L 11.990234 14.085938 C 11.990234 14.454937 12.47425 14.327172 12.53125 15.076172 C 12.28925 15.076172 7.4746094 14.937547 7.4746094 18.185547 C 7.4746094 21.445547 11.724609 21.285156 11.724609 21.285156 C 11.724609 21.285156 16.632812 21.504656 16.632812 17.472656 C 16.634813 15.063656 13.822266 14.2795 13.822266 13.3125 C 13.822266 12.3335 15.941406 12.045906 15.941406 9.7539062 C 15.941406 8.7519062 15.872828 8.03825 15.423828 7.53125 C 15.388828 7.49625 15.366031 7.4722188 15.332031 7.4492188 C 15.324304 7.4420199 15.31448 7.4367774 15.306641 7.4296875 L 15.429688 7.4296875 L 17.5 5.8769531 L 17.5 8 A 0.50005 0.50005 0 0 0 17.511719 8.1152344 A 1.0001 1.0001 0 0 0 17 9 L 17 10 A 1.0001 1.0001 0 1 0 19 10 L 19 9 A 1.0001 1.0001 0 0 0 18.488281 8.1152344 A 0.50005 0.50005 0 0 0 18.5 8 L 18.5 5.125 L 20 4 L 11 4 z M 11.691406 7.0527344 C 11.979219 7.0397031 12.268922 7.109625 12.544922 7.265625 C 12.751922 7.369625 12.946141 7.518125 13.119141 7.703125 C 13.476141 8.060125 13.7765 8.5784531 13.9375 9.1894531 C 14.3175 10.640453 13.823828 12.035781 12.798828 12.300781 C 11.784828 12.587781 10.654672 11.641172 10.263672 10.201172 C 10.090672 9.4991719 10.114547 8.8202969 10.310547 8.2792969 C 10.312395 8.2723193 10.316443 8.2666961 10.318359 8.2597656 C 10.321722 8.2581149 10.32682 8.253536 10.330078 8.2519531 C 10.386262 8.0380596 10.478099 7.8461668 10.589844 7.6875 C 10.795388 7.3872165 11.066477 7.1838352 11.404297 7.09375 C 11.499297 7.07075 11.595469 7.0570781 11.691406 7.0527344 z M 12.082031 15.685547 C 13.775031 15.558547 15.216313 16.490813 15.320312 17.757812 C 15.390313 19.013813 14.087812 20.131094 12.382812 20.246094 C 10.689813 20.361094 9.2274844 19.441547 9.1464844 18.185547 C 9.0654844 16.918547 10.377031 15.812547 12.082031 15.685547 z" />
            </svg>
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
        {contributor.x ? (
          <a href={contributor.x}>
            <FaXTwitter />
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
  };

  const renderPositions = (contributor) => {
    if (contributor.positions.length <= 3) {
      return contributor.positions.map((position) => {
        return (
          <div className="text-gray-500" key={position}>
            {position}
          </div>
        );
      });
    }
    return (
      <>
        <div className="text-gray-500">{contributor.positions[0]}</div>
        <div className="text-gray-500">{contributor.positions[1]}</div>
        <div className="text-gray-500">
          {contributor.positions[2]}
          {showMorePositions.includes(contributor.id) ? (
            <></>
          ) : (
            <span
              className="pl-2 text-elixirblue cursor-pointer"
              onClick={() => renderMore(contributor.id)}
            >
              More...
            </span>
          )}
        </div>
        {showMorePositions.includes(contributor.id) ? (
          contributor.positions.slice(3).map((position, index) => {
            return (
              <div className="text-gray-500" key={position}>
                {position}
                {index === contributor.positions.slice(3).length - 1 ? (
                  <span
                    className="pl-2 text-elixirblue cursor-pointer"
                    onClick={() =>
                      setShowMorePositions(
                        showMorePositions.filter((id) => id !== contributor.id),
                      )
                    }
                  >
                    Less...
                  </span>
                ) : (
                  <></>
                )}
              </div>
            );
          })
        ) : (
          <></>
        )}
      </>
    );
  };

  const renderContributors = () => {
    if (filteredContributorBySearch.length === 0) {
      return (
        <div className="flex items-center">
          <div className="text-base text-gray-700 dark:text-gray-300">
            No Contributors
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
    return filteredContributorBySearch.map((contributor) => {
      return (
        <>
          <Zoom key={contributor.id}>
            <div className="w-full rounded-lg border-2 shadow-lg hover:shadow-md my-5 hover:bg-gray-100  dark:text-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800 dark:border-gray-800 dark:hover:border-gray-900 transition-all">
              <div className="flex md:flex-row flex-col transition-all">
                <img
                  alt={contributor.name}
                  className="md:rounded-l-lg md:rounded-t-none rounded-t-lg md:w-36 md:h-36 object-cover"
                  height="auto"
                  src={contributor.image}
                  width="auto"
                ></img>
                <div className="flex flex-col justify-between flex-grow p-4 sm:flex-row">
                  <div className="flex flex-col">
                    <div className="flex flex-row gap-2 items-baseline">
                      <div className="text-xl font-semibold flex justify-between dark:text-gray-200">
                        {contributor.name}
                      </div>
                      <div className="flex text-sm text-gray-500">
                        {contributor.affiliation}
                      </div>
                    </div>
                    <div className="mt-1 transition-all">
                      {renderPositions(contributor)}
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-0">{renderLinks(contributor)}</div>
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
      <div className="text-3xl font-bold mb-4 mt-5 text-center dark:text-gray-200">
        Contributors
      </div>
      <div className="flex flex-col">
        <div className="flex flex-row w-full items-center justify-between">
          <input
            className="h-10 md:text-base text-sm px-3 py-2 border-2 rounded-lg outline-none w-full focus:shadow-lg hover:shadow-lg placeholder-opacity-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:border-gray-900 dark:hover:border-gray-900 dark:text-gray-200"
            onChange={(e) => {
              handleSearch(e);
            }}
            placeholder="Search.."
            value={query}
          ></input>
          <button
            className="bg-elixirblue text-white ml-2 px-5 py-2 rounded-md md:text-base text-sm"
            onClick={toggleFilters}
          >
            Filter
          </button>
        </div>
        {isFilterOpen ? (
          <ContributorFilter
            affiliations={affiliations}
            contributors={contributors}
            filterformValues={filterformValues}
            roles={roles}
            setFilteredContributors={setFilteredContributors}
            setFilterformValues={setFilterformValues}
          />
        ) : (
          <></>
        )}
      </div>
      <div className="my-10">{renderContributors()}</div>
    </div>
  );
}

export default Contributors;
