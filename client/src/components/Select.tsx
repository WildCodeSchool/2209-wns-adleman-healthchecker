export interface Ioption {
  label: string;
  value: number;
}
interface ISelectProps {
  value: number;
  onChange: (value: number) => void;
  options: Ioption[];
}

const Select: React.FC<ISelectProps> = ({ value, onChange, options }) => {
  return (
    <select
      className="customSelect"
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
