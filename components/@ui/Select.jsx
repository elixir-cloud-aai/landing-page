import { useContext, useState } from 'react';
import DarkModeContext from '../../context/darkMode';

/**
 * @params
 * value: Object | Array of objects
 * onChange: Function
 * options: Array of objects
 * multiple: boolean
 * defaultLabel: String
 */

/**
 * object must have `label` and `value` keys. e.g., { label: "test_label", value: "test_value" }
 * value must be an array of such objects if multiple mode is on
 * empty array can also be used without following the rule of object
 * value must be a single object with mentioned keys if single mode is on
 * onChange must be a function that takes the changed value as parameter
 */
const Select = ({ value, onChange, options, multiple, defaultLabel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const darkMode = useContext(DarkModeContext);

  if (multiple === true && !Array.isArray(value)) {
    // console.error(
    //   'Select element custom error: An array should be passed in value prop for multiple select',
    // );
    return <>Error</>;
  }

  if (multiple === false && Array.isArray(value)) {
    // console.error(
    //   'Select element custom error: An array should "only" be passed in value prop for multiple select',
    // );
    return <>Error</>;
  }

  // const clearOptions = () => {
  //   multiple === true ? onChange([]) : onChange(undefined);
  // };

  const selectOption = (selectedOption) => {
    if (multiple === true) {
      if (isSelectedOption(selectedOption)) {
        onChange(value.filter((opt) => opt.value !== selectedOption.value));
      } else {
        onChange([...value, selectedOption]);
      }
    } else if (selectedOption.value !== value.value) {
      onChange(selectedOption);
    }
  };

  const isSelectedOption = (selectedOption) => {
    if (multiple === true) {
      const payload1 = JSON.stringify(selectedOption);
      let returnValue = null;
      value.forEach((v) => {
        const payload2 = JSON.stringify(v);
        if (payload1 === payload2) {
          returnValue = true;
        }
      });
      if (returnValue !== true) {
        returnValue = false;
      }
      return returnValue;
    }
    return selectedOption.value === value.value;
  };
  return (
    <div
      className="relative flex items-center gap-2 p-2 focus:outline-none focus:border-elixirblue bg-transparent md:ml-1 border-2 border-gray-200 dark:border-gray-700 rounded-lg w-full text-left dark:bg-gray-900 dark:text-white"
      onBlur={() => setIsOpen(false)}
      onClick={() => setIsOpen((prev) => !prev)}
      tabIndex={0}
    >
      <span className="flex-grow">
        {multiple === true
          ? value.map((v) => {
              if (v?.value === '') {
                return null;
              }
              return (
                <button
                  className={
                    'text-xs text-left m-px border border-gray-200 dark:border-gray-700 hover:border-elixirred rounded-lg p-1 hover:bg-elixirred hover:text-white'
                  }
                  key={v.value}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectOption(v);
                  }}
                >
                  {v?.label}
                  <span className="ml-0.5">&times;</span>
                </button>
              );
            })
          : value.label}
        {multiple === true && value.length === 0 ? (
          <span className="text-sm dark:text-gray-300">{defaultLabel}</span>
        ) : (
          ''
        )}
      </span>
      <svg
        className="w-4 h-4"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          clipRule="evenodd"
          d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
          fillRule="evenodd"
        />
      </svg>

      <ul
        className={`m-0 p-0 list-none max-h-60 overflow-y-auto border-2 border-solid border-gray-200 dark:border-gray-700 rounded-md w-full absolute left-0 top-full mt-2 z-10 bg-white ${
          !isOpen ? 'hidden' : null
        }`}
      >
        {' '}
        {options.map((option) => (
          <li
            className={`text-sm px-3 py-2 hover:bg-gray-500 hover:text-white ${
              darkMode ? 'bg-gray-900 text-gray-400 border-gray-500 ' : ''
            } ${isSelectedOption(option) ? 'bg-elixirblue text-white' : ''}`}
            key={option.value}
            onClick={(e) => {
              e.stopPropagation();
              selectOption(option);
              setIsOpen(false);
            }}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Select;
