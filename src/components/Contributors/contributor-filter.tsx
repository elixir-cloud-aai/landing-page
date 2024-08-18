import { FC } from 'react';
import Select from '../@ui/select';
import { ContributorFilterProps, Option } from './types';

const ContributorFilter: FC<ContributorFilterProps> = ({
  roles,
  affiliations,
  setFilteredContributors,
  contributors,
  filterformValues,
  setFilterformValues,
  resetFilters,
}) => {
  const generateRoleOptions = () => {
    let selectRoleOptions: Option[] = [];
    roles?.forEach((role) => {
      const newOption: Option = {
        label: role,
        value: role,
      };
      selectRoleOptions = [...selectRoleOptions, newOption];
    });
    selectRoleOptions.sort((a, b) => a.value.localeCompare(b.value));
    return selectRoleOptions;
  };

  const generateAffiliationOptions = () => {
    let selectAffiliationOptions: Option[] = [];
    affiliations?.forEach((affiliation) => {
      const newOption = {
        label: affiliation,
        value: affiliation,
      };
      selectAffiliationOptions = [...selectAffiliationOptions, newOption];
    });
    selectAffiliationOptions.sort((a, b) => a.value.localeCompare(b.value));
    selectAffiliationOptions.unshift({ label: 'All', value: 'all' });
    return selectAffiliationOptions;
  };

  const handleRoleSelect = (option: string, multiple: boolean) => {
    const prevRoleSet = new Set([...filterformValues.rolesInput]);
    if (multiple && prevRoleSet.has(option)) {
      prevRoleSet.delete(option);
    } else if (!multiple) {
      prevRoleSet.clear();
    }
    prevRoleSet.add(option);
    setFilterformValues((prev) => ({
      ...prev,
      rolesInput: [...prevRoleSet],
    }));
  };

  const handleAffiliationSelect = (option: string, multiple: boolean) => {
    const prevAffiliationsSet = new Set([
      ...filterformValues.affiliationsInput,
    ]);
    if (multiple && prevAffiliationsSet.has(option)) {
      prevAffiliationsSet.delete(option);
    } else if (!multiple) {
      prevAffiliationsSet.clear();
    }
    prevAffiliationsSet.add(option);
    setFilterformValues((prev) => ({
      ...prev,
      affiliationsInput: [...prevAffiliationsSet],
    }));
  };

  const showResetButton = () => {
    if (
      filterformValues.projectLeadCheckbox ||
      filterformValues.pastContributorCheckBox ||
      filterformValues.affiliationsInput.length > 0 ||
      filterformValues.rolesInput.length > 0
    )
      return true;
    return false;
  };

  return (
    <div className={'flex justify-center items-center'}>
      <div className={'pl-1 rounded-lg mt-4 w-full'}>
        <form className="flex flex-col lg:flex-row md:items-center md:justify-center">
          <div className="filters flex flex-col md:flex-row flex-[10]">
            <div className="flex flex-col lg:flex-row w-full gap-4">
              <div className="flex items-center w-full ">
                <input
                  checked={filterformValues.pastContributorCheckBox}
                  className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-elixirblue dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  id="past-contributors"
                  onChange={() => {
                    setFilterformValues((prev) => ({
                      ...prev,
                      pastContributorCheckBox: !prev.pastContributorCheckBox,
                    }));
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
              <div className="flex items-center w-full">
                <input
                  checked={filterformValues.projectLeadCheckbox}
                  className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-elixirblue dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  id="project-lead"
                  onChange={() => {
                    setFilterformValues((prev) => ({
                      ...prev,
                      projectLeadCheckbox: !prev.projectLeadCheckbox,
                    }));
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
                defaultLabel="Select Roles"
                multiSelect={true}
                onChange={(value, multiple) =>
                  handleRoleSelect(value, multiple)
                }
                options={generateRoleOptions()}
                values={filterformValues.rolesInput}
              />
              <Select
                defaultLabel="Select Affiliation"
                multiSelect={false}
                onChange={(value, multiple) =>
                  handleAffiliationSelect(value, multiple)
                }
                options={generateAffiliationOptions()}
                values={filterformValues.affiliationsInput}
              />
              {showResetButton() && (
                <button
                  className="bg-elixirred text-white  ml-2 px-5 py-2 rounded-lg md:text-base text-sm"
                  onClick={resetFilters}
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContributorFilter;
