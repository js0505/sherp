function PageNation(props) {
	// totalPosts : 화면에 나타낼 총 데이터의 개수
	// maxPosts : 한 페이지 당 나타 낼 데이터의 개수
	// pageHandleFunction : 상위 컴포넌트에서 현재 페이지 번호를 수정하는 함수
	// page : 현재 페이지를 나타내는 상위 컴포넌트의 상태
	const { totalPosts, maxPosts, pageHandleFunction, page } = props

	const pagenationNumbers = []
	const totalPages = Math.ceil(totalPosts / maxPosts)
	for (let i = 1; i <= totalPages; i++) {
		pagenationNumbers.push(i)
	}

	return (
		<div className="py-2">
			<button
				className="text-lg text-primary hover:bg-primaryHover hover:text-white 
                h-10 w-8 border border-gray-transparent"
				onClick={() => pageHandleFunction(page - 1)}
				disabled={page === 1}
			>
				{"<"}
			</button>
			{pagenationNumbers.map((item, index) => (
				<span key={index + "d"} className="">
					<button
						className={`text-lg  hover:bg-primaryHover hover:text-white 
                					h-10 w-8 border border-gray-transparent 
									${item === page ? "bg-primary text-white" : "text-primary"}`}
						onClick={() => pageHandleFunction(item)}
					>
						{item}
					</button>
				</span>
			))}
			<button
				className="text-lg text-primary hover:bg-primaryHover hover:text-white 
                h-10 w-8 border border-gray-transparent"
				onClick={() => pageHandleFunction(page + 1)}
				disabled={page === totalPages}
			>
				{">"}
			</button>
		</div>
	)
}

export default PageNation
