import { useEffect, useRef, useState } from "react"
import { fetchHelperFunction } from "../../lib/fetch/json-fetch-data"
import { useSession } from "next-auth/react"
import { format } from "date-fns"
function RepairItemDetail(props) {
	const { item, replaceListHandler, modalHandler, state } = props
	const [reply, setReply] = useState([])
	const replyInputRef = useRef()
	const { data: session } = useSession()
	const userId = session.user.image._id
	async function repairCompletedHandler(buttonValue) {
		if (state === "수리접수") {
			await repairStateUpdateFunction(item, "수리완료", modalHandler)
		} else {
			await repairStateUpdateFunction(item, buttonValue, modalHandler, userId)
		}
	}

	async function onSubmitHandler(e) {
		e.preventDefault()

		const accept = confirm("댓글을 작성 하시겠습니까?")

		if (!accept) {
			return
		} else {
			const today = new Date()
			const formattedToday = format(today, "MM/dd")

			const replyBody = {
				repairId: item._id,
				writerName: session.user.name,
				date: formattedToday,
				note: replyInputRef.current.value,
			}

			const response = await fetchHelperFunction(
				"POST",
				"/api/repair/reply",
				replyBody,
			)

			if (!response.success) {
				alert(response.message)
			} else {
				setReply(reply.concat(replyBody))
				replyInputRef.current.value = ""
			}
		}
	}

	useEffect(() => {
		return replaceListHandler
	})

	return (
		<div className="divide-y divide-gray-300/25 w-full lg:w-[32rem]">
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
			<div
				className="px-4 py-2 lg:flex lg:h-18 text-gray-700 font-normal 
							mb-2 lg:mb-1 text-lg lg:basis-1/3 lg:h-full lg:pl-7  "
			>
				댓글
			</div>
			<div className="px-4 py-2 lg:flex-col lg:h-18  ">
				{item.reply &&
					item.reply.map((item, index) => (
						<div className="flex-col justify-between pl-8 mb-2" key={index}>
							<div className="mb-1">
								<span className=" text-sm ">{item.writerName} </span>
								<span className="text-sm text-gray-300">{item.date}</span>
							</div>
							<div className="pl-2">{item.note}</div>
						</div>
					))}

				<div>
					<form onSubmit={onSubmitHandler}>
						<input
							type="text"
							ref={replyInputRef}
							className="px-4 h-9 mt-3 block w-full  rounded-md border border-gray-300 
								shadow-lg lg:text-sm focus:border-primary focus:ring-2  
								focus:ring-primary focus:outline-none"
						/>
					</form>
				</div>
			</div>
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
		<div className="px-4 py-2 lg:flex lg:h-18 ">
			<div className="text-gray-700 font-normal mb-2 lg:mb-1 text-lg lg:basis-1/3 lg:h-full lg:pl-3 ">
				{props.title}
			</div>
			<div className="lg:w-full lg:h-full text-lg">{props.desc}</div>
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
