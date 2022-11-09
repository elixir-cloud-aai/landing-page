import { useContext, useEffect, useState } from "react";
import DarkModeContext from "../context/darkMode";

const Modal = ({
  onRequestClose,
  affiliations,
  setFilteredContributors,
  filteredContributorBySearch,
}) => {

  // const [pastContributorCheck, setPastContributorCheck] = useState(false);
  // const [projectLeadCheck, setProjectLeadCheck] = useState(false);

  const darkMode = useContext(DarkModeContext);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.keyCode === 27) {
        // Close the modal when the Escape key is pressed
        onRequestClose();
      }
    }

    // Prevent scolling
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    // Clear things up when unmounting this component
    return () => {
      document.body.style.overflow = "visible";
      document.removeEventListener("keydown", onKeyDown);
    };
  });

  const isActiveContributor = (contributor) => {
    const position = contributor.positions;
    if (position.includes("Past contributor")) return false;
    return true;
  };

  const isProjectLead = (contributor) => {
    const position = contributor.positions;
    if (position.includes("GA4GH Driver Project Champion")) return true;
    return false;
  };

  const isAffliatedTo = (affiliation, contributor) => {
    const position = contributor.positions;
    if (position.includes(affiliation)) return true;
    return false;
  };

  const haveRole = (role, contributor) => {
    const position = contributor.positions;
    if (position.includes(role)) return true;
    return false;
  };

  const handleFilter = (e) => {
    e.preventDefault();
    // console.log(e);

    // TODO: filter logic
    const includePastContributor = e.target[0].checked;
    const projectLeadsOnly = e.target[1].checked;
    const affiliation = e.target[2].value;
    const role = e.target[3].value;
    // console.log(includePastContributor, projectLeadsOnly, affiliation, role);

    let filteredContributorByPastContributorCheck,
      filteredContributorByProjectLeadCheck,
      filteredContributorByAffiliationCheck,
      filteredContributorByRoleCheck;

    filteredContributorByPastContributorCheck = filteredContributorBySearch;
    if (!includePastContributor) {
      filteredContributorByPastContributorCheck =
        filteredContributorBySearch?.filter((contributor) => {
          return isActiveContributor(contributor);
        });
      console.log(filteredContributorByPastContributorCheck);
    }

    filteredContributorByProjectLeadCheck =
      filteredContributorByPastContributorCheck;
    if (projectLeadsOnly) {
      filteredContributorByProjectLeadCheck =
        filteredContributorByPastContributorCheck?.filter((contributor) => {
          return isProjectLead(contributor);
        });
    }

    filteredContributorByAffiliationCheck =
      filteredContributorByProjectLeadCheck;
    if (affiliation !== "Select Affiliation") {
      filteredContributorByAffiliationCheck =
        filteredContributorByProjectLeadCheck?.filter((contributor) => {
          return isAffliatedTo(affiliation, contributor);
        });
    }

    filteredContributorByRoleCheck = filteredContributorByAffiliationCheck;
    if (role !== "Select Role") {
      filteredContributorByRoleCheck =
        filteredContributorByAffiliationCheck?.filter((contributor) => {
          return haveRole(role, contributor);
        });
    }

    setFilteredContributors(filteredContributorByRoleCheck)

    onRequestClose();
  };

  return (
    <div
      className="modal__backdrop fixed inset-0 z-10 bg-black bg-opacity-75 backdrop-blur-2xl flex justify-center items-center"
      onClick={() => {
        onRequestClose();
      }}
    >
      <div
        className={`modal__container border-2 bg-white rounded-sm p-3 w-full m-80 ${darkMode ? `bg-gray-900 text-white border-gray-900` : null}`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <form
          onSubmit={(e) => {
            handleFilter(e);
          }}
        >
          <div className="filters flex flex-col md:flex-row">
            <div className="flex flex-col md:flex-row w-full">
              <div className="flex items-center mb-4 w-full">
                <input
                  id="past-contributors"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-elixirblue dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  // onChange={()=>setPastContributorCheck(!pastContributorCheck)}
                  // checked={pastContributorCheck}
                />
                <label
                  htmlFor="past-contributors"
                  className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Include Past contributors
                </label>
              </div>
              <div className="flex items-center mb-4 w-full">
                <input
                  id="project-lead"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-elixirblue dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  // onChange={()=>setProjectLeadCheck(!projectLeadCheck)}
                  // checked={projectLeadCheck}
                />
                <label
                  htmlFor="project-lead"
                  className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Project leads only
                </label>
              </div>
              <select
                aria-label="select"
                className={`focus:outline-none focus:border-elixirblue bg-transparent ml-1 border-2 rounded w-full ${darkMode ? `bg-gray-900 text-white border-gray-500` : null}`}
              >
                <option className={`text-sm  text-gray-900 ${!darkMode ? `text-gray-900` : null} ${darkMode ? `bg-gray-900 text-white border-gray-900` : null}`}>
                  Select Affiliation
                </option>
                {affiliations &&
                  affiliations.map((affiliation) => (
                    <option
                    // TODO: dark mode not working
                      className={`text-sm  text-gray-900 ${!darkMode ? `text-gray-900` : null} ${darkMode ? `bg-gray-900 text-white border-gray-900` : null}`}
                      value={affiliation}
                    >
                      {affiliation}
                    </option>
                  ))}
              </select>
              <select
                aria-label="select"
                className={`focus:outline-none focus:border-elixirblue bg-transparent ml-1 border-2 rounded w-full ${darkMode ? `bg-gray-900 text-white border-gray-500` : null}`}
              >
                <option className={`text-sm  text-gray-900 ${!darkMode ? `text-gray-900` : null} ${darkMode ? `bg-gray-900 text-white border-gray-900` : null}`}>Select Role</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            // onClick={onRequestClose}
            className="bg-elixirblue border-0 rounded-sm text-white cursor-pointer transition-all px-3 py-1"
          >
            Apply
          </button>
        </form>
      </div>
    </div>
  );
};

const FilterModal = ({
  affiliations,
  setFilteredContributors,
  filteredContributorBySearch,
}) => {
  const [isModalOpen, setModalIsOpen] = useState(false);
  const toggleModal = () => {
    setModalIsOpen(!isModalOpen);
  };

  return (
    <main>
      {isModalOpen && (
        <Modal
          onRequestClose={toggleModal}
          affiliations={affiliations}
          setFilteredContributors={setFilteredContributors}
          filteredContributorBySearch={filteredContributorBySearch}
        />
      )}
      <button
        onClick={toggleModal}
        type="button"
        className="bg-elixirblue border-0 rounded-sm text-white cursor-pointer transition-all px-3 py-1 ml-2"
      >
        Filter
      </button>
    </main>
  );
};

export default FilterModal;
