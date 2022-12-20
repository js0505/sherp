/**
 * @param {string} title - 페이지 제목
 */
const PageTitle = ({ title }) => {
	return (
		<header className="text-2xl font-medium w-full mb-2 lg:mb-10  lg:px-12">
			{title}
		</header>
	)
}

export default PageTitle
