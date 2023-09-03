"use client"

interface ButtonProps {
	label: string
	onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
	disabled?: boolean
	outline?: boolean
	small?: boolean
	type?: "submit" | "button" | undefined
}

const Button: React.FC<ButtonProps> = ({
	label,
	onClick,
	disabled,
	outline,
	small,
	type = "button",
}) => {
	return (
		<button
			disabled={disabled}
			onClick={onClick}
			type={type}
			className={`
        relative
        disabled:opacity-70
        disabled:cursor-not-allowed
        rounded-md
        
        transition
		duration-200
        w-full
		h-full
        ${outline ? "bg-white" : "bg-sky-600"}
        ${outline ? "hover:opacity-50" : "hover:opacity-80"}
        ${outline ? "border-blue-400" : "border-sky-600"}
        ${outline ? "text-neutral-800" : "text-white"}
        ${small ? "text-sm" : "text-md"}
        ${small ? "py-1" : "py-3"}
        ${small ? "" : "font-semibold"}
        ${small ? "border-[1px]" : "border-2"}
      `}
		>
			{label}
		</button>
	)
}

export default Button
