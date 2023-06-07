interface MenuItemProps {
	onClick: () => void
	label: string
}
const MenuItem: React.FC<MenuItemProps> = ({ onClick, label }) => {
	return (
		<div
			onClick={onClick}
			className="
                px-4 
				py-2
				w-fit
                transition
				cursor-pointer
				text-neutral-400
				text-md
				md:text-base
				hover:text-black
    "
		>
			{label}
		</div>
	)
}

export default MenuItem
