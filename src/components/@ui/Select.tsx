import { FC, useContext } from 'react';
import themeContext from '../../context/default-theme';

interface Option {
  label: string;
  value: string;
}
interface SelectProps {
  values: string[];
  onChange: (value: string, multiple: boolean) => void;
  options: Array<Option>;
  multiSelect: boolean;
  defaultLabel: string;
}

const Select: FC<SelectProps> = ({
  values,
  onChange,
  options,
  multiSelect = false,
  defaultLabel,
}) => {
  const context = useContext(themeContext);

  const onSelect = (value: string) => {
    onChange(value, multiSelect);
  };

  const isSelectedOption = (value: string) => {
    return values.includes(value);
  };
  return (
    <select
      className="p-2 max-h-60 block w-full border-2 border-solid light:border-gray-200 dark:border-gray-700 rounded-md bg-white text-sm"
      onChange={(e) => {
        onSelect(e.target.value);
      }}
    >
      <option selected disabled>
        {defaultLabel}
      </option>
      {options.map((option) => (
        <option
          className={`text-sm px-3 py-2 hover:bg-gray-500 hover:text-white ${
            context?.theme == 'dark'
              ? 'bg-gray-900 text-gray-400 border-gray-500 '
              : ''
          }
          ${isSelectedOption(option.value) ? 'bg-elixirblue text-white' : ''}
         `}
          key={option.label}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
