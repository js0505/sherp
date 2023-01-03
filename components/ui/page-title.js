/**
 * @param {string} title - 페이지 제목
 */
const PageTitle = ({ title }) => {
	return (
		<header className="text-2xl font-medium w-full mb-6 lg:px-28">
			{title}
		</header>
	)
}

export default PageTitle
