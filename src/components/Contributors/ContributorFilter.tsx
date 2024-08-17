import { FC, useEffect } from 'react';
import Select from '../@ui/select';
import { Contributor, FormValues, Option } from './types';

interface ContributorFilterProps {
  roles?: string[];
  affiliations: string[];
  setFilteredContributors: React.Dispatch<React.SetStateAction<Contributor[]>>;
  contributors: Contributor[];
  filterformValues: FormValues;
  setFilterformValues: React.Dispatch<React.SetStateAction<FormValues>>;
}

const ContributorFilter: FC<ContributorFilterProps> = ({
  roles,
  affiliations,
  setFilteredContributors,
  contributors,
  filterformValues,
  setFilterformValues,
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
    selectAffiliationOptions.unshift({ label: 'All', value: null });
    return selectAffiliationOptions;
  };

  const handleRoleSelect = (option: string) => {
    const prevState = structuredClone(filterformValues);
    prevState.rolesInput = [...prevState.rolesInput, option];
    setFilterformValues({ ...prevState });
  };

  const handleAffiliationSelect = (option: string) => {
    setFilterformValues((prev) => ({
      ...prev,
      affiliationsInput: [...prev.affiliationsInput, option],
    }));
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
                multiple={true}
                onChange={(value) => handleRoleSelect(value)}
                options={generateRoleOptions()}
                values={filterformValues.rolesInput}
              />
              <Select
                defaultLabel="Select Affiliation"
                multiple={false}
                onChange={(value) => handleAffiliationSelect(value)}
                options={generateAffiliationOptions()}
                values={filterformValues.affiliationsInput}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContributorFilter;
