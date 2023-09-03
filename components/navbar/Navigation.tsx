import Menu from "./Menu"
import Logo from "./Logo"
import Container from "../Container"

export default function Navigation() {
	return (
		<div
			className="
				fixed
				w-full
				z-10
				shadow-sm
				bg-white
			"
		>
			<div
				className="
					py-2
					border-b-[1px]
				"
			>
				<Container>
					<div
						className="
							flex
							gap-12
						"
					>
						<Logo />
						<Menu />
						<div className="hidden md:block" />
					</div>
				</Container>
			</div>
		</div>
	)
}
