import { useEffect } from "react"
import { fetchHelperFunction } from "../../lib/fetch/json-fetch-data"
import { useSession } from "next-auth/react"

function RepairItemDetail(props) {
	const { item, replaceListHandler, modalHandler, state } = props
	const { data: session } = useSession()
	const userId = session.user.image._id
	async function repairCompletedHandler(buttonValue) {
		if (state === "수리접수") {
			await repairStateUpdateFunction(item, "수리완료", modalHandler)
		} else {
			await repairStateUpdateFunction(item, buttonValue, modalHandler, userId)
		}
	}

	useEffect(() => {
		return replaceListHandler
	})

	return (
		<div className="divide-y divide-gray-300/25 w-full sm:w-[32rem]">
			<div className="px-4 py-2">
				<div className="text-xl font-medium">{item.storeName}</div>
				<div className="text-gray-300">{`${item.product.name} / ${item.user.name}`}</div>
			</div>

			<DetailListItem title="날짜" desc={item.date} />
			<DetailListItem title="고장증상" desc={item.symptom || ""} />
			<DetailListItem title="수량" desc={`${item.qty}대`} />
			<DetailListItem title="제품번호" desc={`${item.productNum}`} />
			<DetailListItem
				title="송장번호"
				desc={item.invoiceNum ? item.invoiceNum : "없음"}
			/>
			<DetailListItem title="메모" desc={item.note} />
			<div className="w-full flex p-2">
				<button
					onClick={
						state === "수리접수"
							? repairCompletedHandler
							: () => repairCompletedHandler("원복완료")
					}
					className="modal-button mr-1"
				>
					{state === "수리접수" ? "수리완료, 입고" : "원복완료"}
				</button>
				{state === "수리완료" && (
					<button
						onClick={() => repairCompletedHandler("재고입고")}
						className="modal-button mr-1"
					>
						재고입고
					</button>
				)}
				<button onClick={modalHandler} className="modal-button">
					취소
				</button>
			</div>
		</div>
	)
}

function DetailListItem(props) {
	return (
		<div className="px-4 py-2 sm:flex sm:h-18 ">
			<div className="text-gray-700 font-normal mb-2 sm:mb-1 text-sm sm:basis-1/3 sm:h-full sm:pl-3 ">
				{props.title}
			</div>
			<div className="sm:w-full sm:h-full text-sm">{props.desc}</div>
		</div>
	)
}

async function repairStateUpdateFunction(item, value, modalHandler, userId) {
	const accept = confirm(`${value} 처리 하시겠습니까?`)

	if (!accept) {
		return
	} else {
		const body = {
			id: item._id,
			state: value,
			product: item.product._id,
			qty: item.qty,
			user: userId,
		}
		const response = await fetchHelperFunction("PATCH", "/api/repair", body)
		alert(response.message)
		modalHandler()
	}
}

export default RepairItemDetail
