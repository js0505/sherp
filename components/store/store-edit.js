import { useEffect, useState } from "react"
import { cityItems, inOperationItems } from "../../lib/variables/variables"
import { vanItems } from "../../lib/variables/variables"
import { format } from "date-fns"
import { editUserforDropdown } from "../../lib/util/dropdown-util"
import { useGetAllItemsByUrlQuery } from "../../query/api"
import {
	useGetStoreByIdQuery,
	useUpdateStoreMutation,
	useDeleteStoreMutation,
} from "../../query/storeApi"

import Loader from "../ui/loader"
import { useForm } from "react-hook-form"
import { StoreProductCheckbox } from "../ui/store-product-checkbox"
import { toast } from "react-toastify"
import { Dropdown } from "../ui/dropdown"

export default function EditStoreComponent({ storeId, modalHandler }) {
	const today = new Date()
	const formattedToday = format(today, "yyyy-MM-dd")

	const { data, isLoading } = useGetStoreByIdQuery({ storeId })
	const item = data?.store

	const [updateStore] = useUpdateStoreMutation()
	const [deleteStore] = useDeleteStoreMutation()
	const { data: allUsersData } = useGetAllItemsByUrlQuery({ url: "user" })
	const editedUsers = editUserforDropdown(allUsersData?.users)

	const { register, reset, control, setValue, handleSubmit } = useForm({
		mode: "onSubmit",
		defaultValues: {
			contractDate: "",
			closeDate: "",
			note: "",
			storeName: "",
			businessNum: "",
			address: "",
			owner: "",
			contact: "",
			vanId: "",
			vanCode: "",
			cms: "",
			product: {
				pos: false,
				kiosk: false,
				printer: false,
				cat: false,
				router: false,
			},
			user: "",
			van: "",
			city: "",
			inOperation: "",
		},
	})

	const [users, setUsers] = useState([])
	const [asNote, setAsNote] = useState([])
	const [isStoreEditLoading, setIsStoreEditLoading] = useState(false)

	useEffect(() => {
		if (item) {
			setAsNote(item.asNote)
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
				van: item.van,
				cms: item.cms,
				city: item.city,
				user: item.user,
				product: item.product,
				inOperation: item.inOperation,
				closeDate: item.closeDate,
			})
		}
	}, [item])

	const editStoreSubmitHandler = async (formData) => {
		setIsStoreEditLoading(true)
		if (String(formData.businessNum).length != 10) {
			alert("사업자번호는 10자리 입니다.")
			return
		}

		const accept = confirm("변경된 정보를 저장 하시겠습니까?")
		if (!accept) {
			setIsStoreEditLoading(false)
			return
		}

		const body = {
			_id: item._id,
			...formData,
		}

		const { data: response } = await updateStore(body)

		if (response.success) {
			toast.success(response.message)
		} else {
			toast.error(response.message)
		}
		setIsStoreEditLoading(false)
	}

	const onCloseStateHandler = (selectedItem) => {
		const { value } = selectedItem
		if (value === "폐업") {
			const accept = confirm("폐업으로 변경 하시겠습니까?")

			if (!accept) {
				// 폐업 변경 안할시에 다시 원래대로 돌아가게 해야 하는데 어쩌지..
				const oldValue = item.inOperation
				setValue("inOperation", oldValue)

				return
			}

			const closeDateInput = prompt(
				"폐업 일자를 입력 해주세요. ex) 2022-11-22",
				formattedToday,
			)

			alert(`${closeDateInput}로 폐업처리 합니다. 수정완료 해주세요.`)

			setValue("inOperation", value)
			setValue("closeDate", closeDateInput)

			return
		}

		setValue("inOperation", value)

		return
	}

	const onStoreDeleteHandler = async () => {
		const accept = confirm(
			"가맹점을 삭제하면 복구할 수 없습니다. 진행 하시겠습니까?",
		)

		if (!accept) {
			return
		}

		const storeId = item._id

		const response = await deleteStore({ storeId })

		if (response.data.success) {
			toast.success(response.data.message)
			modalHandler()
		} else {
			alert(response.data.message)
		}
	}

	return (
		<div className="w-full container">
			{isLoading && <Loader />}
			{isStoreEditLoading && <Loader />}
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
							/>
							<input id="close-date" type="hidden" {...register("closeDate")} />
						</div>
						<div className="col-span-2 lg:col-span-1">
							<label className="input-label">담당자</label>
							<Dropdown control={control} options={users} name="user" />
						</div>
						<div className="col-span-3 lg:col-span-1">
							<label className="input-label">VAN</label>
							<Dropdown control={control} options={vanItems} name="van" />
						</div>
						<div className="col-span-2 lg:col-span-1">
							<label className="input-label">영업상태</label>
							<Dropdown
								control={control}
								options={inOperationItems}
								name="inOperation"
								onChange={(item) => onCloseStateHandler(item)}
							/>
						</div>
						<div className="col-span-5 lg:col-span-3">
							<label className="input-label">상호명</label>
							<input
								className="input-text"
								{...register("storeName")}
								required
							/>
						</div>
						<div className="col-span-3 lg:col-span-2">
							<label className="input-label">사업자번호</label>
							<input
								className="input-text"
								maxLength={10}
								{...register("businessNum")}
								required
							/>
						</div>
						<div className="col-span-2 lg:col-span-1">
							<label className="input-label">도시</label>
							<Dropdown control={control} options={cityItems} name="city" />
						</div>
						<div className="col-span-5 lg:col-span-4">
							<label className="input-label">주소</label>
							<input className="input-text" {...register("address")} required />
						</div>

						<div className="col-span-2 lg:col-span-2">
							<label className="input-label">대표자명</label>
							<input className="input-text" {...register("owner")} required />
						</div>
						<div className="col-span-3 lg:col-span-2">
							<label className="input-label">연락처</label>
							<input className="input-text" {...register("contact")} />
						</div>
						<div className="col-span-5 lg:col-span-1">
							<label className="input-label">CMS</label>
							<input className="input-text" {...register("cms")} required />
						</div>
						<div className="col-span-5">
							<div className="input-label">장비</div>
							<div className="flex">
								<StoreProductCheckbox control={control} name="product" />
							</div>
						</div>

						<div className="col-span-2">
							<label className="input-label">VAN Code</label>
							<input className="input-text" {...register("vanCode")} />
						</div>
						<div className="col-span-3">
							<label className="input-label">VAN ID</label>
							<input className="input-text" {...register("vanId")} />
						</div>
					</div>
					<div className="w-full p-3  flex flex-col justify-between ">
						<div className="col-span-5 h-full">
							<label className="input-label">비고</label>
							<textarea
								rows={6}
								{...register("note")}
								className="input-textarea h-full"
							></textarea>
						</div>
						<div className="col-span-5 flex flex-col ">
							<div
								className={`mt-3 mb-3   border-gray-300 rounded-md p-2 overflow-auto `}
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
													<span className=" text-sm ">{item.writerName} </span>
													<span className="text-sm text-gray-300">
														{item.date}
													</span>
												</div>
												<div className="pl-2">{item.note}</div>
											</div>
										))}
							</div>
						</div>
						<div className="col-span-5 flex items-end h-fit">
							<div className="w-full mr-1 mb-2">
								<button className="input-button w-full" type="submit">
									저장
								</button>
							</div>
							<div className={`w-full mb-2 hidden lg:block`}>
								<button
									className="input-button w-full"
									type="button"
									onClick={onStoreDeleteHandler}
								>
									가맹점 삭제
								</button>
							</div>
							<div className="w-full ml-1 mb-2">
								<button className="input-button w-full" onClick={modalHandler}>
									닫기
								</button>
							</div>
						</div>
					</div>
				</form>
			)}
		</div>
	)
}
