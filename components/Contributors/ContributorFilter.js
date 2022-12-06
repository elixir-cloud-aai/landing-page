import React from "react";
import Select from "../@ui/Select";

const ContributorFilter = ({
  affiliations,
  setFilteredContributors,
  contributors,
  filterformValues,
  setFilterformValues,
}) => {
  const generateAffliationOptions = () => {
    let selectAffiliationOptions = [];
    affiliations?.forEach((affiliation) => {
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

  const handleSelect = (option) => {
    setFilterformValues({
      ...filterformValues,
      affiliationInput: option,
    });
    handleFilter();
  };

  const handleFilter = (e) => {
    const includePastContributor = !filterformValues.pastContributorCheckBox;
    const projectLeadsOnly = !filterformValues.projectLeadCheckbox;
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
      affiliations.forEach((affiliation) => {
        filteredContributorByAffiliationCheck =
          filteredContributorByAffiliationCheck?.filter((contributor) => {
            return isAffliatedTo(affiliation.value, contributor);
          });
      });
    }
    setFilteredContributors(filteredContributorByAffiliationCheck);
  };

  console.log(filterformValues);

  return (
    <div className={`flex justify-center items-center`}>
      <div className={`pl-1 rounded-lg mt-4 w-full`}>
        <form className="flex flex-col lg:flex-row md:items-center md:justify-center">
          <div className="filters flex flex-col md:flex-row flex-[10]">
            <div className="flex flex-col lg:flex-row w-full">
              <div className="flex items-center mb-4 lg:mb-0 w-full">
                <input
                  id="past-contributors"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-elixirblue dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  onChange={() => {
                    setFilterformValues({
                      ...filterformValues,
                      pastContributorCheckBox:
                        !filterformValues.pastContributorCheckBox,
                    });
                    handleFilter();
                  }}
                  checked={filterformValues.pastContributorCheckBox}
                />
                <label
                  htmlFor="past-contributors"
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  Active contributors
                </label>
              </div>
              <div className="flex items-center mb-4 lg:mb-0 w-full">
                <input
                  id="project-lead"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-elixirblue dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  onChange={() => {
                    setFilterformValues({
                      ...filterformValues,
                      projectLeadCheckbox:
                        !filterformValues.projectLeadCheckbox,
                    });
                    handleFilter();
                  }}
                  checked={filterformValues.projectLeadCheckbox}
                />
                <label
                  htmlFor="project-lead"
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  Project leads
                </label>
              </div>
              <Select
                options={generateAffliationOptions()}
                value={filterformValues.affiliationInput}
                multiple={true}
                onChange={(o) => handleSelect(o)}
                defaultLabel="Select Affliations"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContributorFilter;
