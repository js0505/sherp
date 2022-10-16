import { useRef, useState } from "react"
// import { fetchHelperFunction } from "../../lib/fetch/json-fetch-data"
// import { useSession } from "next-auth/react"
// import { format } from "date-fns"
import DetailListItem from "../../ui/detail-list-item"
function ProductLogItemDetail(props) {
	// item : 상세 입출고 정보 데이터
	// modalHandler : 모달 창 켜고 끄는 상태변경 함수
	const { item, modalHandler } = props

	return (
		<div className="divide-y divide-gray-300/25 w-full lg:w-[40rem]">
			<div className="px-4 py-2">
				<div className="text-xl font-medium">
					{item.product.brand.name === "없음" ? "" : item.product.brand.name}{" "}
					{item.product.name}
				</div>
				<div className="text-gray-300">
					{item.product.category}
					{item.product.van === "없음" ? "" : ` / ${item.product.van}`}
				</div>
			</div>

			<DetailListItem title="처리날짜" desc={item.date} />
			<DetailListItem title="처리자" desc={item.user.name} />
			<DetailListItem title="조정사유" desc={item.note || ""} />
			<DetailListItem title="조정수량" desc={`${item.quantity}대`} />
			<DetailListItem
				title="입고/출고"
				desc={item.calc === "plus" ? "입고" : "출고"}
			/>

			<div className="w-full p-2">
				<button onClick={modalHandler} className="modal-button">
					확인
				</button>
			</div>
		</div>
	)
}

export default ProductLogItemDetail
