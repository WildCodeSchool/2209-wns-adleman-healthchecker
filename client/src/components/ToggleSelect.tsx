import { useEffect } from "react";

interface SelectOption {
  value: number;
  label: string;
}

interface ToggleSelectProps {
  options: SelectOption[];
  toggleChange: () => void;
  value: number;
}

const ToggleSelect: React.FC<ToggleSelectProps> = ({
  options,
  toggleChange,
  value,
}) => {
  const handleChange = () => {
    toggleChange();
  };

  useEffect(() => {});
  return (
    <div className="toggle-switch">
      <span className={value === options[0].value ? "selected" : ""}>
        {options[0].label}
      </span>
      <label className="switch">
        <input
          type="checkbox"
          onChange={handleChange}
          checked={value === options[1].value}
        />
        <span className="slider round"></span>
      </label>
      <span className={value === options[1].value ? "selected" : ""}>
        {options[1].label}
      </span>
    </div>
  );
};

export default ToggleSelect;
