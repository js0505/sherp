import ReactPaginate from "react-paginate"

/**
 *
 * @param {function} onPageChange - 페이지 넘버 변경 함수
 * @param {Number} pageRangeDisplayed - 페이지에 나타낼 총 아이템 수
 * @param {Number} pageCount - 전체 아이탬 갯수
 */
const PagenationUi = ({ onPageChange, pageRangeDisplayed, pageCount }) => {
	return (
		<ReactPaginate
			breakLabel="..."
			nextLabel=">"
			
			onPageChange={onPageChange}
			pageRangeDisplayed={pageRangeDisplayed}
			pageCount={pageCount / pageRangeDisplayed}
			previousLabel="<"
			className="py-2 flex justify-center"
			pageClassName="text-lg py-1 text-center text-primary
            hover:bg-primaryHover hover:text-white 
            h-10 w-8 border border-gray-transparent "
			previousClassName="text-lg text-primary text-center py-1
            hover:bg-primaryHover hover:text-white
            h-10 w-8 border border-gray-transparent"
			nextClassName="text-lg text-primary text-center py-1
            hover:bg-primaryHover hover:text-white
            h-10 w-8 border border-gray-transparent"
			activeLinkClassName="bg-primaryHover text-white"
			activeClassName="bg-primaryHover text-white"
		/>
	)
}

export default PagenationUi
