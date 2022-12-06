import { React } from "react";

/**
 *
 * @param
 * type: string
 * variant: string (primary - default, secondary, warning, danger, dark-primary, dark-secondary)
 * className: string
 * id: string
 * onClick: function
 * children: string
 * size: string (sm, md, lg)
 * customStyles: Object with styles, e.g., { backgroundColor: '#efefef' }
 *
 * @returns <button> {children} </button>
 */

const Button = ({ type, variant, className, id, onClick, children, size, customStyle }) => {
  type = type?.trim()?.toLowerCase();
  variant = variant?.trim()?.toLowerCase();
  size = size?.trim()?.toLowerCase();

  const buttonVariants = {
    primary: "bg-elixirblue text-white border-elixirblue ",
    secondary: " bg-white border-2 border-elixirblue text-elixirblue ",
    warning: " bg-elixiryellow border-elixiryellow text-white ",
    danger: " bg-elixirred border-elixirred text-white",
    success: "bg-elixirgreen border-elixirgreen text-white",
    darkPrimary: "bg-white border-white text-gray-800 hover:bg-gray-200 ",
    darkSecondary: "bg-gray-800 border-2  border-white text-white hover:bg-gray-700  ",
  };

  const btnSizeStyle = size === "sm" ? " w-24 h-8 " : size === "md" ? " w-44 h-9 " : size === "lg" ? " w-96 h-11 " : " w-full h-full ";

  const variantStyles =
    variant === "primary" ? buttonVariants.primary : variant === "secondary" ? buttonVariants.secondary : variant === "warning" ? buttonVariants.warning : variant === "danger" ? buttonVariants.danger : variant === "success" ? buttonVariants.success : variant === "dark-primary" ? buttonVariants.darkPrimary : variant === "dark-secondary" ? buttonVariants.darkSecondary : buttonVariants.primary;

  const btnDefaultClass = `relative inline-flex items-center justify-center text-center align-middle select-none outline-none cursor-pointer px-3 py-4 transition-all rounded-md hover:shadow-lg ${btnSizeStyle} ${variantStyles}`;

  return (
    <button type={type || "button"} className={className ? `${className} ${btnDefaultClass}` : `${btnDefaultClass} `} id={id} onClick={onClick} style={customStyle}>
      {children}
    </button>
  );
};

export default Button;
