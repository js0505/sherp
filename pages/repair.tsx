import getProducts from "@/actions/getProducts"
import Button from "@/components/Button"
import Container from "@/components/Container"
import Heading from "@/components/Heading"
import Input from "@/components/inputs/Input"
import DetailRepairModal from "@/components/modals/DetailRepairModal"
import RegisterRepairModal from "@/components/modals/RegisterRepairModal"
import Pagenation from "@/components/Pagenation"
import RepairCardItem from "@/components/repair/RepairCardItem"
import Loader from "@/components/Loader"
import useDetailRepairModal from "@/hooks/useDetailRepairModal"
import useRegisterRepairModal from "@/hooks/useRegisterRepairModal"
import { Repair as RepairType } from "@/models/Repair"
import {
	useGetRepairListByStateQuery,
	useGetRepairLogQuery,
} from "@/query/repairApi"
import React, { useEffect, useState } from "react"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import useCheckSession from "@/hooks/useCheckSession"

type IRepairState = "수리접수" | "수리완료" | "로그"

export async function getServerSideProps() {
	const products = await getProducts()

	return {
		props: { products },
	}
}

function Repair({ products }) {
	useCheckSession()
	const [state, setState] = useState<IRepairState>("수리접수")
	const [repairItems, setRepairItems] = useState<RepairType[]>([])
	const [page, setPage] = useState(1) // 현재 페이지네이션 번호
	const [query, setQuery] = useState({
		productNum: "",
		storeName: "",
	})

	const maxPosts = 6

	const detailRepairModal = useDetailRepairModal()
	const registerRepairModal = useRegisterRepairModal()

	const {
		register,
		formState: { errors },
		handleSubmit,
		reset,
		control,
		watch,
		setValue,
		getValues,
	} = useForm<FieldValues>({
		mode: "onSubmit",
		defaultValues: {
			productNum: "",
			storeName: "",
		},
	})

	const {
		data: repairLogItems,
		isLoading: isRepairLogLoading,
		refetch: refetchRepairLog,
	} = useGetRepairLogQuery({
		page,
		maxPosts,
		storeName: query.storeName,
		productNum: query.productNum,
	})

	const {
		data: fetchedRepairItems,
		isLoading: isRepairItemsLoading,
		refetch: refetchRepairListByState,
	} = useGetRepairListByStateQuery({
		state,
	})

	const pageHandleFunction = (e) => {
		const { selected } = e

		setPage(selected + 1)
	}

	const resetButtonHandler = () => {
		if (state !== "로그") {
			reset()
			refetchRepairListByState()
			setRepairItems(fetchedRepairItems.repairs)
			return
		}

		if (state === "로그") {
			reset()
			setQuery({
				productNum: "",
				storeName: "",
			})

			return
		}
	}

	const handleStateButton = (newState) => {
		if (state === newState) {
			return
		}

		setState(() => newState)
	}
	const onSubmit: SubmitHandler<FieldValues> = async (formData) => {
		if (formData.productNum === "" && formData.storeName === "") {
			return
		}

		if (formData.productNum && formData.storeName) {
			alert("한가지 조건으로 검색 해주세요.")
			return
		}

		// 검색 버튼 누르는 당시 상태가 접수나 입고 인 경우
		if (state !== "로그") {
			const copyRepairItems = [...repairItems]
			const filteredCopyRepairItems = copyRepairItems.filter((item) => {
				if (formData.productNum) {
					return item.productNum.includes(formData.productNum)
				}
				if (formData.storeName) {
					return item.storeName.includes(formData.storeName)
				}
			})

			if (filteredCopyRepairItems.length === 0) {
				alert("검색 결과가 없습니다.")
				reset()
				return
			}
			setRepairItems(filteredCopyRepairItems)
			return
		}

		// 수리완료된 내역에서 검색 버튼 입력 시
		if (state === "로그") {
			setQuery({
				storeName: formData.storeName,
				productNum: formData.productNum,
			})
		}
	}

	const onRepairItemClick = (item) => {
		detailRepairModal.setRepairId(item._id)
		detailRepairModal.onOpen()
	}

	useEffect(() => {
		if (
			(state === "수리완료" && fetchedRepairItems) ||
			(state === "수리접수" && fetchedRepairItems)
		) {
			setRepairItems(fetchedRepairItems.repairs)
		}

		if (state === "로그" && repairLogItems) {
			setRepairItems(repairLogItems.repairs)
		}
	}, [fetchedRepairItems, repairLogItems, state])

	return (
		<>
			{isRepairItemsLoading && isRepairLogLoading && <Loader />}

			{detailRepairModal.isOpen && <DetailRepairModal />}
			{registerRepairModal.isOpen && (
				<RegisterRepairModal products={products} />
			)}

			<Container>
				<Heading title="수리내역 관리" />
				<div className="flex flex-col gap-4 pt-4 md:flex-row">
					<div className="w-full md:basis-1/5">
						<div className="flex flex-col gap-5 ">
							<form
								onSubmit={handleSubmit(onSubmit)}
								className="grid grid-cols-12 gap-2"
							>
								<div className="col-span-4">
									<Button
										outline={state !== "수리접수"}
										label="접수"
										onClick={() => {
											handleStateButton("수리접수")
										}}
									/>
								</div>
								<div className="col-span-4 ">
									<Button
										outline={state !== "수리완료"}
										label="입고"
										onClick={() => {
											handleStateButton("수리완료")
										}}
									/>
								</div>
								<div className="col-span-4 ">
									<Button
										outline={state === "수리접수" || state === "수리완료"}
										label="완료"
										onClick={() => {
											handleStateButton("로그")
										}}
									/>
								</div>
								<div className="col-span-6 md:col-span-12">
									<Input
										id="storeName"
										label="가맹점명"
										errors={errors}
										register={register}
									/>
								</div>

								<div className="col-span-6 md:col-span-12">
									<Input
										id="productNum"
										label="제품번호"
										errors={errors}
										register={register}
									/>
								</div>

								<div className="col-span-6 md:col-span-6">
									<Button label="검색" type="submit" />
								</div>
								<div className="col-span-6 md:col-span-6">
									<Button label="초기화" onClick={resetButtonHandler} />
								</div>
								<div className="hidden md:block md:col-span-12">
									<Button
										outline
										label="신규 수리 접수"
										onClick={() => registerRepairModal.onOpen()}
									/>
								</div>
							</form>
						</div>
					</div>
					<div
						className="
								flex
								flex-col
								md:px-8
								md:basis-4/5
								overflow-auto
								md:h-[72vh]
						"
					>
						{repairItems &&
							repairItems.map((item, index) => (
								<div
									key={index + item.storeName}
									onClick={() => onRepairItemClick(item)}
								>
									<RepairCardItem item={item} />
								</div>
							))}
						{state === "로그" && (
							<Pagenation
								onPageChange={pageHandleFunction}
								pageRangeDisplayed={maxPosts}
								pageCount={repairLogItems.totalPosts}
							/>
						)}
					</div>
				</div>
			</Container>
		</>
	)
}

export default Repair
