import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string | null;
};

const Input: React.FC<InputProps> = ({
  label,
  error,
  className = "",
  ...rest
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {label ? (
        <label className="mb-1 text-sm font-medium">{label}</label>
      ) : null}
      <input
        className={`px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300 ${error ? "border-red-400" : "border-gray-300"}`}
        {...rest}
      />
      {error ? (
        <span className="mt-1 text-xs text-red-500">{error}</span>
      ) : null}
    </div>
  );
};

export default Input;
