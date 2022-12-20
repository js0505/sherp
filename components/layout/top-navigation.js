import Link from "next/link"
import NavBarIcon from "../icons/nav-bar-icon"

const TopNavigation = (props) => {
	return (
		<header className="flex justify-between h-10 z-30  w-full text-primary bg-white px-2 fixed ">
			<Link href="/">
				<a>
					<div className="text-3xl font-bold">SHerp</div>
				</a>
			</Link>
			<div className="md:hidden" onClick={props.sideBarHandler}>
				<NavBarIcon />
			</div>
		</header>
	)
}

export default TopNavigation
