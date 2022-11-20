import DarkModeContext from "../../context/darkMode";
import { useContext, useEffect, useState } from "react";

// single select not working properly

const Select = ({ value, onChange, options, multiple }) => {
  if (!multiple) multiple = false;
  if (!(multiple && Array.isArray(value))) {
    console.error(
      "an array should be and only be passed in value prop for multiple select"
    );
    return <>Error</>;
  }
  const [isOpen, setIsOpen] = useState(false);
  const darkMode = useContext(DarkModeContext);
  const clearOptions = () => {
    multiple ? onChange([]) : onChange(undefined);
  };
  const selectOption = (selectedOption) => {
    if (multiple) {
      if (isSelectedOption(selectedOption)) {
        onChange(value.filter((opt) => opt.value !== selectedOption.value));
      } else {
        onChange([...value, selectedOption]);
      }
    } else {
      if (selectedOption.value !== value.value) onChange(selectedOption);
    }
  };

  const isSelectedOption = (selectedOption) => {
    if (multiple) {
      const payload1 = JSON.stringify(selectedOption);
      let returnValue = null
      value.map((v) => {
        const payload2 = JSON.stringify(v);
        if (payload1 === payload2) {
          returnValue = true;
        }
      });
      if(returnValue !== true) returnValue = false;
      return returnValue
    } else {
      return selectedOption.value == value.value;
    }
  };
  return (
    <div
      onClick={() => setIsOpen((prev) => !prev)}
      onBlur={() => setIsOpen(false)}
      tabIndex={0}
      className={`relative min-h-[3.5em] flex items-center gap-2 p-2 focus:outline-none focus:border-elixirblue bg-transparent ml-1 border-2 rounded w-full text-left ${
        darkMode ? `bg-gray-900 text-white border-gray-500` : null
      }`}
    >
      <span className="flex-grow">
        {multiple
          ? value.map((v) => {
              if (v?.value === "") return null;
              return (
                <button
                  key={v.value}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectOption(v);
                  }}
                  className={`text-xs text-left max-w-md border-2 hover:border-elixirred rounded p-1  hover:bg-elixirred hover:text-white m-0.5`}
                >
                  {v?.label}
                  <span className="ml-0.5">&times;</span>
                </button>
              );
            })
          : value.label}
          {(multiple && value.length==0) ? <span className="text-sm text-gray-500">Select affliation</span>: ""}
          {/* {(!multiple && !value) ? `Select affliation`: ""} */}
      </span>
      {!multiple ? (
        <button
          className="bg-transparent text-[#777] border-none outline-none p-0 text-xl focus:text-[#333] hover:text-[#333]"
          onClick={(e) => {
            e.stopPropagation();
            clearOptions();
          }}
        >
          &times;
        </button>
      ) : (
        ""
      )}
      <div className="bg-[#777] w-0.5 self-stretch"></div>
      <div
        className="border-4 border-solid border-transparent"
        style={{ borderTopColor: "#777" }}
      ></div>
      <ul
        className={`m-0 p-0 list-none max-h-60 overflow-y-auto border-2 border-solid border-[#777] rounded-md w-full absolute left-0 top-full mt-2 z-10 bg-white ${
          !isOpen ? `hidden` : null
        }`}
      >
        {" "}
        {options.map((option) => (
          <li
            onClick={(e) => {
              e.stopPropagation();
              selectOption(option);
              setIsOpen(false);
            }}
            className={`text-sm hover:bg-gray-500 hover:text-white ${
              darkMode ? `bg-gray-900 text-gray-400 border-gray-500 ` : ""
            } ${isSelectedOption(option) ? `bg-elixirblue text-white` : ""}`}
            key={option.value}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Select;
