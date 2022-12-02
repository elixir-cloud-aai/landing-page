const Button = ({type, variant, className, id, onClick, children, size, customStyle}) => {

    type = type?.trim()
    variant = variant?.trim()

    const buttonVariants = {
        primary: " bg-elixirblue border-elixirblue text-white hover:bg-white hover:text-elixirblue ",
        secondary: " bg-white border-elixirblue text-elixirblue hover:bg-elixirblue hover:text-white ",
        warning: " bg-white border-elixiryellow text-elixiryellow hover:bg-elixiryellow hover:text-white ",
        danger: " bg-white border-elixirred text-elixirred hover:bg-elixirred hover:text-white ",
        success: "bg-elixirgreen border-elixirgreen text-white hover:bg-white hover:text-elixirgreen ",
        darkPrimary: "bg-white border-white text-gray-800 hover:bg-gray-800 hover:text-white ",
        darkSecondary: "bg-gray-800 border-white text-white hover:bg-white hover:text-gray-800 ",
    }

    const btnSizeStyle = (size == "sm") ? " w-24 h-8 " : (size == "md") ? " w-44 h-9 " : (size == "lg") ? " w-96 h-11 " : " w-full h-full ";

    const variantStyles = (variant == "primary") ? buttonVariants.primary : (variant == "secondary") ? buttonVariants.secondary : (variant == "warning") ? buttonVariants.warning : (variant == "danger") ? buttonVariants.danger : (variant == "success") ? buttonVariants.success : (variant == "dark-primary") ? buttonVariants.darkPrimary : (variant == "dark-secondary") ? buttonVariants.darkSecondary : buttonVariants.primary

    const btnDefaultClass = `relative inline-flex items-center justify-center text-center align-middle select-none border-2 rounded-md outline-none  cursor-pointer px-3 py-1 ml-2 shadow-md  transition-all ${btnSizeStyle} ${variantStyles}`

    return (
        <button
            type={type ? type : "button"}
            variant={variant}
            className={className ? `${className} ${btnDefaultClass}`: `${btnDefaultClass} `}
            id={id}
            onClick={onClick}
            style={customStyle}
        >
            {children}
        </button>
    )
}

export default Button;