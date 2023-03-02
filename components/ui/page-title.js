/**
 * @param {string} title - 페이지 제목
 */
const PageTitle = ({ title }) => {
	return (
		<header className=" text-lg lg:text-2xl font-medium w-full mb-3 lg:mb-6 lg:px-28">
			{title}
		</header>
	)
}

export default PageTitle
