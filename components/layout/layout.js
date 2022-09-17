import { useState } from "react"
import TopNavigation from "./top-navigation"
import SideBar from "./side-bar"

function Layout(props) {
	const [showSideBar, setShowSideBar] = useState(false)

	function sideBarHandler() {
		setShowSideBar(!showSideBar)
	}
	return (
		<>
			<TopNavigation sideBarHandler={sideBarHandler} />
			<div className="md:flex">
				<SideBar showSideBar={showSideBar} sideBarHandler={sideBarHandler} />
				<main className="bg-white pt-10 px-7 w-full">{props.children}</main>
			</div>
		</>
	)
}

export default Layout
