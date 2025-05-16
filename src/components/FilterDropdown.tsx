
import React from 'react';

interface FilterDropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ 
  label, 
  value, 
  options, 
  onChange 
}) => {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium">{label}:</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-100 text-gray-800 px-3 py-1 rounded text-sm min-w-[150px]"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterDropdown;
