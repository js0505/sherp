import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import NavBarIcon from "../icons/nav-bar-icon"

function TopNavigation(props) {
	
	return (
		<header className="flex justify-between h-10 text-primary bg-white px-2">
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
