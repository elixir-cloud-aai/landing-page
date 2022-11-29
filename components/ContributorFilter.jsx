import { useContext, useEffect, useState } from "react";
import DarkModeContext from "../context/darkMode";
import Select from "./@ui/Select";

const Modal = ({
  onRequestClose,
  affiliations,
  setFilteredContributors,
  contributors,
  filterformValues,
  setFilterformValues,
  isModalOpen,
}) => {
  const darkMode = useContext(DarkModeContext);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.keyCode === 27 && isModalOpen) {
        onRequestClose();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  });

  const generateAffliationOptions = () => {
    let selectAffiliationOptions = [];
    affiliations?.map((affiliation) => {
      const newOption = {
        label: affiliation,
        value: affiliation,
      };
      selectAffiliationOptions = [...selectAffiliationOptions, newOption];
    });
    return selectAffiliationOptions;
  };

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
    e.stopPropagation()

    const includePastContributor = !filterformValues.pastContributorCheckBox;
    const projectLeadsOnly = filterformValues.projectLeadCheckbox;
    const affiliations = filterformValues.affiliationInput;

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
    if (affiliations !== []) {
      console.log(affiliations)
      affiliations.map(affiliation => {
        filteredContributorByAffiliationCheck =
        filteredContributorByAffiliationCheck?.filter((contributor) => {
            return isAffliatedTo(affiliation.value, contributor);
          });
      })
    }
    setFilteredContributors(filteredContributorByAffiliationCheck);
  };

  const handleSelect = (option) => {
    setFilterformValues({
      ...filterformValues,
      affiliationInput: option,
    })
  }
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
                  onChange={() =>
                    setFilterformValues({
                      ...filterformValues,
                      pastContributorCheckBox:
                        !filterformValues.pastContributorCheckBox,
                    })
                  }
                  checked={filterformValues.pastContributorCheckBox}
                />
                <label
                  htmlFor="past-contributors"
                  className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Active contributors only
                </label>
              </div>
              <div className="flex items-center mb-4 w-full">
                <input
                  id="project-lead"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-elixirblue dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  onChange={() =>
                    setFilterformValues({
                      ...filterformValues,
                      projectLeadCheckbox:
                        !filterformValues.projectLeadCheckbox,
                    })
                  }
                  checked={filterformValues.projectLeadCheckbox}
                />
                <label
                  htmlFor="project-lead"
                  className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Project leads only
                </label>
              </div>
              <Select
                options={generateAffliationOptions()}
                value={filterformValues.affiliationInput}
                multiple={true}
                onChange={(o)=> handleSelect(o)}
                defaultLabel="Select Affliations"
              />
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

const ContributorFilter = ({
  affiliations,
  setFilteredContributors,
  contributors,
  toggleModal,
  isModalOpen,
  filterformValues,
  setFilterformValues,
}) => {
  useEffect(() => {
    const modalWrapper = document.getElementById("modal-wrapper");
    modalWrapper.classList.toggle("h-0", !isModalOpen);
    modalWrapper.classList.toggle("overflow-hidden", !isModalOpen);
    modalWrapper.classList.toggle("overflow-[revert]", isModalOpen);
  }, [isModalOpen]);

  return (
    <div
      id="modal-wrapper"
      className={` transition-[height] duration-500 ease-in-out`}
    >
      {
        <Modal
          onRequestClose={toggleModal}
          affiliations={affiliations}
          setFilteredContributors={setFilteredContributors}
          contributors={contributors}
          filterformValues={filterformValues}
          setFilterformValues={setFilterformValues}
          isModalOpen={isModalOpen}
        />
      }
    </div>
  );
};

export default ContributorFilter;