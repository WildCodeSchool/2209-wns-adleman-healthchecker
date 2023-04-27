import React, { useState } from "react";

interface IDateFilterProps {
  start: string | number | readonly string[] | undefined;
  end: string | number | readonly string[] | undefined;
  onChange: (
    start: string | number | readonly string[] | undefined,
    end: string | number | readonly string[] | undefined
  ) => void;
}

const DateFilter: React.FC<IDateFilterProps> = ({ start, end, onChange }) => {
  const [_start, _setStart] = useState<
    string | number | readonly string[] | undefined
  >(undefined);
  const [_end, _setEnd] = useState<
    string | number | readonly string[] | undefined
  >(undefined);

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.name === "start") {
      _setStart(e.currentTarget.value);
      onChange(e.currentTarget.value, _end);
    } else {
      _setEnd(e.currentTarget.value);
      onChange(_start, e.currentTarget.value);
    }
  };

  return (
    <div className="flex">
      <input
        type="datetime-local"
        id="start"
        name="start"
        value={start}
        onChange={handleChange}
      />
      <input
        type="datetime-local"
        id="end"
        name="end"
        value={end}
        onChange={handleChange}
      />
    </div>
  );
};

export default DateFilter;
