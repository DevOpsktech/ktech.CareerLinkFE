/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

type FieldType = "text" | "date" | "select";

interface Option {
  value: string;
  label: string;
}

interface FormFieldProps {
  id: string;
  label: string;
  type?: FieldType;
  value: string;
  onChange: (e: React.ChangeEvent<any>) => void;
  options?: Option[]; // for select
  required?: boolean;
  placeholder?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  options,
  required,
  placeholder,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label} {required && "*"}
      </label>

      {type === "select" ? (
        <select
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      )}
    </div>
  );
};
