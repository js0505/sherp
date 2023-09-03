import Navigation from "./navbar/Navigation"

const Layout = ({ children }) => {
	return (
		<>
			<Navigation />

			<main className="pt-16 md:pt-28 md:pb-20">
				{children}
			</main>
		</>
	)
}

export default Layout
