import { useEffect } from 'react';
import Select from '../@ui/Select';

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
    selectAffiliationOptions.sort((a, b) => a.value.localeCompare(b.value));
    return selectAffiliationOptions;
  };

  const isActiveContributor = (contributor) => {
    if (contributor.isActive) {
      return true;
    }
    return false;
  };

  const isProjectLead = (contributor) => {
    const position = contributor.positions;
    if (position.includes('GA4GH Driver Project Champion')) {
      return true;
    }
    return false;
  };

  const isAffliatedTo = (affiliation, contributor) => {
    const position = contributor.positions;
    if (position.includes(affiliation)) {
      return true;
    }
    return false;
  };

  const handleSelect = (option) => {
    setFilterformValues({
      ...filterformValues,
      affiliationInput: option,
    });
  };

  useEffect(() => {
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
        },
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
    // };
  }, [filterformValues]);

  return (
    <div className={'flex justify-center items-center'}>
      <div className={'pl-1 rounded-lg mt-4 w-full'}>
        <form className="flex flex-col lg:flex-row md:items-center md:justify-center">
          <div className="filters flex flex-col md:flex-row flex-[10]">
            <div className="flex flex-col lg:flex-row w-full">
              <div className="flex items-center mb-4 lg:mb-0 w-full">
                <input
                  checked={filterformValues.pastContributorCheckBox}
                  className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-elixirblue dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  id="past-contributors"
                  onChange={() => {
                    setFilterformValues({
                      ...filterformValues,
                      pastContributorCheckBox:
                        !filterformValues.pastContributorCheckBox,
                    });
                  }}
                  type="checkbox"
                />
                <label
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  htmlFor="past-contributors"
                >
                  Active contributors
                </label>
              </div>
              <div className="flex items-center mb-4 lg:mb-0 w-full">
                <input
                  checked={filterformValues.projectLeadCheckbox}
                  className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-elixirblue dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  id="project-lead"
                  onChange={() => {
                    setFilterformValues({
                      ...filterformValues,
                      projectLeadCheckbox:
                        !filterformValues.projectLeadCheckbox,
                    });
                  }}
                  type="checkbox"
                />
                <label
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  htmlFor="project-lead"
                >
                  Project leads
                </label>
              </div>
              <Select
                defaultLabel="Select Affliations"
                multiple={true}
                onChange={(o) => handleSelect(o)}
                options={generateAffliationOptions()}
                value={filterformValues.affiliationInput}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContributorFilter;
