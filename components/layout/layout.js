import { useState } from "react"
import TopNavigation from "./top-navigation"
import SideBar from "./side-bar"
import Head from "next/head"

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
					<main className="bg-primary bg-opacity-10 lg:py-8 lg:px-14 w-full ">
						<div className="bg-white p-3 lg:rounded-xl lg:shadow-lg min-h-[45rem] lg:py-6">
							{props.children}
						</div>
					</main>
				</div>
			</div>
		</>
	)
}

export default Layout
