import { useCallback, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { cityItems, inOperationItems } from "../../lib/variables/variables"

import { vanItems } from "../../lib/variables/variables"
import { DownArrow } from "../ui/icons/icons"
import { format } from "date-fns"
import { editItemforDropdownButton } from "../../lib/util/dropdown-util"
import { useGetAllItemsByUrlQuery } from "../../query/api"
import {
	useGetStoreByIdQuery,
	useAddStoreAsMutation,
	useUpdateStoreMutation,
} from "../../query/storeApi"
import Dropdown from "react-dropdown"
import Loader from "../ui/loader"
import { useController, useForm } from "react-hook-form"
import { StoreProductCheckbox } from "../ui/store-product-checkbox"

export default function EditStoreComponent({ storeId, modalHandler }) {
	const today = new Date()
	const formattedToday = format(today, "yyyy-MM-dd")
	const { data: session } = useSession()

	const { data, isLoading } = useGetStoreByIdQuery({ storeId })
	const item = data?.store

	const [addStoreAs] = useAddStoreAsMutation()
	const [updateStore] = useUpdateStoreMutation()
	const { data: allUsersData } = useGetAllItemsByUrlQuery({ url: "user" })
	const editedUsers = editItemforDropdownButton(allUsersData?.users)

	const { register, reset, control, watch, handleSubmit } = useForm({
		mode: "onSubmit",
		defaultValues: {
			contractDate: "",
			note: "",
			storeName: "",
			businessNum: "",
			address: "",
			owner: "",
			contact: "",
			vanId: "",
			vanCode: "",
			cms: "",
		},
	})
	// console.log(watch())
	const { field: city } = useController({
		name: "city",
		control,
		defaultValue: "",
	})
	const { field: user } = useController({
		name: "user",
		control,
		defaultValue: "",
	})
	const { field: inOperation } = useController({
		name: "inOperation",
		control,
		defaultValue: "",
	})
	const { field: van } = useController({
		name: "van",
		control,
		defaultValue: "",
	})

	const [isEditable, setIsEditable] = useState(false)
	const [closeDate, setCloseDate] = useState("")
	const [users, setUsers] = useState([])

	const [asNote, setAsNote] = useState([])
	const [asNoteDate, setAsNoteDate] = useState("")
	const [asNoteValue, setAsNoteValue] = useState("")

	useEffect(() => {
		if (item) {
			setAsNote(item.asNote)
			setAsNoteDate(formattedToday)

			setUsers(editedUsers)

			reset({
				contractDate: item.contractDate,
				note: item.note,
				storeName: item.storeName,
				businessNum: item.businessNum,
				address: item.address,
				owner: item.owner,
				contact: item.contact,
				vanId: item.vanId,
				vanCode: item.vanCode,
				cms: item.cms,
				van: item.van,
				city: item.city,
				user: item.user,
				product: item.product,
				inOperation: item.inOperation,
			})
		}
	}, [item])

	const filteredBusinessNum = useCallback(
		(plainNumber) => {
			if (!isEditable) {
				const parsedPlainNumber = String(plainNumber)
				const filteredNumber = `${parsedPlainNumber.slice(
					0,
					3,
				)}-${parsedPlainNumber.slice(3, 5)}-${parsedPlainNumber.slice(5, 10)}`

				return filteredNumber
			}
		},
		[isEditable],
	)

	const editStoreSubmitHandler = async (formData) => {
		if (String(formData.businessNum).length != 10) {
			alert("사업자번호는 10자리 입니다.")
			return
		}

		const accept = confirm("정보를 수정 하시겠습니까?")

		if (!accept) {
			return
		}

		const body = {
			_id: item._id,
			closeDate,
			...formData,
		}

		const { data: response } = await updateStore(body)
		if (response.success) {
			setIsEditable(!isEditable)
		}
		alert(response.message)
	}

	const asNoteSubmitHandler = async (e) => {
		const accept = confirm("수리내역을 저장 하시겠습니까?")
		if (!accept) {
			return
		} else {
			e.preventDefault()

			const body = {
				storeId: item._id,
				writerName: session.user.name,
				date: asNoteDate,
				note: asNoteValue,
			}
			const { data: response } = await addStoreAs(body)
			if (response.success) {
				alert(response.message)
				setAsNoteValue("")
			} else {
				alert(response.message)
			}
		}
	}

	const onCloseStateHandler = (selectedItem) => {
		const { value } = selectedItem
		if (value === "폐업") {
			const accept = confirm("폐업으로 변경 하시겠습니까?")

			if (!accept) {
				// 폐업 변경 안할시에 다시 원래대로 돌아가게 해야 하는데 어쩌지..
				const oldInOperation = item.inOperation
				setInOperation(oldInOperation)
				setItem((prev) => prev)

				return
			}

			const closeDateInput = prompt(
				"폐업 일자를 입력 해주세요. ex) 2022-11-22",
				formattedToday,
			)

			alert(`${closeDateInput}로 폐업처리 합니다. 수정완료 해주세요.`)
			setCloseDate(closeDateInput)
			setInOperation(value)
			return
		}

		setInOperation(value)
		return
	}

	return (
		<div className="w-full container">
			{isLoading && <Loader />}
			{item && (
				<form
					onSubmit={handleSubmit(editStoreSubmitHandler)}
					className="flex flex-col p-3 
					lg:flex-row lg:justify-between lg:divide-x lg:divide-gray-300  lg:w-[80rem]"
				>
					<div
						className="w-full p-1 lg:m-3 grid grid-cols-5 gap-3
									lg:gap-4"
					>
						<div className="col-span-3 lg:col-span-2">
							<label className="input-label " htmlFor="contract-date">
								계약일자
							</label>
							<input
								className="input-text"
								id="contract-date"
								type="date"
								{...register("contractDate")}
								disabled={!isEditable}
							/>
						</div>
						<div className="col-span-2 lg:col-span-1">
							<label className="input-label">담당자</label>
							<Dropdown
								arrowClosed={<DownArrow />}
								arrowOpen={<DownArrow />}
								options={users}
								disabled={!isEditable}
								onChange={(data) => user.onChange(data.value)}
								value={user.value}
							/>
						</div>
						<div className="col-span-3 lg:col-span-1">
							<label className="input-label">VAN</label>
							<Dropdown
								arrowClosed={<DownArrow />}
								arrowOpen={<DownArrow />}
								options={vanItems}
								onChange={(data) => van.onChange(data.value)}
								value={van.value}
								disabled={!isEditable}
							/>
						</div>
						<div className="col-span-2 lg:col-span-1">
							<label className="input-label">영업상태</label>
							<Dropdown
								arrowClosed={<DownArrow />}
								arrowOpen={<DownArrow />}
								options={inOperationItems}
								disabled={!isEditable}
								onChange={(data) => inOperation.onChange(data.value)}
								value={inOperation.value}
							/>
						</div>
						<div className="col-span-5 lg:col-span-3">
							<label className="input-label">상호명</label>
							<input
								className="input-text"
								{...register("storeName")}
								required
								disabled={!isEditable}
							/>
						</div>
						<div className="col-span-3 lg:col-span-2">
							<label className="input-label">사업자번호</label>
							<input
								className="input-text"
								maxLength={10}
								{...register("businessNum")}
								required
								disabled={!isEditable}
							/>
						</div>
						<div className="col-span-2 lg:col-span-1">
							<label className="input-label">도시</label>
							<Dropdown
								arrowClosed={<DownArrow />}
								arrowOpen={<DownArrow />}
								options={cityItems}
								disabled={!isEditable}
								onChange={(data) => city.onChange(data.value)}
								value={city.value}
							/>
						</div>
						<div className="col-span-5 lg:col-span-4">
							<label className="input-label">주소</label>
							<input
								className="input-text"
								{...register("address")}
								required
								disabled={!isEditable}
							/>
						</div>

						<div className="col-span-2 lg:col-span-2">
							<label className="input-label">대표자명</label>
							<input
								className="input-text"
								{...register("owner")}
								required
								disabled={!isEditable}
							/>
						</div>
						<div className="col-span-3 lg:col-span-2">
							<label className="input-label">연락처</label>
							<input
								className="input-text"
								{...register("contact")}
								disabled={!isEditable}
							/>
						</div>
						<div className="col-span-5 lg:col-span-1">
							<label className="input-label">CMS</label>
							<input
								className="input-text"
								{...register("cms")}
								required
								disabled={!isEditable}
							/>
						</div>
						<div className="col-span-5">
							<div className="input-label">장비</div>
							<div className="flex">
								<StoreProductCheckbox
									control={control}
									name="product"
									disabled={!isEditable}
								/>
							</div>
						</div>

						<div className="col-span-2">
							<label className="input-label">VAN Code</label>
							<input
								className="input-text"
								{...register("vanCode")}
								disabled={!isEditable}
							/>
						</div>
						<div className="col-span-3">
							<label className="input-label">VAN ID</label>
							<input
								className="input-text"
								{...register("vanId")}
								disabled={!isEditable}
							/>
						</div>
					</div>
					<div className="w-full  p-3 grid grid-cols-5 gap-3">
						<div className="col-span-5">
							<label className="input-label">비고</label>
							<textarea
								rows={6}
								{...register("note")}
								disabled={!isEditable}
								className="input-textarea"
							></textarea>
						</div>
						<div className="col-span-5 flex flex-col justify-between ">
							<div>
								<label className="input-label  border-b-2 border-gray-transparent">
									수리내역
								</label>

								<div
									className={`mt-3 mb-3   border-gray-300 rounded-md p-2 overflow-auto  max-h-60
									${asNote.length < 1 ? "" : "border"}`}
								>
									{asNote &&
										asNote
											.slice()
											.reverse()
											.map((item, index) => (
												<div
													key={index}
													className="flex-col justify-between mb-2"
												>
													<div className="mb-1">
														<span className=" text-sm ">
															{item.writerName}{" "}
														</span>
														<span className="text-sm text-gray-300">
															{item.date}
														</span>
													</div>
													<div className="pl-2">{item.note}</div>
												</div>
											))}
								</div>
							</div>
							<div>
								<div
									className="flex flex-col lg:flex-row"
									onSubmit={asNoteSubmitHandler}
								>
									<input
										className="input-text h-9 w-full lg:w-1/3 mr-2"
										id="asNote-date"
										type="date"
										value={asNoteDate}
										onChange={(event) => setAsNoteDate(event.target.value)}
									/>
									<input
										type="text"
										value={asNoteValue}
										onChange={(event) => setAsNoteValue(event.target.value)}
										className="px-4 h-9 my-1 block w-full  rounded-md border border-gray-300 
												shadow-lg lg:text-sm focus:border-primary focus:ring-2  
												focus:ring-primary focus:outline-none mr-1"
									/>
									<button
										className={`input-button mt-1 h-9 ${
											isEditable ? "hidden" : "block"
										}  `}
										type="button"
										onClick={asNoteSubmitHandler}
									>
										등록
									</button>
								</div>
							</div>
							<div className="col-span-5 flex items-end h-fit">
								<div className="w-full mr-1 mb-2">
									<button
										className={`input-button w-full ${
											isEditable ? "block" : "hidden"
										} `}
										type="submit"
									>
										수정완료
									</button>
									<button
										className={`input-button w-full ${
											isEditable ? "hidden" : "block"
										}  `}
										type="button"
										onClick={() => setIsEditable(!isEditable)}
									>
										정보수정
									</button>
								</div>
								<div className="w-full ml-1 mb-2">
									<button
										className={`input-button w-full ${
											isEditable ? "hidden" : "block"
										}`}
										onClick={modalHandler}
									>
										확인
									</button>
									<button
										className={`input-button w-full ${
											isEditable ? "block" : "hidden"
										}`}
										onClick={() => setIsEditable(!isEditable)}
									>
										취소
									</button>
								</div>
							</div>
						</div>
					</div>
				</form>
			)}
		</div>
	)
}
