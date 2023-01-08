import { useState } from "react"
import TopNavigation from "./top-navigation"
import SideBar from "./side-bar"

const Layout = (props) => {
	const [showSideBar, setShowSideBar] = useState(false)

	const sideBarHandler = () => {
		setShowSideBar(!showSideBar)
	}
	return (
		<>
			<div className="w-100vh h-100vh">
				<TopNavigation sideBarHandler={sideBarHandler} />
				<div className="sm:flex h-screen">
					<SideBar showSideBar={showSideBar} sideBarHandler={sideBarHandler} />
					<main className="bg-white pt-14 lg:px-8 px-1 w-full ">
						{props.children}
					</main>
				</div>
			</div>
		</>
	)
}

export default Layout
