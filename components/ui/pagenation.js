function PageNation(props) {
	const { totalPosts, maxPosts, pageHandleFunction } = props

	function pageNumbersFunction(totalPosts) {
		const numbers = []
		const totalPages = Math.ceil(totalPosts / maxPosts)
		for (let i = 1; i <= totalPages; i++) {
			numbers.push(i)
		}
		return numbers
	}

	const pagenationNumbers = pageNumbersFunction(totalPosts)
	return (
		<div className="py-2">
			<button
				className="text-lg text-primary hover:bg-primaryHover hover:text-white 
                h-10 w-8 border border-gray-transparent"
			>
				{"<"}
			</button>
			{pagenationNumbers.map((item, index) => (
				<span key={index + "d"} className="">
					<button
						className="text-lg text-primary hover:bg-primaryHover hover:text-white 
                h-10 w-8 border border-gray-transparent"
						onClick={() => pageHandleFunction(item)}
					>
						{item}
					</button>
				</span>
			))}
			<button
				className="text-lg text-primary hover:bg-primaryHover hover:text-white 
                h-10 w-8 border border-gray-transparent"
			>
				{">"}
			</button>
		</div>
	)
}

export default PageNation
