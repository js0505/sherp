import ReactPaginate from "react-paginate"

/**
 *
 * @param {function} onPageChange - 페이지 넘버 변경 함수
 * @param {Number} pageRangeDisplayed - 페이지에 나타낼 총 아이템 수
 * @param {Number} pageCount - 전체 아이탬 갯수
 */
interface Props {
	onPageChange: (e: any) => void
	pageRangeDisplayed: number
	pageCount: number
}
const Pagenation = ({ onPageChange, pageRangeDisplayed, pageCount }: Props) => {
	return (
		<ReactPaginate
			breakLabel="..."
			nextLabel=">"
			onPageChange={onPageChange}
			pageRangeDisplayed={pageRangeDisplayed}
			pageCount={Math.ceil(pageCount / pageRangeDisplayed)}
			previousLabel="<"
			className="
				py-2 
				flex 
				justify-center
			"
			pageClassName="
				text-lg 
				py-1 
				text-center
            	h-10 
				w-8 
				border 
				border-gray-transparent 
				hover:bg-sky-600
				hover:text-white
			"
			previousClassName="
				text-lg 
				text-center 
				py-1
				h-10
				w-8 
				border 
				border-gray-transparent
			"
			nextClassName="
				text-lg 
				text-center 
				py-1
				h-10 
				w-8 
				border 
				border-gray-transparent
			"
			activeLinkClassName="
				text-white
			"
			activeClassName="
				bg-sky-600
			"
		/>
	)
}

export default Pagenation
