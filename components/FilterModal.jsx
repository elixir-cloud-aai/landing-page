import { useContext, useEffect, useState } from "react";
import DarkModeContext from "../context/darkMode";

const Modal = ({
  onRequestClose,
  affiliations,
  setFilteredContributors,
  contributors,
  filterformValues,
  setFilterformValues,
  isModalOpen
}) => {
  const darkMode = useContext(DarkModeContext);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.keyCode === 27 && isModalOpen) {
        // Close the modal when the Escape key is pressed
        onRequestClose();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
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
      filteredContributorByAffiliationCheck;

    filteredContributorByPastContributorCheck = contributors;
    if (!includePastContributor) {
      filteredContributorByPastContributorCheck = contributors?.filter(
        (contributor) => {
          return isActiveContributor(contributor);
        }
      );
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
    if (affiliation !== "") {
      filteredContributorByAffiliationCheck =
        filteredContributorByProjectLeadCheck?.filter((contributor) => {
          return isAffliatedTo(affiliation, contributor);
        });
    }
    setFilteredContributors(filteredContributorByAffiliationCheck);
  };

  return (
    <div
      className={`modal__backdrop flex justify-center items-center`}
      onClick={() => {
        onRequestClose();
      }}
    >
      <div
        className={`modal__container border-2 bg-white rounded-lg p-3 mt-5 w-full ${
          darkMode ? `bg-gray-900 text-white border-gray-900` : null
        }`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <form
          onSubmit={(e) => {
            handleFilter(e);
          }}
          className="lg:block flex flex-col"
        >
          <div className="filters flex flex-col md:flex-row">
            <div className="flex flex-col md:flex-row w-full">
              <div className="flex items-center mb-4 w-full">
                <input
                  id="past-contributors"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-elixirblue dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  onChange={()=>setFilterformValues({...filterformValues, pastContributorCheckBox: !filterformValues.pastContributorCheckBox})}
                  checked={filterformValues.pastContributorCheckBox}
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
                  onChange={()=>setFilterformValues({...filterformValues, projectLeadCheckbox: !filterformValues.projectLeadCheckbox})}
                  checked={filterformValues.projectLeadCheckbox}
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
                className={`focus:outline-none focus:border-elixirblue bg-transparent ml-1 border-2 rounded w-full ${
                  darkMode ? `bg-gray-900 text-white border-gray-500` : null
                }`}
                onChange={(e)=>setFilterformValues({...filterformValues, affiliationInput: e.target.value})}
                value={filterformValues.affiliationInput}
              >
                <option
                  className={`text-sm  ${!darkMode ? `text-gray-900` : null} ${
                    darkMode ? `bg-gray-900 text-white border-gray-900` : null
                  }`}
                  value={""}
                >
                  Select Affiliation
                </option>
                {affiliations &&
                  affiliations.map((affiliation) => (
                    <option
                      className={`text-sm  ${
                        !darkMode ? `text-gray-900` : null
                      } ${
                        darkMode
                          ? `bg-gray-900 text-white border-gray-900`
                          : null
                      }`}
                      value={affiliation}
                      key={affiliation}
                    >
                      {affiliation}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="bg-elixirblue border-0 rounded-sm text-white cursor-pointer transition-all px-3 py-1 mt-1 md:m-auto"
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
  contributors,
  toggleModal,
  isModalOpen,
  filterformValues,
  setFilterformValues,
}) => {

  useEffect(() => {
    const modalWrapper = document.getElementById("modal-wrapper")
    modalWrapper.classList.toggle("h-0", !isModalOpen)
  }, [isModalOpen])

  return (
    <div 
    id="modal-wrapper"
    className={` transition-[height] duration-500 ease-in-out overflow-hidden`}
    >
      {(
        <Modal
          onRequestClose={toggleModal}
          affiliations={affiliations}
          setFilteredContributors={setFilteredContributors}
          contributors={contributors}
          filterformValues={filterformValues}
          setFilterformValues={setFilterformValues}
          isModalOpen={isModalOpen}
        />
      )}
    </div>
  );
};

export default FilterModal;
