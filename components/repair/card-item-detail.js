import { useRef } from "react"
import { useSession } from "next-auth/react"
import { format } from "date-fns"
import DetailListItem from "../ui/detail-list-item"
import { api } from "../../query/api"
function RepairItemDetail({ repairId, modalHandler, state }) {
	// item : 상세 수리정보 데이터
	// modalHandler : 모달 창 켜고 끄는 상태변경 함수
	// state : 상태 값. 이 값으로 로그 창에서 다르게 핸들링 필요?

	const replyInputRef = useRef()

	const { data: session } = useSession()

	const userId = session.user.image._id

	const today = new Date()
	const formattedToday = format(today, "yyyy-MM-dd")

	const [setRepairListState] = api.useSetRepairListStateMutation()
	const [setRepairReply] = api.useSetRepairReplyMutation()
	const { data } = api.useGetRepairItemByIdQuery({ repairId })

	const item = data?.repair

	const repairCompletedHandler = async (buttonValue) => {
		if (state === "수리접수") {
			await repairStateUpdateFunction(item, "수리완료", modalHandler)
		} else if (state === "수리완료") {
			await repairStateUpdateFunction(item, buttonValue, modalHandler, userId)
		}
	}

	const repairStateUpdateFunction = async (
		item,
		value,
		modalHandler,
		userId,
	) => {
		const accept = confirm(`${value} 처리 하시겠습니까?`)

		if (!accept) {
			return
		} else {
			const body = {
				id: item._id,
				state: value,
				product: item.product._id,
				qty: item.qty,
				completeUser: userId,
				completeDate: formattedToday,
			}
			const { data: response } = await setRepairListState({ body })
			alert(response.message)
			modalHandler()
		}
	}

	const onReplySubmit = async (e) => {
		e.preventDefault()

		if (replyInputRef.current.value === "") {
			alert("내용을 입력 해주세요.")
			return
		}
		const accept = confirm("댓글을 작성 하시겠습니까?")

		if (!accept) {
			return
		} else {
			const formattedToday = format(today, "MM/dd")

			const replyBody = {
				repairId: item._id,
				writerName: session.user.name,
				date: formattedToday,
				note: replyInputRef.current.value,
			}

			const { data: response } = await setRepairReply({ body: replyBody })

			if (!response.success) {
				alert(response.message)
			} else {
				replyInputRef.current.value = ""
			}
		}
	}

	return (
		<div className="divide-y divide-gray-300/25 w-full lg:w-[40rem]">
			{item && (
				<>
					<div className="px-4 py-2">
						<div className="text-xl font-medium">{item.storeName}</div>
						<div className="text-gray-300">{`${item.product.name} ${
							item.product.van === "없음" ? "" : item.product.van
						} / ${item.user.name}`}</div>
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
					<DetailListItem
						title="댓글"
						desc={
							<>
								<div className=" overflow-auto max-h-80">
									{item.reply.map((item, index) => (
										<div className="flex-col justify-between mb-2" key={index}>
											<div className="mb-1">
												<span className=" text-sm ">{item.writerName} </span>
												<span className="text-sm text-gray-300">
													{item.date}
												</span>
											</div>
											<div className="pl-2">{item.note}</div>
										</div>
									))}
								</div>
								<div>
									<form onSubmit={onReplySubmit}>
										<input
											type="text"
											ref={replyInputRef}
											className="px-4 h-9 my-1 block w-full  rounded-md border border-gray-300 
								shadow-lg lg:text-sm focus:border-primary focus:ring-2  
								focus:ring-primary focus:outline-none"
										/>
									</form>
								</div>
							</>
						}
					/>

					<div className="w-full flex p-2">
						{state === "수리접수" || state === "수리완료" ? (
							<button
								onClick={
									state === "수리접수"
										? () => repairCompletedHandler()
										: () => repairCompletedHandler("원복완료")
								}
								className="modal-button mr-1"
							>
								{state === "수리접수" ? "수리완료, 입고" : "원복완료"}
							</button>
						) : (
							<></>
						)}

						{state === "수리완료" && (
							<button
								onClick={() => repairCompletedHandler("재고입고")}
								className="modal-button mr-1"
							>
								재고입고
							</button>
						)}
						<button onClick={modalHandler} className="modal-button">
							{state === "수리접수" || state === "수리완료" ? "취소" : "확인"}
						</button>
					</div>
				</>
			)}
		</div>
	)
}

export default RepairItemDetail
