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
			<div className="">
				<TopNavigation sideBarHandler={sideBarHandler} />
				<div className="sm:flex h-screen">
					<SideBar showSideBar={showSideBar} sideBarHandler={sideBarHandler} />
					<main className="bg-white pt-10 sm:pt-20 px-8 w-full  ">
						{props.children}
					</main>
				</div>
			</div>
		</>
	)
}

export default Layout
