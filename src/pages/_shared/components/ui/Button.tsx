import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: "primary" | "secondary";
};

const VARIANTS: Record<string, string> = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white",
  secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
};

const Button: React.FC<ButtonProps> = ({
  children,
  loading,
  variant = "primary",
  className = "",
  disabled,
  ...rest
}) => {
  const base =
    "inline-flex items-center justify-center px-4 py-2 rounded transition-colors disabled:opacity-60";

  return (
    <button
      type="button"
      className={`${base} ${VARIANTS[variant]} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      ) : null}
      <span>{children}</span>
    </button>
  );
};

export default Button;
