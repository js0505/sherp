import useDate from "@/hooks/useDate"
import useDetailRepairModal from "@/hooks/useDetailRepairModal"
import {
	useGetRepairItemByIdQuery,
	useSetRepairListStateMutation,
	useSetRepairReplyMutation,
} from "@/query/repairApi"

import { FormEvent, useRef } from "react"
import Button from "../Button"
import DetailListItem from "../ui/DetailListItem"
import Loader from "../Loader"
import Modal from "./Modal"
import { useSession } from "next-auth/react"

type IButtonValue = "수리접수" | "수리완료" | "원복완료" | "재고입고"

function DetailRepairModal() {
	const { data: session } = useSession()
	const replyToday = useDate("MM/dd")
	const today = useDate("yyyy-MM-dd")
	const detailRepairModal = useDetailRepairModal()
	const [setRepairListState] = useSetRepairListStateMutation()
	const [setRepairReply] = useSetRepairReplyMutation()
	const { data, isLoading } = useGetRepairItemByIdQuery({
		repairId: detailRepairModal.repairId,
	})

	const replyInputRef = useRef<HTMLInputElement>(null)

	const userName = session?.user.name

	const repairItem = data?.repair

	const repairItemState = repairItem?.state

	const repairCompletedHandler = async (buttonValue: IButtonValue) => {
		if (repairItemState === "수리접수") {
			await repairStateUpdateFunction(repairItem, "수리완료")
			return
		}
		if (repairItemState === "수리완료") {
			await repairStateUpdateFunction(repairItem, buttonValue, userName)
			return
		}
	}

	const repairStateUpdateFunction = async (item, value, userName?) => {
		const accept = confirm(`${value} 처리 하시겠습니까?`)

		if (!accept) {
			return
		}

		const body = {
			id: item._id,
			state: value,
			product: item.product._id,
			qty: item.qty,
			completeUser: userName,
			completeDate: today,
		}
		const response = await setRepairListState({ body }).unwrap()

		alert(response.message)
		detailRepairModal.onClose()
	}

	const onReplySubmit = async (e: FormEvent) => {
		e.preventDefault()

		if (replyInputRef.current.value === "") {
			alert("내용을 입력 해주세요.")
			return
		}
		const accept = confirm("댓글을 작성 하시겠습니까?")

		if (!accept) {
			return
		}

		const replyBody = {
			repairId: repairItem._id,
			writerName: session.user.name,
			date: replyToday,
			note: replyInputRef.current.value,
		}

		const response = await setRepairReply({
			body: replyBody,
		}).unwrap()

		if (!response.success) {
			alert(response.message)
		} else {
			replyInputRef.current.value = ""
		}
	}

	const modalBodyContent = (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<div className="w-full divide-y divide-gray-300/50 ">
					{repairItem && (
						<>
							<div className="px-4 py-2">
								<div className="text-xl font-medium">
									{repairItem.storeName}
								</div>
								<div className="text-gray-500">{`${repairItem.product.name} ${
									repairItem.product.van === "없음"
										? ""
										: repairItem.product.van
								} / ${repairItem.user}`}</div>
							</div>

							<DetailListItem title="날짜" desc={repairItem.date} />
							<DetailListItem
								title="고장증상"
								desc={repairItem.symptom || ""}
							/>
							<DetailListItem title="수량" desc={`${repairItem.qty}대`} />
							<DetailListItem
								title="제품번호"
								desc={`${repairItem.productNum}`}
							/>
							<DetailListItem
								title="송장번호"
								desc={repairItem.invoiceNum ? repairItem.invoiceNum : "없음"}
							/>
							<DetailListItem title="메모" desc={repairItem.note} />
							<DetailListItem
								title="댓글"
								desc={
									<>
										<div className="overflow-auto max-h-80">
											{repairItem.reply.map((item, index) => (
												<div
													className="flex-col justify-between mb-2"
													key={index}
												>
													<div className="mb-1">
														<span className="text-sm ">{item.writerName} </span>
														<span className="text-sm text-gray-300">
															{item.date}
														</span>
													</div>
													<div className="pl-2">{item.note}</div>
												</div>
											))}
										</div>
										<div>
											<form
												onSubmit={onReplySubmit}
												className="grid grid-cols-12 gap-2 "
											>
												<input
													ref={replyInputRef}
													type="text"
													className="block w-full col-span-10 px-4 my-1 border border-gray-300 rounded-md shadow-sm h-9 lg:text-sm focus:ring-2 focus:outline-none"
												/>

												<div className="col-span-2 py-1">
													<Button label="등록" type="submit" small />
												</div>
											</form>
										</div>
									</>
								}
							/>

							<div className="flex w-full gap-4 p-2">
								{repairItemState === "수리접수" ||
								repairItemState === "수리완료" ? (
									<Button
										onClick={
											repairItemState === "수리접수"
												? () => repairCompletedHandler("수리접수")
												: () => repairCompletedHandler("원복완료")
										}
										label={
											repairItemState === "수리접수" ? "수리완료" : "원복완료"
										}
									/>
								) : (
									<></>
								)}

								{repairItemState === "수리완료" && (
									<Button
										onClick={() => repairCompletedHandler("재고입고")}
										label="재고입고"
									/>
								)}
							</div>
						</>
					)}
				</div>
			)}
		</>
	)

	return (
		<Modal
			title={`${repairItemState}`}
			onClose={detailRepairModal.onClose}
			isOpen={detailRepairModal.isOpen}
			body={modalBodyContent}
			isLoading={isLoading}
		/>
	)
}

export default DetailRepairModal
